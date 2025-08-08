// Spiral starfield with glowing core and scroll-zoom
export function initSpiral(container, options = {}) {
  const { angle = 0, tilt = 60 } = options;
  // Prepare container
  container.style.position = 'relative';
  container.style.overflow = 'hidden';

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.className = 'spiral-canvas';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width, height, dpr = window.devicePixelRatio || 1;
  let scale = 1;
  let currentAngle = angle * Math.PI / 180;
  let currentTilt = Math.cos(tilt * Math.PI / 180);

  function resize() {
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resize);
  resize();

  function draw() {
    ctx.resetTransform();
    ctx.clearRect(0, 0, width, height);

    // Center & apply rotation and tilt transforms
    ctx.translate(width/2, height/2);
    ctx.rotate(currentAngle);
    ctx.transform(1, 0, 0, currentTilt, 0, 0);
    ctx.scale(scale, scale);

    // Draw glowing core
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
    grad.addColorStop(0, 'rgba(255,200,20,0.9)');
    grad.addColorStop(1, 'rgba(255,200,20,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0,0,60,0,Math.PI*2);
    ctx.fill();

    // Draw spiral stars
    ctx.fillStyle = '#ffffff';
    const total = 400;
    const turns = 4;
    for(let i=0; i< total; i++) {
      const t = (i/total) * turns * 2 * Math.PI;
      const r = 10 + t * 15;
      const x = Math.cos(t) * r;
      const y = Math.sin(t) * r;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  function animate() {
    draw();
    requestAnimationFrame(animate);
  }
  animate();

  // Adjust zoom based on scroll position
  window.addEventListener('scroll', () => {
    const rect = container.getBoundingClientRect();
    const dist = window.innerHeight - rect.top;
    scale = Math.max(0.5, Math.min(1.5, dist / window.innerHeight));
  });

  return {
    setAngle(deg) {
      currentAngle = deg * Math.PI/180;
    },
    setTilt(deg) {
      currentTilt = Math.cos(deg * Math.PI/180);
    }
  };
}
