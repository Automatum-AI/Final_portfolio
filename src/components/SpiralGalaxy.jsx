import React, { useRef, useEffect, memo } from 'react';
import { scrollProgressRef } from '../scrollControl';

// Canvas-based swirling spiral galaxy with animated arms and core glow
const SpiralGalaxy = ({
  starCount = 9000,
  swirlRadius = 360,
  swirlSpeed = 0.01,
  armCount = 3,
  scrollProgress = 0,
}) => {
  // console.log('SpiralGalaxy: scrollProgress prop', scrollProgress);
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

    // Precompute star data (fully spread, randomize initial angle)
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

      const r = Math.round(255 * (1 - t));
      const g = Math.round(150 + 100 * t);
      const b = Math.round(200 + 50 * t);
      // Instead of angle: 0, randomize initial angle for full spread
      const initialAngle = Math.random() * Math.PI * 2;
      stars.push({
        radius,
        baseAngle: theta,
        angle: initialAngle,
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

      // Zoom is controlled by scroll
      zoomRef.current = 1.0 + (scrollProgress || 0) * 5.0;


      // No spin animation: keep galaxy orientation fixed
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoomRef.current, zoomRef.current);
      // ctx.rotate(0); // No rotation

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
        const size = s.size * perspective * 0.45 + 0.15;

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


      // Reset composite and filter after each use to avoid state leaks
      ctx.globalCompositeOperation = 'source-over';
      ctx.filter = 'none';
      ctx.restore();

      const cx = width / 2;
      const cy = height / 2;
      const zoom = zoomRef.current;

      // --- Add elliptical glowing accretion disk behind central star ---
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(now * 0.00012); // slow subtle rotation
      const diskGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 160 * zoom);
      diskGradient.addColorStop(0, 'rgba(255,220,255,0.06)');
      diskGradient.addColorStop(0.3, 'rgba(200,150,255,0.04)');
      diskGradient.addColorStop(0.9, 'rgba(180,100,240,0.02)');
      diskGradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.ellipse(0, 0, 200 * zoom, 70 * zoom, 0, 0, Math.PI * 2);
      ctx.filter = 'blur(' + (16 * zoom).toFixed(1) + 'px)';
      ctx.fillStyle = diskGradient;
      ctx.fill();
      ctx.filter = 'none';
      ctx.restore();

      // --- Central star glow ---
      ctx.save();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30 * zoom);
      grad.addColorStop(0, 'hsla(300, 84%, 63%, 0.95)');
      grad.addColorStop(0.3, 'hsla(285, 90%, 80%, 0.6)');
      grad.addColorStop(0.6, 'hsla(270, 70%, 60%, 0.25)');
      grad.addColorStop(1, 'hsla(260, 40%, 40%, 0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.arc(cx, cy, 30 * zoom, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      // --- Add elliptical glowing accretion disk behind central star ---
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(now * 0.0001); // subtle slow rotation
      const diskGradient2 = ctx.createRadialGradient(0, 0, 0, 0, 0, 200 * zoom);
      diskGradient2.addColorStop(0, 'rgba(255,220,255,0.07)');
      diskGradient2.addColorStop(0.4, 'rgba(200,160,255,0.05)');
      diskGradient2.addColorStop(0.8, 'rgba(180,100,240,0.025)');
      diskGradient2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.ellipse(0, 0, 250 * zoom, 85 * zoom, 0, 0, Math.PI * 2);
      ctx.filter = `blur(${20 * zoom}px)`;
      ctx.fillStyle = diskGradient2;
      ctx.fill();
      ctx.filter = 'none';
      ctx.restore();


      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [starCount, swirlRadius, swirlSpeed, armCount, scrollProgress]);

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

export default memo(SpiralGalaxy);
