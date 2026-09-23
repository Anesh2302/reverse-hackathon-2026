import { useState } from 'react';

// Graceful art loader: renders nothing if the file hasn't been generated yet,
// so gradient fallbacks underneath always show. No layout shift, lazy by default.
export default function ArtImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  eager = false,
  opacity = 1,
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  if (!src || failed) return null;
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      onLoad={() => setLoaded(true)}
      className={`${className} ${imgClassName}`}
      style={{
        opacity: loaded ? opacity : 0,
        transition: 'opacity 0.8s ease',
      }}
    />
  );
}
