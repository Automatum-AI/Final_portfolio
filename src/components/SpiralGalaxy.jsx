import React, { useRef, useEffect } from 'react';

// Canvas-based swirling spiral galaxy with animated arms and core glow
const SpiralGalaxy = ({
  starCount = 7000,
  swirlRadius = 320,
  swirlSpeed = 0.005,
  armCount = 5,
  angle = 0,
}) => {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const zoomRef = useRef(1);
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2); // cap to 2 for stability
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0
        ? Math.min(Math.max(scrollY / docHeight, 0), 1)
        : 0;
      zoomRef.current = 1.2 + progress * 2.5;
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    // Precompute star data
    const stars = [];
    const spiralTwist = 5.5;
    for (let i = 0; i < starCount; i++) {
      const branch = i % armCount;
      const branchAngle = (branch * Math.PI * 2) / armCount;
      const t = Math.pow(Math.random(), 1.5);
      const radius = swirlRadius * t;
      const spin = spiralTwist * t;
      const theta = branchAngle + spin;
      const z = (Math.random() - 0.5) * swirlRadius * 0.3 * (1 - t);

      const r = Math.round(255);
      const g = Math.round(190 + 40 * (1 - t));
      const b = Math.round(255 * (1 - t));
      stars.push({
        radius,
        baseAngle: theta,
        angle: 0,
        z,
        spinSpeed: swirlSpeed * (0.4 + Math.random() * 0.4),
        color: `rgba(${r},${g},${b},${0.7 + 0.2 * (1 - t)})`,
        size: 0.8 + 1.5 * (1 - t),
      });
    }

    starsRef.current = stars;

    let lastTime = 0;

    function animate(now) {
      if (now - lastTime < 20) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = now;
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoomRef.current, zoomRef.current);
      ctx.rotate((angle * Math.PI) / 180);

      const cameraZ = swirlRadius * 3;
      const yTilt = 0.42;
      const stars = starsRef.current;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.angle += s.spinSpeed;
        const theta = s.baseAngle + s.angle;
        const x3 = Math.cos(theta) * s.radius;
        const y3 = Math.sin(theta) * s.radius;
        const z3 = s.z;
        const perspective = cameraZ / (cameraZ - z3);
        const x2d = x3 * perspective;
        const y2d = y3 * perspective * yTilt;
        const alpha = Math.max(0, Math.min(1, (perspective - 0.1) * 1.2)) * (1.0 - s.radius / swirlRadius);
        const size = s.size * perspective * 0.45 + 0.15; // was 0.65 + 0.2

        ctx.save();
        ctx.globalAlpha = alpha;
        const baseColor = s.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),/);
        const [r, g, b] = baseColor ? baseColor.slice(1, 4) : ['255', '255', '255'];
        const grd = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size);
        grd.addColorStop(0, `rgba(${r},${g},${b},0.95)`);
        grd.addColorStop(0.25, `rgba(${r},${g},${b},0.6)`);
        grd.addColorStop(0.6, `rgba(${r},${g},${b},0.15)`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();

      const cx = width / 2;
      const cy = height / 2;
      const zoom = zoomRef.current;

      ctx.save();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 48 * zoom);
      grad.addColorStop(0, 'hsla(300, 84%, 63%, 0.95)');
      grad.addColorStop(0.3, 'hsla(285, 90%, 80%, 0.6)');
      grad.addColorStop(0.6, 'hsla(270, 70%, 60%, 0.25)');
      grad.addColorStop(1, 'hsla(260, 40%, 40%, 0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.arc(cx, cy, 48 * zoom, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 12 * zoom, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.shadowColor = 'rgba(180,200,255,0.85)';
      ctx.shadowBlur = 24 * zoom;
      ctx.fill();
      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationRef.current);
    };
  }, [starCount, swirlRadius, swirlSpeed, armCount, angle]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default SpiralGalaxy;
