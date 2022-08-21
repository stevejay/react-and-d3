import { Fragment } from 'react';

import { isNil } from './isNil';
import { useXYChartContext } from './useXYChartContext';

export interface SVGLinearGradientProps<Datum extends object> {
  /** A unique ID for the gradient. */
  id: string;
  /** The data used to calculate the segment boundaries. */
  segmentBoundaryData: readonly Datum[] | null;
  /**  The color of each segment. There must be one more segment color than there are segment boundary datums. */
  segmentColors: string[];
  dataKeyRef: string;
}

/**
 * Creates a linear gradient definition that will divide a line series by its independent axis
 * into differently coloured segments. There must be n segment boundary datums and
 * n+1 segment colors.
 */
export function SVGLinearGradient<Datum extends object>({
  id,
  segmentBoundaryData,
  segmentColors,
  dataKeyRef
}: SVGLinearGradientProps<Datum>) {
  const { scales, width, dataEntryStore } = useXYChartContext();
  const dataEntry = dataEntryStore.getByDataKey(dataKeyRef);
  const independentCenterAccessor = dataEntry.getIndependentCenterAccessor(scales);
  return (
    <defs data-testid="linear-gradient-def">
      <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={width} y2={0}>
        <stop offset={0} style={{ stopColor: segmentColors[0] }} />
        {segmentBoundaryData &&
          segmentBoundaryData.map((datum, index) => {
            if (isNil(datum)) {
              return null;
            }
            const rangeValue = independentCenterAccessor(datum) ?? 0;
            const offset = Math.min(Math.max(rangeValue / width, 0), 1);
            return (
              <Fragment key={offset}>
                <stop offset={offset} style={{ stopColor: segmentColors[index] }} />
                <stop offset={offset} style={{ stopColor: segmentColors[index + 1] }} />
              </Fragment>
            );
          })}
      </linearGradient>
    </defs>
  );
}
