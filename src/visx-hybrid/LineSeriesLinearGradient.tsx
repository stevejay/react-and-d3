import { Fragment } from 'react';
import { isNil } from 'lodash-es';

import { coerceNumber } from './coerceNumber';
import { useXYChartContext } from './useXYChartContext';

export interface LineSeriesLinearGradientProps<Datum extends object> {
  /** A unique ID for referencing this gradient. */
  id: string;
  /** The data that are used to calculate the segment boundaries. */
  segmentBoundaryData: readonly Datum[] | null;
  /**
   * The color of each segment. There must be one more segment color than
   * there are segment boundary datums.
   */
  segmentColors: string[];
  dataKeyRef: string;
}

/**
 * Creates a linear gradient definition that will divide a line series by its independent axis
 * into differently coloured segments. There must be n segment boundary datums and
 * n+1 segment colors.
 */
export function LineSeriesLinearGradient<Datum extends object>({
  id,
  segmentBoundaryData,
  segmentColors,
  dataKeyRef
}: LineSeriesLinearGradientProps<Datum>) {
  const { scales, width, dataEntryStore } = useXYChartContext();
  const dataEntry = dataEntryStore.getByDataKey(dataKeyRef);
  return (
    <defs data-testid="linear-gradient-def">
      <linearGradient gradientUnits="userSpaceOnUse" id={id} x1={0} y1={0} x2={width} y2={0}>
        <stop offset={0} style={{ stopColor: segmentColors[0] }} />
        {segmentBoundaryData &&
          segmentBoundaryData.map((datum, index) => {
            if (isNil(datum)) {
              return null;
            }
            const boundaryOffset = Math.min(
              Math.max(
                (coerceNumber(scales.independent(dataEntry.independentAccessor(datum))) ?? 0) / width,
                0
              ),
              1
            );
            return (
              <Fragment key={boundaryOffset}>
                <stop offset={boundaryOffset} style={{ stopColor: segmentColors[index] }} />
                <stop offset={boundaryOffset} style={{ stopColor: segmentColors[index + 1] }} />
              </Fragment>
            );
          })}
      </linearGradient>
    </defs>
  );
}
