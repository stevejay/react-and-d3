/**
 * Returns the default pixel offset for helping ensure crisp lines on non-retina
 * displays.
 */
export function getDefaultRenderingOffset(): number {
  return typeof window !== 'undefined' && window.devicePixelRatio > 1 ? 0 : 0.5;
}
