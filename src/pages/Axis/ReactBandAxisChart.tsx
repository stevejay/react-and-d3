import { FC, memo, useMemo } from 'react';
import type { AxisScale } from 'd3';
import * as d3 from 'd3';
import { MotionConfig } from 'framer-motion';

import { Svg } from '@/components/Svg';
import { SvgAxis } from '@/components/SvgAxis';
import type { AxisLabelOrientation } from '@/types';

const margins = { top: 20, bottom: 34, left: 30, right: 30 };

export type ReactBandAxisChartProps = {
  data: string[];
  width: number;
  height: number;
  ariaLabelledby: string;
  transitionSeconds?: number;
  labelOrientation: AxisLabelOrientation;
};

export const ReactBandAxisChart: FC<ReactBandAxisChartProps> = memo(
  ({ data, width, height, ariaLabelledby, labelOrientation, transitionSeconds = 0.25 }) => {
    const chartWidth = width - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;

    const scale = useMemo<AxisScale<string>>(() => d3.scaleBand(data, [0, chartWidth]), [data, chartWidth]);

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
