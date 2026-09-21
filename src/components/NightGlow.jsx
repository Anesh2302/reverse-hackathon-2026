export default function NightGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute rounded-full" style={{ left: '5%', top: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(26,86,219,0.25) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'float1 25s ease-in-out infinite' }} />
      <div className="absolute rounded-full" style={{ right: '10%', top: '25%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(218,43,54,0.2) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'float2 30s ease-in-out infinite' }} />
      <div className="absolute rounded-full" style={{ left: '40%', top: '50%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(14,36,72,0.3) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'float3 35s ease-in-out infinite' }} />
      <div className="absolute rounded-full" style={{ left: '15%', bottom: '20%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(238,196,112,0.15) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'float1 22s ease-in-out infinite reverse' }} />
      <div className="absolute rounded-full" style={{ right: '5%', bottom: '15%', width: 450, height: 450, background: 'radial-gradient(circle, rgba(26,86,219,0.2) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'float2 28s ease-in-out infinite reverse' }} />
    </div>
  );
}
