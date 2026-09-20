// Original vector emblems for the three takeover characters.
// Swap any emblem for a real <img> by replacing the SVG branch — everything
// else (faction colours, animation, sizing) stays wired to the same props.
export function SpiderEmblem({ color = '#C75C35', accent = '#8A4A28', ink = '#101A30', className = '' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* web threads */}
      <g stroke={ink} strokeOpacity="0.35" strokeWidth="1" fill="none">
        <path d="M60 8 q14 16 12 34 M60 8 q-14 16 -12 34 M60 8 q26 12 36 30 M60 8 q-26 12 -36 30" />
        <path d="M60 112 q14 -16 12 -34 M60 112 q-14 -16 -12 -34 M60 112 q26 -12 36 -30 M60 112 q-26 -12 -36 -30" />
        <path d="M8 60 q16 14 34 12 M8 60 q16 -14 34 -12 M112 60 q-16 -14 -34 -12 M112 60 q-16 14 -34 12" />
      </g>
      {/* legs */}
      <g stroke={ink} strokeWidth="4.5" strokeLinecap="round" fill="none">
        <path d="M52 34 L30 12 L38 6" />
        <path d="M50 40 L20 30 M20 30 L12 34" />
        <path d="M50 46 L14 46 M14 46 L6 50" />
        <path d="M52 52 L18 62 M18 62 L10 70" />
        <path d="M68 34 L90 12 L82 6" />
        <path d="M70 40 L100 30 M100 30 L108 34" />
        <path d="M70 46 L106 46 M106 46 L114 50" />
        <path d="M68 52 L102 62 M102 62 L110 70" />
      </g>
      {/* abdomen + head */}
      <ellipse cx="60" cy="58" rx="20" ry="17" fill={color} stroke={ink} strokeWidth="3" />
      <ellipse cx="60" cy="34" rx="10" ry="9" fill={color} stroke={ink} strokeWidth="3" />
      <path d="M52 30 Q60 24 68 30" stroke={accent} strokeWidth="2.5" fill="none" />
      <path d="M52 66 Q60 72 68 66" stroke={accent} strokeWidth="2.5" fill="none" />
      <path d="M40 58 Q48 54 52 56" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M80 58 Q72 54 68 56" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function ReactorEmblem({ color = '#C75C35', accent = '#C75C35', ink = '#101A30', className = '' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* energy arcs */}
      <g stroke={accent} strokeOpacity="0.5" strokeWidth="1.5" fill="none">
        <circle cx="60" cy="60" r="52" strokeDasharray="3 9" />
        <path d="M4 60 q22 6 26 20 M116 60 q-22 6 -26 20" />
      </g>
      {/* rotating rays */}
      <g className="reactor-spin" style={{ transformOrigin: '60px 60px' }}>
        <g stroke={ink} strokeWidth="3" strokeLinecap="round">
          <path d="M60 14 L60 24" />
          <path d="M60 96 L60 106" />
          <path d="M14 60 L24 60" />
          <path d="M96 60 L106 60" />
          <path d="M27.5 27.5 L34.5 34.5" />
          <path d="M85.5 85.5 L92.5 92.5" />
          <path d="M92.5 27.5 L85.5 34.5" />
          <path d="M34.5 85.5 L27.5 92.5" />
        </g>
      </g>
      {/* arc reactor core */}
      <circle cx="60" cy="60" r="30" fill={ink} stroke={ink} strokeWidth="3" />
      <circle cx="60" cy="60" r="23" fill="none" stroke={color} strokeWidth="3" />
      <circle cx="60" cy="60" r="15" fill={color} stroke={accent} strokeWidth="2.5" />
      <path d="M60 49 L67.2 66 L60 71.5 L52.8 66 Z" fill={ink} stroke={ink} strokeWidth="1.5" />
      <circle cx="60" cy="60" r="5" fill={accent} />
      <path d="M42 60 a18 18 0 0 1 9 -15.6" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M78 60 a18 18 0 0 1 -9 15.6" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldEmblem({ color = '#01338E', accent = '#36405A', ink = '#050B1F', className = '' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* offset back-shield for motion */}
      <path
        d="M60 10 L104 22 V62 C104 86 88 102 60 112 C32 102 16 86 16 62 V22 Z"
        fill={ink}
        stroke={ink}
        strokeWidth="2"
        opacity="0.35"
        transform="translate(-6 -6)"
      />
      {/* shield body */}
      <path
        d="M60 10 L104 22 V62 C104 86 88 102 60 112 C32 102 16 86 16 62 V22 Z"
        fill={color}
        stroke={ink}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* concentric rings */}
      <circle cx="60" cy="55" r="34" fill="none" stroke={ink} strokeWidth="3" />
      <circle cx="60" cy="55" r="26" fill={ink} stroke={ink} strokeWidth="2" />
      {/* five-point star */}
      <path
        d="M60 33 L63.7 43.2 L74.7 43.7 L66.2 50.6 L69 61 L60 54.6 L51 61 L53.8 50.6 L45.3 43.7 L56.3 43.2 Z"
        fill={color}
        stroke={accent}
        strokeWidth="1.5"
      />
      <path d="M60 30 q26 6 34 28" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function FactionEmblem({ id, color, accent, ink, className = '' }) {
  if (id === 'arachnid') return <SpiderEmblem color={color} accent={accent} ink={ink} className={className} />;
  if (id === 'reactor') return <ReactorEmblem color={color} accent={accent} ink={ink} className={className} />;
  return <ShieldEmblem color={color} accent={accent} ink={ink} className={className} />;
}