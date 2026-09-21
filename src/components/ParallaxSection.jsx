import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function useParallax(offset = 50) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.6, 1, 1, 0.6]);
  return { ref, y, opacity };
}

export default function ParallaxSection({ children, offset = 40, className = '', speed = 'normal' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const offsets = {
    slow: [offset * 0.5, -offset * 0.5],
    normal: [offset, -offset],
    fast: [offset * 1.5, -offset * 1.5],
  };

  const [startY, endY] = offsets[speed] || offsets.normal;
  const y = useTransform(scrollYProgress, [0, 1], [startY, endY]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.7, 1, 1, 0.7]);
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.98, 1, 1, 0.98]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, scale }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
