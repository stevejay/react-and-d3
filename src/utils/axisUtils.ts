import { Key } from 'react';

import { AxisOrientation, AxisScale, DomainValue } from '@/types';

/**
 * Returns a function that transforms a domain value into a position in pixels
 * using the given scale object to do so. This is the transform used when the
 * scale is not a band scale.
 */
export function number<DomainT extends DomainValue>(scale: AxisScale<DomainT>) {
  return (datum: DomainT) => +(scale(datum) ?? NaN);
}

/**
 * Returns a function that transforms a domain value into a position in pixels
 * using the given scale object to do so. This is the transform used when the
 * scale is a band scale.
 */
export function center<DomainT extends DomainValue>(
  scale: AxisScale<DomainT> & { round?: () => boolean },
  renderingOffset: number
) {
  renderingOffset = Math.max(0, scale.bandwidth ? scale.bandwidth() - renderingOffset * 2 : 0) * 0.5;
  if (scale.round?.()) {
    renderingOffset = Math.round(renderingOffset);
  }
  return (datum: DomainT) => +(scale(datum) ?? NaN) + renderingOffset;
}

/**
 * Get the key value for an AxisDomain object, for use as the key prop on a React element.
 */
export function getAxisDomainAsReactKey(value: DomainValue): Key {
  return value.toString();
}

/**
 * Calculates a path that draws the domain line and the outer ticks for an axis.
 *
 * @param orientation Placement of the axis.
 * @param tickSizeOuter Length of the outer ticks.
 * @param renderingOffset Used to ensure crisp edges on low-resolution devices
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
  renderingOffset: number,
  range0: number,
  range1: number,
  k: number
): string {
  return orientation === 'left' || orientation === 'right'
    ? tickSizeOuter
      ? `M${k * tickSizeOuter},${range0}H${renderingOffset}V${range1}H${k * tickSizeOuter}`
      : `M${renderingOffset},${range0}V${range1}`
    : tickSizeOuter
    ? `M${range0},${k * tickSizeOuter}V${renderingOffset}H${range1}V${k * tickSizeOuter}`
    : `M${range0},${renderingOffset}H${range1}`;
}
