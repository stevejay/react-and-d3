import { FC, memo, useMemo } from 'react';
import * as d3 from 'd3';
import { AxisScale } from 'd3';
import { MotionConfig } from 'framer-motion';

import { lastMsOfThisMonth, startOfThisMonth } from './dateUtils';
import { Svg } from './Svg';
import { SvgCustomTimeAxis } from './SvgCustomTimeAxis';

const margins = { top: 20, bottom: 60, left: 40, right: 40 };

export type ReactCustomTimeAxisChartProps = {
  data: Date[];
  width: number;
  height: number;
  transitionSeconds: number;
};

export const ReactCustomTimeAxisChart: FC<ReactCustomTimeAxisChartProps> = memo(
  ({ data, width, height, transitionSeconds = 0.25 }) => {
    const chartWidth = width - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;

    const scale = useMemo(() => {
      const now = new Date();
      const minDate = startOfThisMonth(d3.min(data) ?? now);
      const maxDate = lastMsOfThisMonth(d3.max(data) ?? now);
      return d3.scaleTime<number, number>([minDate, maxDate], [0, chartWidth]);
    }, [data, chartWidth]);

    if (!width || !height) {
      return null;
    }

    return (
      <MotionConfig
        key={transitionSeconds}
        transition={{ duration: transitionSeconds, ease: d3.easeCubicInOut }}
      >
        <Svg width={width} height={height} className="bg-slate-200 font-sans">
          <SvgCustomTimeAxis
            scale={scale as AxisScale<Date>}
            translateX={margins.left}
            translateY={margins.top + chartHeight}
          />
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
