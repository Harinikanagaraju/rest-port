// ── LOADER ──────────────────────────────────
window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 2200);
  });
  
  // ── CUSTOM CURSOR ────────────────────────────
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  
  let mx = 0, my = 0, rx = 0, ry = 0;
  
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });
  
  function animateCursor() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
  
    cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
    cursorRing.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
  
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Remaining normal JS code...
  
  window.switchCat = function(id, el) {
    document.querySelectorAll('.menu-section')
      .forEach(s => s.classList.remove('active'));
  
    document.querySelectorAll('.cat-item')
      .forEach(c => c.classList.remove('active'));
  
    document.getElementById('ms-' + id)?.classList.add('active');
  
    if (el) el.classList.add('active');
  };