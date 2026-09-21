import { useRef, useEffect } from 'react';

export default function CursorGlow() {
  const glowRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    let mx = -100, my = -100;
    let tx = -100, ty = -100;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const animate = () => {
      tx += (mx - tx) * 0.08;
      ty += (my - ty) * 0.08;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${mx - 200}px, ${my - 200}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${tx - 150}px, ${ty - 150}px)`;
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    const raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[400px] h-[400px] pointer-events-none z-[1] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(26,86,219,0.08) 0%, rgba(218,43,54,0.04) 40%, transparent 70%)',
          transition: 'none',
        }}
      />
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-[300px] h-[300px] pointer-events-none z-[1] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(238,196,112,0.06) 0%, transparent 60%)',
          transition: 'none',
        }}
      />
    </>
  );
}
