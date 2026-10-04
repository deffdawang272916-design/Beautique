import React from 'react';

/**
 * Utility to resolve safe image URLs for static assets and CDN deployments (e.g. Vercel).
 */
export function getSafeImageUrl(src: string): string {
  if (!src) return '/gluta-drip-vitc.png';
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  // Ensure leading slash and normalize legacy + paths
  let clean = src.startsWith('/') ? src : `/${src}`;
  if (clean.includes('Gluta Drip + Vitamin.png') || clean.includes('Gluta%20Drip%20+%20Vitamin.png')) {
    clean = '/gluta-drip-vitc.png';
  } else if (clean.includes('HIFU + Jawtox.png') || clean.includes('HIFU%20+%20Jawtox.png')) {
    clean = '/hifu-jawtox.png';
  }
  return clean;
}

export function handleImageFallback(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc?: string
) {
  const target = e.currentTarget;
  const currentSrc = target.getAttribute('src') || target.src;

  // Handle machine image format fallbacks (.png <-> .jpg <-> .svg)
  if (currentSrc.includes('/machines/')) {
    const isPng = currentSrc.endsWith('.png');
    const isJpg = currentSrc.endsWith('.jpg') || currentSrc.endsWith('.jpeg');
    const isSvg = currentSrc.endsWith('.svg');

    if (isPng) {
      target.src = currentSrc.replace(/\.png$/, '.jpg');
      return;
    }
    if (isJpg) {
      target.src = currentSrc.replace(/\.(jpg|jpeg)$/, '.png');
      return;
    }
    if (isSvg) {
      target.src = currentSrc.replace(/\.svg$/, '.jpg');
      return;
    }
  }

  // Handle Gluta Drip fallbacks
  if (currentSrc.includes('gluta') || currentSrc.includes('Gluta')) {
    if (!target.src.endsWith('/gluta-drip-vitc.png')) {
      target.src = '/gluta-drip-vitc.png';
      return;
    }
    if (!target.src.endsWith('/gluta-drip.jpg')) {
      target.src = '/gluta-drip.jpg';
      return;
    }
    if (!target.src.endsWith('/gluta-drip-vitamin.png')) {
      target.src = '/gluta-drip-vitamin.png';
      return;
    }
  }

  // Handle HIFU + Jawtox fallbacks
  if (currentSrc.includes('Jawtox') || currentSrc.includes('jawtox')) {
    if (!target.src.endsWith('/hifu-jawtox.png')) {
      target.src = '/hifu-jawtox.png';
      return;
    }
    if (!target.src.endsWith('/hifu-jawtox.jpg')) {
      target.src = '/hifu-jawtox.jpg';
      return;
    }
  }

  if (fallbackSrc && target.src !== fallbackSrc) {
    target.src = fallbackSrc;
    return;
  }

  // Graceful Unsplash aesthetic fallback
  target.src = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80';
}
