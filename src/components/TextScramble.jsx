import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default function TextScramble({ text, delay = 0, duration = 1.5, className = '' }) {
  const [display, setDisplay] = useState('');
  const frameRef = useRef(0);

  useEffect(() => {
    const start = performance.now() + delay * 1000;
    let raf;

    const animate = (now) => {
      const elapsed = (now - start) / (duration * 1000);
      if (elapsed < 0) { raf = requestAnimationFrame(animate); return; }

      const progress = Math.min(1, elapsed);
      const revealed = Math.floor(progress * text.length);
      const scrambling = text.length - revealed;

      let result = text.slice(0, revealed);
      for (let i = 0; i < scrambling; i++) {
        result += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setDisplay(result);

      if (progress < 1) raf = requestAnimationFrame(animate);
      else setDisplay(text);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, duration]);

  return <span className={className}>{display}</span>;
}
