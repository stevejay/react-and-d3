import { FC, memo, useMemo } from 'react';
import type { AxisScale } from 'd3';
import * as d3 from 'd3';
import { MotionConfig } from 'framer-motion';

import { lastMomentOfThisMonth, startOfThisMonth } from '@/dateUtils';
import { Svg } from '@/Svg';
import { SvgCustomTimeAxis } from '@/SvgCustomTimeAxis';

const margins = { top: 20, bottom: 60, left: 30, right: 30 };

export type ReactCustomTimeAxisChartProps = {
  data: Date[];
  width: number;
  height: number;
  ariaLabelledby: string;
  transitionSeconds?: number;
};

export const ReactCustomTimeAxisChart: FC<ReactCustomTimeAxisChartProps> = memo(
  ({ data, width, height, ariaLabelledby, transitionSeconds = 0.25 }) => {
    const chartWidth = width - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;

    const scale = useMemo<AxisScale<Date>>(() => {
      const now = new Date();
      const minDate = startOfThisMonth(d3.min(data) ?? now);
      const maxDate = lastMomentOfThisMonth(d3.max(data) ?? now);
      return d3.scaleTime([minDate, maxDate], [0, chartWidth]);
    }, [data, chartWidth]);

    if (!width || !height) {
      return null;
    }

    return (
      <MotionConfig transition={{ duration: transitionSeconds, ease: d3.easeCubicInOut }}>
        <Svg
          width={width}
          height={height}
          className="font-sans select-none bg-slate-800"
          aria-labelledby={ariaLabelledby}
        >
          <SvgCustomTimeAxis scale={scale} translateX={margins.left} translateY={margins.top + chartHeight} />
        </Svg>
      </MotionConfig>
    );
  },
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.transitionSeconds === nextProps.transitionSeconds
);
