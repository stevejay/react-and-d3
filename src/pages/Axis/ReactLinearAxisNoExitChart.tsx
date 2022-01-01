import { FC, memo, useMemo } from 'react';
import type { AxisScale } from 'd3';
import * as d3 from 'd3';
import { MotionConfig } from 'framer-motion';

import { Svg } from '@/components/Svg';
import { SvgAxisNoExit } from '@/components/SvgAxisNoExit';
import type { AxisLabelOrientation } from '@/types';

const margins = { top: 20, bottom: 34, left: 30, right: 30 };

export type ReactLinearAxisNoExitChartProps = {
  data: number[];
  width: number;
  height: number;
  ariaLabelledby: string;
  transitionSeconds?: number;
  labelOrientation: AxisLabelOrientation;
};

export const ReactLinearAxisNoExitChart: FC<ReactLinearAxisNoExitChartProps> = memo(
  ({ data, width, height, ariaLabelledby, labelOrientation, transitionSeconds = 0.25 }) => {
    const chartWidth = width - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;

    const scale = useMemo<AxisScale<number>>(
      () => d3.scaleLinear([d3.min(data) ?? 0, d3.max(data) ?? 0], [0, chartWidth]).nice(),
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
          <SvgAxisNoExit
            scale={scale}
            translateX={margins.left}
            translateY={margins.top + chartHeight}
            orientation="bottom"
            tickSizeOuter={-chartHeight}
            transitionSeconds={transitionSeconds}
            labelOrientation={labelOrientation}
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
