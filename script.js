const episodes = [
  { num: '06', title: "Building Businesses That Outlast You", guest: "Dara Okafor", category: "Business", duration: "47:12" },
  { num: '05', title: "The Discipline of Great Leadership", guest: "Marcus Bello", category: "Leadership", duration: "52:04" },
  { num: '04', title: "AI Without the Hype", guest: "Priya Nair", category: "AI · Technology", duration: "41:38" },
  { num: '03', title: "Faith, Work, and the Meaning of Purpose", guest: "Pastor Daniel Moyo", category: "Faith", duration: "58:20" },
  { num: '02', title: "Designing Communities That Endure", guest: "Sarah Klein", category: "Society", duration: "44:57" },
  { num: '01', title: "Innovating for the Next Decade", guest: "Tobias Lund", category: "Innovation · The Future", duration: "49:15" },
];
const categories = ["Business", "Leadership", "Technology", "AI", "Faith", "Society", "Innovation", "The Future"];
const platformIcons = {
  YouTube: '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.5ZM9.75 15.5v-7l6 3.5Z"/></svg>',
  Spotify: '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22Zm5 15.9a.7.7 0 0 1-.95.23c-2.6-1.6-5.9-1.95-9.75-1.07a.69.69 0 1 1-.3-1.34c4.2-.96 7.85-.55 10.77 1.23.33.2.43.64.23.95Zm1.35-3a.86.86 0 0 1-1.18.28c-3-1.83-7.55-2.36-11.1-1.29a.86.86 0 1 1-.5-1.65c4.05-1.23 9.07-.64 12.5 1.47.4.25.53.78.28 1.18Zm.12-3.13C15 8.6 8.9 8.4 5.4 9.46a1.03 1.03 0 1 1-.6-1.97C8.82 6.27 15.55 6.5 19.5 8.85a1.03 1.03 0 1 1-1.06 1.77Z"/></svg>',
  "Apple Podcasts": '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-4.6 18.88l.42-1.86A8.1 8.1 0 1 1 12 20.1a8 8 0 0 1-.82-.04l-.42 1.85A10 10 0 0 0 12 2Z"/><circle cx="12" cy="9.6" r="2.4"/><path d="M9.1 20.6c0-1 .8-1.7 2.9-1.7s2.9.7 2.9 1.7l-.64 2.5c-.2.75-.55 1.1-2.26 1.1s-2.06-.35-2.26-1.1Z"/></svg>',
};
const platforms = [
  { name: "YouTube", action: "Watch" },
  { name: "Spotify", action: "Follow" },
  { name: "Apple Podcasts", action: "Subscribe" },
];

const epListEl = document.getElementById('bh-episode-list');
episodes.forEach(ep => {
  const a = document.createElement('a');
  a.href = '#';
  a.className = 'ep-row';
  a.style.cssText = "display: grid; grid-template-columns: 56px 1fr auto; align-items: center; gap: clamp(16px, 3vw, 32px); padding: 22px 8px; border-bottom: 1px solid rgba(30,30,30,0.1); color: #1E1E1E;";
  a.innerHTML = `
    <span style="font-family: 'Playfair Display', serif; font-size: 26px; color: #B08D57; font-weight: 600;">${ep.num}</span>
    <span style="min-width: 0;">
      <span style="display: block; font-family: 'Playfair Display', serif; font-size: clamp(18px, 2.4vw, 23px); font-weight: 600; line-height: 1.2;">${ep.title}</span>
      <span style="display: block; margin-top: 7px; font-size: 12.5px; letter-spacing: 0.06em; text-transform: uppercase; color: #666666; font-weight: 500;">${ep.category} &middot; ${ep.guest}</span>
    </span>
    <span style="display: inline-flex; align-items: center; gap: 16px;">
      <span style="font-size: 13px; color: #666666; font-variant-numeric: tabular-nums; white-space: nowrap;">${ep.duration}</span>
      <span style="flex: none; width: 40px; height: 40px; border-radius: 999px; border: 1px solid rgba(30,30,30,0.18); display: inline-flex; align-items: center; justify-content: center; color: #1E1E1E;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 2px;"><path d="M7 5.5v13a1 1 0 0 0 1.53.85l10.5-6.5a1 1 0 0 0 0-1.7L8.53 4.65A1 1 0 0 0 7 5.5Z"/></svg>
      </span>
    </span>`;
  epListEl.appendChild(a);
});

const catEl = document.getElementById('bh-categories');
categories.forEach(cat => {
  const span = document.createElement('span');
  span.className = 'cat-pill';
  span.textContent = cat;
  span.style.cssText = "padding: 11px 22px; border: 1px solid rgba(247,244,238,0.2); border-radius: 999px; font-size: 14px; letter-spacing: 0.04em; font-weight: 500; color: rgba(247,244,238,0.85);";
  catEl.appendChild(span);
});

const platEl = document.getElementById('bh-platforms');
platforms.forEach(p => {
  const a = document.createElement('a');
  a.href = '#';
  a.className = 'listen-card';
  a.style.cssText = "display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 34px 20px; background: rgba(247,244,238,0.04); border: 1px solid rgba(247,244,238,0.1); border-radius: 18px; color: #F7F4EE;";
  a.innerHTML = `
    <span style="width: 54px; height: 54px; border-radius: 999px; background: rgba(176,141,87,0.14); color: #B08D57; display: inline-flex; align-items: center; justify-content: center;">${platformIcons[p.name]}</span>
    <span style="font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600;">${p.name}</span>
    <span style="font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,244,238,0.55); font-weight: 500;">${p.action}</span>`;
  platEl.appendChild(a);
});

// Audio player simulation
const DUR = 2832; // 47:12 in seconds
let current = 0;
let playing = false;
let timer = null;
const fmt = s => Math.floor(s/60) + ':' + String(Math.floor(s%60)).padStart(2,'0');
const curEl = document.getElementById('bh-cur-time');
const progEl = document.getElementById('bh-progress');
const playIcon = document.getElementById('bh-icon-play');
const pauseIcon = document.getElementById('bh-icon-pause');

function render() {
  curEl.textContent = fmt(current);
  progEl.style.width = (current/DUR*100).toFixed(2) + '%';
  playIcon.style.display = playing ? 'none' : 'inline';
  pauseIcon.style.display = playing ? 'inline' : 'none';
}
function stop() { if (timer) { clearInterval(timer); timer = null; } playing = false; render(); }
function start() {
  stop(); playing = true; render();
  timer = setInterval(() => {
    current += 0.5;
    if (current >= DUR) { current = 0; stop(); return; }
    render();
  }, 500);
}
document.getElementById('bh-play-btn').addEventListener('click', () => { playing ? stop() : start(); });
document.getElementById('bh-seek-track').addEventListener('click', (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  const pct = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
  current = pct * DUR;
  render();
});
render();
