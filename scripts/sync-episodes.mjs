// Syncs episodes.js with The Builder's Handbook YouTube channel.
// - Fetches the public channel RSS feed (latest ~15 uploads).
// - Fallback when the feed is unavailable: scrapes the public channel
//   /videos page for upload IDs, then each new upload's watch page for its
//   exact publish date. Same public data YouTube renders, no API key needed.
// - Adds any new uploads to the catalogue (newest first).
// - Never removes entries: the RSS feed only covers recent uploads, so
//   anything that falls out of the feed stays listed from this file.
// - Never re-adds EXCLUDED_IDS (owner-requested removals), even while those
//   uploads remain on the channel.
// Run manually with `node scripts/sync-episodes.mjs` or via the
// sync-episodes GitHub Action (daily + on demand).
import { readFileSync, writeFileSync } from 'node:fs';

const FEED = 'https://www.youtube.com/feeds/videos.xml?channel_id=UC8v7DzdzTh8el8hBM_ORJ0Q';
const CHANNEL_VIDEOS = 'https://www.youtube.com/@TheBuildersHandbookchannel/videos';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const FILE = new URL('../episodes.js', import.meta.url);

// Uploads the owner asked to keep off the site. The sync never re-adds these,
// even while they remain on the YouTube channel and in its RSS feed.
const EXCLUDED_IDS = new Set([
  '8GuigtanO5Y', // "Where to start for AI Audits & Implementation" (thumbnail: "How We Build, Audit & Deploy AI for Real Businesses") - removed at owner request 2026-10-23
]);

const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const source = readFileSync(FILE, 'utf8');
const match = source.match(/window\.BH_EPISODES = (\[[\s\S]*?\]);/);
if (!match) throw new Error('Could not find BH_EPISODES in episodes.js');
const existing = JSON.parse(match[1]).filter((e) => !EXCLUDED_IDS.has(e.id));
const known = new Map(existing.map((e) => [e.id, e]));

let entries = [];
let via = 'rss';
const resp = await fetch(FEED, { headers: { 'user-agent': UA } });
if (resp.ok) {
  const xml = await resp.text();
  entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
    id: e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1],
    title: decode(e.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ''),
    published: e.match(/<published>([^<]+)<\/published>/)?.[1],
  })).filter((e) => e.id && e.title && e.published && !EXCLUDED_IDS.has(e.id));
  if (!entries.length) console.log('Feed returned no usable entries; trying channel page.');
} else {
  console.log(`Feed unavailable (HTTP ${resp.status}); trying channel page.`);
}

if (!entries.length) {
  via = 'channel-page';
  const html = await (await fetch(CHANNEL_VIDEOS, { headers: { 'user-agent': UA } })).text();
  const found = new Map();
  // Channel grid items are lockupViewModel blocks: thumbnail URL carries the
  // video ID, the item title follows in the same block.
  for (const chunk of html.split('lockupViewModel')) {
    const id = chunk.match(/i\.ytimg\.com\/vi\/([A-Za-z0-9_-]{11})\//)?.[1];
    const raw = chunk.match(/"title":\{"content":"((?:[^"\\]|\\.)*)"/)?.[1];
    if (!id || !raw || found.has(id)) continue;
    try { found.set(id, JSON.parse(`"${raw}"`)); } catch { found.set(id, raw); }
  }
  for (const [id, title] of found) {
    if (known.has(id) || EXCLUDED_IDS.has(id)) continue;
    const watch = await (await fetch(`https://www.youtube.com/watch?v=${id}`, { headers: { 'user-agent': UA } })).text();
    const iso = watch.match(/"publishDate":"(\d{4}-\d{2}-\d{2})"/)?.[1];
    const human = watch.match(/"publishDate":\{"simpleText":"([^"]+)"/)?.[1];
    const parsed = iso ?? (human && !Number.isNaN(Date.parse(human)) ? new Date(human).toISOString() : null);
    if (parsed) entries.push({ id, title, published: parsed });
  }
}

let added = 0;
for (const entry of entries) {
  if (!known.has(entry.id)) {
    known.set(entry.id, { ...entry, duration: null, kind: 'Episode' });
    added += 1;
  } else if (via === 'rss') {
    // Keep titles fresh if an upload is renamed.
    const cur = known.get(entry.id);
    if (entry.title && cur.title !== entry.title) cur.title = entry.title;
  }
}

const merged = [...known.values()].sort((a, b) => new Date(b.published) - new Date(a.published));
const out = source.replace(/window\.BH_EPISODES = \[[\s\S]*?\];/,
  `window.BH_EPISODES = ${JSON.stringify(merged, null, 2)};`);

if (out !== source) {
  writeFileSync(FILE, out);
  console.log(`episodes.js updated via ${via}: ${added} new upload(s), ${merged.length} total.`);
} else {
  console.log(`No changes via ${via} (${merged.length} episodes).`);
}
