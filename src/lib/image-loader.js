/**
 * Custom image loader for Next.js static exports
 * @param {string} src - The source URL of the image
 * @param {number} width - The width of the image
 * @param {number} quality - The quality of the image
 * @returns {string} - The processed image URL
 */
export default function imageLoader({ src, width, quality }) {
  // If the image is from an external source, return it as is
  if (src.startsWith('http')) {
    return src;
  }

  // For local images, format the path with width and quality
  return `${src}?w=${width}&q=${quality || 75}`;
} 