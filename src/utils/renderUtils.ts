import { Rect } from '@/types';

/**
 * Returns the default pixel offset for helping ensure crisp lines on non-retina
 * displays.
 */
export function getDefaultOffset(): number {
  return typeof window !== 'undefined' && window.devicePixelRatio > 1 ? 0 : 0.5;
}

/**
 * To animate x and y attributes on an element in an SVG using Framer Motion,
 * you need to animate attrX and attrY. Animating x and y instead targets
 * the transform x and y properties.
 */
export function toAnimatableRect(r: Rect | null) {
  return r
    ? {
        attrX: r.x,
        attrY: r.y,
        width: r.width,
        height: r.height
      }
    : null;
}
