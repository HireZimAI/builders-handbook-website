// The Builder's Handbook — navigation toggle + episode catalogue rendering.
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var episodes = window.BH_EPISODES || [];

  // Homepage "Latest Episode" feature follows the newest catalogue entry.
  var latest = episodes[0];
  if (latest) {
    var frame = document.getElementById('featured-video');
    if (frame && frame.getAttribute('src').indexOf(latest.id) === -1) {
      frame.setAttribute('src', 'https://www.youtube.com/embed/' + latest.id);
      frame.setAttribute('title', latest.title);
    }
    var caption = document.getElementById('featured-caption');
    if (caption) caption.textContent = latest.title;
  }

  // Episodes grid: one card per catalogue entry, newest first.
  var grid = document.getElementById('episode-grid');
  if (grid) {
    var fmt = function (iso) {
      try {
        return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      } catch (e) { return ''; }
    };
    grid.innerHTML = episodes.map(function (ep) {
      var badge = ep.kind === 'Trailer' ? 'Trailer' : (ep.duration || '');
      return '<a class="episode-card" href="https://www.youtube.com/watch?v=' + ep.id + '" target="_blank" rel="noopener">' +
        '<div class="episode-thumb"><img src="https://i.ytimg.com/vi/' + ep.id + '/hqdefault.jpg" alt="' + ep.title.replace(/"/g, '&quot;') + '" loading="lazy">' +
        (badge ? '<span class="episode-badge">' + badge + '</span>' : '') + '</div>' +
        '<div class="episode-meta"><span class="episode-kind">' + ep.kind + '</span>' +
        '<span class="episode-title">' + ep.title + '</span>' +
        '<span class="episode-date">' + fmt(ep.published) + '</span></div></a>';
    }).join('');
  }
});
