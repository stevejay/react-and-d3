import type { ScaleBand } from 'd3-scale';

import type { Rect } from '@/types';

/**
 * Returns the default pixel offset for helping ensure crisp lines on non-retina
 * displays.
 */
export function getDefaultRenderingOffset(): number {
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

// Derived from https://stackoverflow.com/a/50846323/604006
export function createScaleBandInverter<DomainT>(scale: ScaleBand<DomainT>) {
  const domain = scale.domain();
  const step = scale.step();
  const paddingOuter = step * scale.paddingOuter();
  const paddingInner = step * scale.paddingInner();
  const bandOrigin = paddingOuter - paddingInner * 0.5;
  return (value: number) => {
    const index = Math.floor((value - bandOrigin) / step);
    return domain[Math.max(0, Math.min(index, domain.length - 1))];
  };
}

export function translateRect(rect: Rect | null, translateX: number, translateY: number): Rect | null {
  return rect
    ? {
        ...rect,
        x: rect.x + translateX,
        y: rect.y + translateY
      }
    : rect;
}

export function rectsAreEqual(a: Rect | null, b: Rect | null) {
  if (a === b) {
    return true;
  } else if (!a || !b) {
    return false;
  }
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

export function createDOMRectFromRect(r: Rect): DOMRect {
  return {
    left: r.x,
    top: r.y,
    right: r.x + r.width,
    bottom: r.y + r.height,
    width: r.width,
    height: r.height
  } as DOMRect;
}
