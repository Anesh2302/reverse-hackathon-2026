import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function CapShield({ size = 280, spin = false, glow = true, interactive = true, className = '' }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    if (!interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -20, y: x * 20 });
  };

  const onLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        rotate: spin ? 360 : 0,
      }}
      transition={
        spin
          ? { rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, default: { type: 'spring', stiffness: 200, damping: 20 } }
          : { type: 'spring', stiffness: 200, damping: 20 }
      }
      style={{ perspective: 600, transformStyle: 'preserve-3d' }}
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      {/* Glow backdrop */}
      {glow && (
        <>
          <div
            className="absolute rounded-full blur-3xl opacity-40"
            style={{
              width: size * 1.8,
              height: size * 1.8,
              background: 'radial-gradient(circle, rgba(26,86,219,0.5) 0%, rgba(218,43,54,0.25) 40%, transparent 70%)',
            }}
          />
          {/* Pulse rings */}
          <div
            className="absolute rounded-full border border-[#1A56DB]/20 pulse-ring"
            style={{ width: size * 1.3, height: size * 1.3 }}
          />
          <div
            className="absolute rounded-full border border-[#DA2B36]/15 pulse-ring"
            style={{ width: size * 1.5, height: size * 1.5, animationDelay: '0.5s' }}
          />
        </>
      )}

      <svg
        viewBox="0 0 300 300"
        width={size}
        height={size}
        className="relative z-10"
        style={{
          filter: glow ? 'drop-shadow(0 0 25px rgba(26,86,219,0.5)) drop-shadow(0 0 50px rgba(218,43,54,0.25)) drop-shadow(0 4px 20px rgba(0,0,0,0.4))' : 'none',
        }}
      >
        <defs>
          <linearGradient id="shieldRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DA2B36" />
            <stop offset="100%" stopColor="#B01F28" />
          </linearGradient>
          <linearGradient id="shieldBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A56DB" />
            <stop offset="100%" stopColor="#0E2448" />
          </linearGradient>
          <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EEC470" />
            <stop offset="100%" stopColor="#C9981E" />
          </linearGradient>
          <linearGradient id="shieldWhite" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DFECF4" />
            <stop offset="100%" stopColor="#ADC5DE" />
          </linearGradient>
          <radialGradient id="shieldShine" cx="35%" cy="35%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <radialGradient id="innerGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(26,86,219,0.3)" />
            <stop offset="100%" stopColor="rgba(26,86,219,0)" />
          </radialGradient>
        </defs>

        {/* Outer ring - Red */}
        <circle cx="150" cy="150" r="148" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle cx="150" cy="150" r="145" fill="url(#shieldRed)" />

        {/* Gold ring */}
        <circle cx="150" cy="150" r="125" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <circle cx="150" cy="150" r="122" fill="url(#shieldGold)" />

        {/* Inner ring - Red */}
        <circle cx="150" cy="150" r="105" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <circle cx="150" cy="150" r="102" fill="url(#shieldRed)" />

        {/* White ring */}
        <circle cx="150" cy="150" r="85" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <circle cx="150" cy="150" r="82" fill="url(#shieldWhite)" />

        {/* Blue center */}
        <circle cx="150" cy="150" r="65" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <circle cx="150" cy="150" r="62" fill="url(#shieldBlue)" />
        <circle cx="150" cy="150" r="62" fill="url(#innerGlow)" />

        {/* Star */}
        <polygon
          points="150,92 165,132 205,132 172,155 183,195 150,172 117,195 128,155 95,132 135,132"
          fill="#DFECF4"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.5"
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))' }}
        />

        {/* Shine overlay */}
        <circle cx="150" cy="150" r="145" fill="url(#shieldShine)" />

        {/* Edge highlight */}
        <circle cx="150" cy="150" r="145" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      </svg>
    </motion.div>
  );
}
