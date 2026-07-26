(function () {
  'use strict';

  const MAX_FLYERS = 6;
  const starsContainer = document.getElementById('stars');

  // ---------- Stars ----------
  function createStars() {
    const count = Math.max(80, Math.floor((window.innerWidth * window.innerHeight) / 7000));
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 0.6;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.left = (Math.random() * 100) + '%';
      star.style.top = (Math.random() * 100) + '%';
      star.style.animationDuration = (Math.random() * 3 + 2) + 's';
      star.style.animationDelay = (Math.random() * 4) + 's';
      frag.appendChild(star);
    }
    starsContainer.appendChild(frag);
  }

  // ---------- Astronaut SVG ----------
  const ASTRONAUT_SVG = `
<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <!-- Backpack -->
  <rect x="33" y="44" width="34" height="30" rx="6" fill="#c8c8d8"/>
  <rect x="38" y="48" width="24" height="4" rx="1" fill="#9a9aac"/>

  <!-- Left leg -->
  <g class="limb leg-left">
    <rect x="32" y="74" width="13" height="26" rx="6" fill="#f4f4fa"/>
    <rect x="30" y="95" width="18" height="9" rx="4" fill="#2a2a3a"/>
  </g>

  <!-- Right leg -->
  <g class="limb leg-right">
    <rect x="55" y="74" width="13" height="26" rx="6" fill="#f4f4fa"/>
    <rect x="52" y="95" width="18" height="9" rx="4" fill="#2a2a3a"/>
  </g>

  <!-- Body suit -->
  <rect x="26" y="40" width="48" height="40" rx="10" fill="#f6f6fb"/>
  <rect x="26" y="40" width="48" height="40" rx="10" fill="none" stroke="#b8b8c8" stroke-width="0.6"/>

  <!-- Chest control panel -->
  <rect x="36" y="52" width="28" height="14" rx="2" fill="#222232"/>
  <rect x="38" y="54" width="24" height="10" rx="1" fill="#0e0e1a"/>
  <circle cx="42" cy="59" r="2" fill="#5f5"/>
  <circle cx="50" cy="59" r="2" fill="#f55"/>
  <circle cx="58" cy="59" r="2" fill="#fc5"/>
  <rect x="40" y="63" width="20" height="1.5" fill="#5af" opacity="0.7"/>

  <!-- Left arm -->
  <g class="limb arm-left">
    <rect x="13" y="44" width="12" height="28" rx="6" fill="#f4f4fa"/>
    <circle cx="19" cy="75" r="6" fill="#f4f4fa"/>
  </g>

  <!-- Right arm -->
  <g class="limb arm-right">
    <rect x="75" y="44" width="12" height="28" rx="6" fill="#f4f4fa"/>
    <circle cx="81" cy="75" r="6" fill="#f4f4fa"/>
  </g>

  <!-- Helmet -->
  <circle cx="50" cy="28" r="22" fill="#f6f6fb"/>
  <circle cx="50" cy="28" r="22" fill="none" stroke="#b8b8c8" stroke-width="0.6"/>

  <!-- Visor -->
  <ellipse cx="50" cy="30" rx="15" ry="13" fill="#142a48"/>
  <ellipse cx="50" cy="30" rx="15" ry="13" fill="url(#visorGrad)" opacity="0.6"/>
  <ellipse cx="44" cy="24" rx="5" ry="3" fill="rgba(255,255,255,0.55)"/>
  <ellipse cx="55" cy="36" rx="2" ry="1.5" fill="rgba(255,255,255,0.3)"/>

  <!-- Antenna -->
  <line x1="50" y1="6" x2="50" y2="2" stroke="#888" stroke-width="1"/>
  <circle cx="50" cy="1.5" r="1.6" fill="#f55"/>

  <!-- Helmet collar -->
  <rect x="30" y="46" width="40" height="3" rx="1.5" fill="#b8b8c8"/>

  <defs>
    <radialGradient id="visorGrad" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="rgba(120,180,255,0.7)"/>
      <stop offset="100%" stop-color="rgba(20,40,80,0)"/>
    </radialGradient>
  </defs>
</svg>`;

  // ---------- Astronaut spawn ----------
  function rand(min, max) { return Math.random() * (max - min) + min; }

  function getFlyerCount() {
    return document.querySelectorAll('.astronaut-flyer').length;
  }

  function canSpawn() {
    return getFlyerCount() < MAX_FLYERS;
  }

  function createAstronaut(opts) {
    const flyer = document.createElement('div');
    flyer.className = 'astronaut-flyer';

    const size = opts.size || rand(60, 110);
    flyer.style.width = size + 'px';
    flyer.style.height = (size * 1.2) + 'px';

    const maxY = Math.max(20, window.innerHeight - size * 1.2 - 20);
    const y = Math.min(maxY, Math.max(10, opts.y != null ? opts.y : rand(0, maxY)));
    flyer.style.top = y + 'px';

    const duration = opts.duration || rand(14, 28);
    flyer.style.animationDuration = duration + 's';

    if (opts.delay) flyer.style.animationDelay = opts.delay + 's';

    const astro = document.createElement('div');
    astro.className = 'astronaut';
    astro.innerHTML = ASTRONAUT_SVG;
    flyer.appendChild(astro);

    document.body.appendChild(flyer);

    flyer.addEventListener('animationend', function () {
      if (flyer.parentNode) flyer.parentNode.removeChild(flyer);
    });
  }

  // ---------- Spawning logic ----------
  function spawnRandom() {
    createAstronaut({});
  }

  function scheduleAmbient() {
    // Stagger initial appearances
    for (let i = 0; i < 3; i++) {
      setTimeout(spawnRandom, i * 1800);
    }
    // Then keep a gentle trickle
    setInterval(() => {
      // Cap concurrent flyers to avoid clutter
      if (canSpawn()) spawnRandom();
    }, 3200);
  }

  // ---------- Click to spawn ----------
  function handleClick(e) {
    // Ignore clicks on the hint (it has pointer-events:none anyway, but safe)
    // Cap concurrent flyers to avoid unbounded DOM growth from rapid clicks
    if (!canSpawn()) return;
    const size = rand(55, 110);
    // Roughly center the astronaut on the click Y (account for flyer height)
    const y = e.clientY - size * 0.6;
    createAstronaut({
      y: y,
      size: size,
      duration: rand(10, 18)
    });
  }

  // ---------- Init ----------
  function init() {
    createStars();
    scheduleAmbient();
    document.addEventListener('click', handleClick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();