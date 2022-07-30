import type { AxisOrientation, AxisScaleOutput, Point } from './types';

/**
 * Calculates a path that draws the domain line and the outer ticks for an axis.
 */
export function createAxisDomainPath(
  orientation: AxisOrientation,
  outerTickLength: number,
  range: AxisScaleOutput[],
  tickSign: number,
  renderingOffset: number
): Point[] {
  // The pixel position to start drawing the axis domain line at.
  const range0 = Number(range[0]) + renderingOffset;

  // The pixel position to finish drawing the axis domain line at.
  const range1 = Number(range[range.length - 1]) + renderingOffset;

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
