import { AxisScaleOutput, Orientation, Point } from './types';

/**
 * Calculates a path that draws the domain line and the outer ticks for an axis.
 *
 * @param orientation Placement of the axis.
 * @param tickSizeOuter Length of the outer ticks.
 * @param renderingOffset Used to ensure crisp edges on low-resolution devices
 * (i.e., ensures line edges are on pixel boundaries).
 * @param range Pixel positions to start and finish drawing the axis domain line at.
 * Might be a subpixel value.
 * @param tickSign Direction multiplier
 * @returns A string to set as the `d` attribute value for a `path` element.
 */
// export function createAxisDomainPath(
//   orientation: Orientation,
//   tickSizeOuter: number,
//   renderingOffset: number,
//   range: AxisScaleOutput[],
//   tickSign: number
// ): string {
//   // The pixel position to start drawing the axis domain line at.
//   let range0 = Number(range[0]) + renderingOffset;

//   // The pixel position to finish drawing the axis domain line at.
//   let range1 = Number(range[range.length - 1]) + renderingOffset;

//   return orientation === 'left' || orientation === 'right'
//     ? `M${tickSign * tickSizeOuter},${range0}H${renderingOffset}V${range1}H${tickSign * tickSizeOuter}`
//     : `M${range0},${tickSign * tickSizeOuter}V${renderingOffset}H${range1}V${tickSign * tickSizeOuter}`;
// }

export function createAxisDomainPath(
  orientation: Orientation,
  outerTickLength: number,
  range: AxisScaleOutput[],
  tickSign: number,
  renderingOffset: number = 0
): Point[] {
  // The pixel position to start drawing the axis domain line at.
  let range0 = Number(range[0]) + renderingOffset;

  // The pixel position to finish drawing the axis domain line at.
  let range1 = Number(range[range.length - 1]) + renderingOffset;

  if (orientation === 'left' || orientation === 'right') {
    return [
      { x: tickSign * outerTickLength + renderingOffset, y: range0 },
      { x: renderingOffset, y: range0 },
      { x: renderingOffset, y: range1 },
      { x: tickSign * outerTickLength + renderingOffset, y: range1 }
    ];
  }

  return [
    { x: range0, y: tickSign * outerTickLength + renderingOffset },
    { x: range0, y: renderingOffset },
    { x: range1, y: renderingOffset },
    { x: range1, y: tickSign * outerTickLength + renderingOffset }
  ];
}
