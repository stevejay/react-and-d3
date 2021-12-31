import { FC, memo, useMemo } from 'react';
import type { AxisScale } from 'd3';
import * as d3 from 'd3';
import { MotionConfig } from 'framer-motion';

import { Svg } from '@/Svg';
import { SvgAxis } from '@/SvgAxis';
import type { AxisLabelOrientation } from '@/types';

import { yearMonthMultiFormat } from './formatters';

const margins = { top: 20, bottom: 48, left: 48, right: 32 };

export type ReactTimeAxisChartProps = {
  data: Date[];
  width: number;
  height: number;
  ariaLabelledby: string;
  transitionSeconds?: number;
  labelOrientation: AxisLabelOrientation;
};

export const ReactTimeAxisChart: FC<ReactTimeAxisChartProps> = memo(
  ({ data, width, height, ariaLabelledby, labelOrientation, transitionSeconds = 0.25 }) => {
    const chartWidth = width - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;

    const scale = useMemo<AxisScale<Date>>(
      () => d3.scaleTime([d3.min(data) ?? 0, d3.max(data) ?? 0], [0, chartWidth]).nice(),
      [data, chartWidth]
    );

    if (!width || !height) {
      return null;
    }

    return (
      <MotionConfig transition={{ duration: transitionSeconds, ease: d3.easeCubicInOut }}>
        <Svg
          width={width}
          height={height}
          aria-labelledby={ariaLabelledby}
          className="font-sans select-none bg-slate-800"
        >
          <SvgAxis
            scale={scale}
            translateX={margins.left}
            translateY={margins.top + chartHeight}
            orientation="bottom"
            tickSizeOuter={-chartHeight}
            labelOrientation={labelOrientation}
            tickFormat={yearMonthMultiFormat}
            className="text-[10px]"
          />
        </Svg>
      </MotionConfig>
    );
  },
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.transitionSeconds === nextProps.transitionSeconds &&
    prevProps.labelOrientation === nextProps.labelOrientation
);
