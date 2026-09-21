import { useEffect, useRef } from 'react';

export default function Stars() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, raf;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.2,
      baseAlpha: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.008 + 0.003,
      offset: Math.random() * Math.PI * 2,
      color: ['#FFFFFF', '#EEC470', '#8CA7CC'][Math.floor(Math.random() * 3)],
    }));

    const shootingStars = [];
    let lastShoot = 0;
    let nextShoot = 5000 + Math.random() * 5000;

    function spawn() {
      shootingStars.push({
        x: Math.random() * w * 0.7,
        y: Math.random() * h * 0.3,
        vx: 5 + Math.random() * 3,
        vy: 2 + Math.random() * 2,
        len: 80 + Math.random() * 60,
        life: 1,
        decay: 0.015,
      });
    }

    function draw(time) {
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const alpha = s.baseAlpha + Math.sin(time * s.speed + s.offset) * 0.25;
        ctx.globalAlpha = Math.max(0.1, alpha);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (time - lastShoot > nextShoot) {
        spawn();
        lastShoot = time;
        nextShoot = 4000 + Math.random() * 6000;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;
        if (s.life <= 0) { shootingStars.splice(i, 1); continue; }

        const tx = s.x - s.vx * 4;
        const ty = s.y - s.vy * 4;
        const g = ctx.createLinearGradient(tx, ty, s.x, s.y);
        g.addColorStop(0, 'transparent');
        g.addColorStop(1, '#EEC470');
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.globalAlpha = s.life;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, opacity: 0.9 }} />;
}
