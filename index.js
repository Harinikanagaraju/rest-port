// ═══════════════════════════════════════════════════════════
//  TAKE AWAY — Taste of Malaysia
//  index.js  |  Normal JS (no Firebase)
//  Bugs Fixed: Menu height · Cursor null · Parallax clamp
//  Perf Fixed: Menu switch no longer forces synchronous reflow
// ═══════════════════════════════════════════════════════════

// ── LOADER ──────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2200);
});

// ── CUSTOM CURSOR (FIX: null guard added) ────────────────────
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

if (cursor && cursorRing) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  (function animateCursor() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    cursor.style.transform     = `translate(${mx - 6}px, ${my - 6}px)`;
    cursorRing.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll(
    'a, button, .menu-tab, .menu-item, .chef-card, .contact-card, .featured-card'
  ).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width       = '20px';
      cursor.style.height      = '20px';
      cursorRing.style.opacity = '0.9';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width       = '12px';
      cursor.style.height      = '12px';
      cursorRing.style.opacity = '0.5';
    });
  });
}

// ── NAVBAR SCROLL (passive listener) ────────────────────────
window.addEventListener('scroll', () => {
  const nb  = document.getElementById('navbar');
  const btt = document.getElementById('backToTop');
  if (nb)  nb.classList.toggle('scrolled', window.scrollY > 60);
  if (btt) btt.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// ── SCROLL REVEAL ────────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .reveal-scale'
);
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ── HERO ENGINE ──────────────────────────────────────────────
(function () {
  const DURATION = 6000;
  document.documentElement.style.setProperty('--slide-duration', (DURATION / 1000) + 's');

  const hero         = document.getElementById('hero');
  const slides       = document.querySelectorAll('.hero-slide');
  const cuisines     = document.querySelectorAll('.cuisine');
  const dishImgMask  = document.getElementById('dishImgMask');
  const dishName     = document.getElementById('dishName');
  const slideCurrent = document.getElementById('slideCurrent');
  const countFill    = document.getElementById('countFill');
  const slideWipe    = document.getElementById('slideWipe');
  const cursorGlow   = document.getElementById('cursorGlow');
  const heroContent  = document.getElementById('heroContent');
  const dishShowcase = document.getElementById('dishShowcase');
  const slideCounter = document.getElementById('slideCounter');

  let active    = 0;
  let heroTimer = null;

  // Floating sparks
  function makeSparks(n) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const s    = document.createElement('div');
      s.className = 'spark';
      const size  = 2 + Math.random() * 3.5;
      const dur   = 9  + Math.random() * 10;
      s.style.cssText = [
        `width:${size}px`, `height:${size}px`,
        `left:${Math.random() * 100}%`, `bottom:-10px`,
        `animation-duration:${dur}s`,
        `animation-delay:${Math.random() * dur}s`
      ].join(';');
      frag.appendChild(s);
    }
    const sc = document.getElementById('sparkContainer');
    if (sc) sc.appendChild(frag);
  }
  makeSparks(22);

  // FIX: Parallax with clamp — content never goes off-screen
  const CLAMP_X = 12, CLAMP_Y = 8;
  let pmx = 0.5, pmy = 0.5, gx = 0.5, gy = 0.5;

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  if (hero) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      pmx = (e.clientX - r.left) / r.width;
      pmy = (e.clientY - r.top)  / r.height;
      if (cursorGlow) {
        cursorGlow.classList.add('on');
        cursorGlow.style.left = (e.clientX - r.left) + 'px';
        cursorGlow.style.top  = (e.clientY - r.top)  + 'px';
      }
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
      if (cursorGlow) cursorGlow.classList.remove('on');
    });
  }

  // Magnetic buttons
  document.querySelectorAll('.magnet').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / r.width;
      const dy = (e.clientY - r.top  - r.height / 2) / r.height;
      btn.style.transform = `translate(${dx * 14}px, ${dy * 10 - 3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  let isHeroVisible = true;
  if (hero) {
    new IntersectionObserver(e => {
      isHeroVisible = e[0].isIntersecting;
    }).observe(hero);
  }

  function parallaxLoop() {
    if (isHeroVisible) {
      gx += (pmx - gx) * 0.06;
      gy += (pmy - gy) * 0.06;
      const dx = clamp((gx - 0.5) * 18, -CLAMP_X, CLAMP_X);
      const dy = clamp((gy - 0.5) * 14, -CLAMP_Y, CLAMP_Y);
      if (heroContent)  heroContent.style.transform  = `translate(${dx * 0.4}px,  ${dy * 0.4}px)`;
      if (dishShowcase) dishShowcase.style.transform = `translate(${-dx * 0.8}px, ${-dy * 0.8}px)`;
      if (slideCounter) slideCounter.style.transform = `translate(${-dx * 0.8}px, ${-dy * 0.8}px)`;
    }
    requestAnimationFrame(parallaxLoop);
  }
  requestAnimationFrame(parallaxLoop);

  // Slide engine
  function renderProgress() {
    if (!countFill || !cuisines.length) return;
    countFill.style.transition = 'none';
    countFill.style.width      = '0%';
    cuisines[active].classList.remove('active');
    void countFill.offsetWidth;
    cuisines[active].classList.add('active');
    requestAnimationFrame(() => {
      countFill.style.transition = `width ${DURATION / 1000}s linear`;
      countFill.style.width      = '100%';
    });
  }

  function goTo(index, restart = true) {
    slides[active].classList.remove('active');
    if (cuisines.length) cuisines[active].classList.remove('active');

    active      = index;
    const slide = slides[active];

    slides[active].classList.add('active');
    slides[active].style.animation = 'none';
    void slides[active].offsetWidth;
    slides[active].style.animation = '';

    if (slideWipe) {
      slideWipe.classList.remove('run');
      void slideWipe.offsetWidth;
      slideWipe.classList.add('run');
    }

    if (dishImgMask) {
      const oldImg = dishImgMask.querySelector('img');
      const newImg = document.createElement('img');
      newImg.src       = slide.dataset.dishImg;
      newImg.alt       = 'Signature dish';
      newImg.className = 'incoming';
      if (oldImg) oldImg.classList.add('outgoing');
      dishImgMask.appendChild(newImg);
      setTimeout(() => { if (oldImg) oldImg.remove(); }, 750);
    }

    if (dishName) {
      dishName.classList.add('swap');
      setTimeout(() => {
        dishName.innerHTML = slide.dataset.dishName;
        dishName.classList.remove('swap');
      }, 220);
    }

    if (slideCurrent) {
      slideCurrent.classList.add('bump');
      setTimeout(() => slideCurrent.classList.remove('bump'), 400);
      slideCurrent.textContent = String(active + 1).padStart(2, '0');
    }

    renderProgress();

    if (restart) {
      clearInterval(heroTimer);
      heroTimer = setInterval(() => goTo((active + 1) % slides.length), DURATION);
    }
  }

  cuisines.forEach(c => {
    c.addEventListener('click', () => goTo(parseInt(c.dataset.slide, 10)));
  });

  if (slides.length) {
    renderProgress();
    heroTimer = setInterval(() => goTo((active + 1) % slides.length), DURATION);
  }
})();

// ── MENU CATEGORY SWITCH (no forced reflow — smooth click) ───
window.switchCat = function (id, el) {
  document.querySelectorAll('.menu-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.cat-item').forEach(c => c.classList.remove('active'));

  const next = document.getElementById('ms-' + id);
  if (next) next.classList.add('active');
  if (el)   el.classList.add('active');
  // .menu-content height is now handled passively by the
  // ResizeObserver block below — no measuring here, no stutter
};

// ── MENU CONTENT HEIGHT (passive, no forced reflow) ───────────
// Watches whichever .menu-section is currently active and keeps
// .menu-content's min-height matched to it automatically.
(function () {
  const content = document.querySelector('.menu-content');
  if (!content || !window.ResizeObserver) return;

  let currentObserved = null;
  const ro = new ResizeObserver(entries => {
    for (const entry of entries) {
      content.style.minHeight = (entry.contentRect.height + 40) + 'px';
    }
  });

  function watchActive() {
    const active = document.querySelector('.menu-section.active');
    if (active === currentObserved) return;
    if (currentObserved) ro.unobserve(currentObserved);
    if (active) {
      ro.observe(active);
      currentObserved = active;
    }
  }

  // Re-check whenever the active class changes (cheap MutationObserver,
  // no layout thrashing — just watches attribute changes)
  const mo = new MutationObserver(watchActive);
  document.querySelectorAll('.menu-section').forEach(sec => {
    mo.observe(sec, { attributes: true, attributeFilter: ['class'] });
  });

  watchActive(); // initial
})();

// ── SMOOTH NAV + MOBILE CLOSE (Bootstrap API) ────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    const navEl = document.getElementById('navMenu');
    const bsNav = navEl && bootstrap.Collapse.getInstance(navEl);
    if (bsNav) bsNav.hide();
    else if (navEl?.classList.contains('show')) navEl.classList.remove('show');
  });
});

// ── COUNTER ANIMATION ────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.textContent);
    if (isNaN(target)) return;
    const suffix = el.querySelector('span')?.outerHTML ?? '';
    let count    = 0;
    const step   = Math.ceil(target / 50);
    const timer  = setInterval(() => {
      count = Math.min(count + step, target);
      el.innerHTML = count + suffix;
      if (count >= target) clearInterval(timer);
    }, 30);
  });
}
const counterSection = document.querySelector('.stat-box');
if (counterSection) {
  const counterObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      counterObserver.disconnect();
    }
  }, { threshold: 0.5 });
  counterObserver.observe(counterSection);
}