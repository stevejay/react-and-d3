import type { AxisDomain, AxisScale } from 'd3';

import type { AxisOrientation } from './types';

/**
 * Returns a function that transforms a domain value into a position in pixels
 * using the given scale object to do so. This is the transform used when the
 * scale is not a band scale.
 */
export function number<Domain extends AxisDomain>(scale: AxisScale<Domain>) {
  return (d: Domain) => +(scale(d) ?? NaN);
}

/**
 * Returns a function that transforms a domain value into a position in pixels
 * using the given scale object to do so. This is the transform used when the
 * scale is a band scale.
 */
export function center<Domain extends AxisDomain>(
  scale: AxisScale<Domain> & { round?: () => boolean },
  offset: number
) {
  offset = Math.max(0, scale.bandwidth ? scale.bandwidth() - offset * 2 : 0) / 2;
  if (scale.round && scale.round()) {
    offset = Math.round(offset);
  }
  return (d: Domain) => +(scale(d) ?? NaN) + offset;
}

/**
 * Get the key value for an AxisDomain object, for use as the key prop on a React element.
 */
export function getAxisDomainAsReactKey(value: AxisDomain): string {
  return value.toString();
}

/**
 * Calculates a path that draws the domain line and the outer ticks for an axis.
 *
 * @param orientation Placement of the axis.
 * @param tickSizeOuter Length of the outer ticks.
 * @param offset Used to ensure crisp edges on low-resolution devices
 * (i.e., ensures line edges are on pixel boundaries).
 * @param range0 Pixel position to start drawing the axis domain line at.
 * Might be a subpixel value.
 * @param range1 Pixel position to finish drawing the axis domain line at.
 * Might be a subpixel value.
 * @param k Direction multiplier
 * @returns A string to set as the `d` attribute value for a `path` element.
 */
export function createAxisDomainPathData(
  orientation: AxisOrientation,
  tickSizeOuter: number,
  offset: number,
  range0: number,
  range1: number,
  k: number
): string {
  return orientation === 'left' || orientation === 'right'
    ? tickSizeOuter
      ? `M${k * tickSizeOuter},${range0}H${offset}V${range1}H${k * tickSizeOuter}`
      : `M${offset},${range0}V${range1}`
    : tickSizeOuter
    ? `M${range0},${k * tickSizeOuter}V${offset}H${range1}V${k * tickSizeOuter}`
    : `M${range0},${offset}H${range1}`;
}

/**
 * Returns the pixel offset for odd-value SVG lines, etc.
 */
export function getDefaultOffset(): number {
  return 0.5;
  //   return typeof window !== 'undefined' && window.devicePixelRatio > 1 ? 0 : 0.5;
}
