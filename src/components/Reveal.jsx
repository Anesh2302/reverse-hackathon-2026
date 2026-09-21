import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const ease = [0.22, 1, 0.36, 1];

const variants = {
  up:    { hidden: { opacity: 0, y: 50, filter: 'blur(4px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' } },
  down:  { hidden: { opacity: 0, y: -50, filter: 'blur(4px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' } },
  left:  { hidden: { opacity: 0, x: -50, filter: 'blur(4px)' }, visible: { opacity: 1, x: 0, filter: 'blur(0px)' } },
  right: { hidden: { opacity: 0, x: 50, filter: 'blur(4px)' }, visible: { opacity: 1, x: 0, filter: 'blur(0px)' } },
  scale: { hidden: { opacity: 0, scale: 0.85, filter: 'blur(4px)' }, visible: { opacity: 1, scale: 1, filter: 'blur(0px)' } },
};

export default function Reveal({ children, delay = 0, direction = 'up', className = '', margin = '-60px' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants[direction]}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
