export default function customImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http')) {
    return src;
  }
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
} 