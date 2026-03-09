/* ===========================
   Animated geometric hero background
   =========================== */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, shapes;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createShapes(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        size: randomBetween(20, 70),
        rotation: randomBetween(0, Math.PI * 2),
        rotSpeed: randomBetween(-0.005, 0.005),
        dx: randomBetween(-0.3, 0.3),
        dy: randomBetween(-0.3, 0.3),
        sides: Math.floor(randomBetween(3, 7)),
        alpha: randomBetween(0.04, 0.12),
        hue: randomBetween(240, 300)
      });
    }
    return arr;
  }

  function drawShape(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rotation);
    ctx.beginPath();
    for (let i = 0; i <= s.sides; i++) {
      const angle = (i / s.sides) * Math.PI * 2;
      const px = Math.cos(angle) * s.size;
      const py = Math.sin(angle) * s.size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = 'hsla(' + s.hue + ', 80%, 65%, ' + s.alpha + ')';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  function update() {
    for (const s of shapes) {
      s.x += s.dx;
      s.y += s.dy;
      s.rotation += s.rotSpeed;

      if (s.x < -s.size) s.x = width + s.size;
      if (s.x > width + s.size) s.x = -s.size;
      if (s.y < -s.size) s.y = height + s.size;
      if (s.y > height + s.size) s.y = -s.size;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const s of shapes) drawShape(s);
    update();
    requestAnimationFrame(draw);
  }

  resize();
  shapes = createShapes(28);
  draw();
  window.addEventListener('resize', function () {
    resize();
    shapes = createShapes(28);
  });
})();

/* ===========================
   Scroll-reveal (IntersectionObserver)
   =========================== */
(function initReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(function (el) { observer.observe(el); });
})();

/* ===========================
   Before / After comparison slider
   =========================== */
(function initBeforeAfter() {
  var container = document.getElementById('ba-container');
  var divider = document.getElementById('ba-divider');
  if (!container || !divider) return;

  var afterLayer = container.querySelector('.ba-after');
  var dragging = false;

  function setPosition(x) {
    var rect = container.getBoundingClientRect();
    var pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    divider.style.left = pct + '%';
    afterLayer.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
  }

  container.addEventListener('mousedown', function (e) {
    e.preventDefault();
    dragging = true;
    setPosition(e.clientX);
  });

  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    setPosition(e.clientX);
  });

  window.addEventListener('mouseup', function () {
    dragging = false;
  });

  container.addEventListener('touchstart', function (e) {
    dragging = true;
    setPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    if (!dragging) return;
    setPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', function () {
    dragging = false;
  });
})();
