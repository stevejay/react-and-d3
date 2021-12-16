import { FC, memo, useMemo } from 'react';
import * as d3 from 'd3';
import { AxisDomain, AxisScale } from 'd3';
import { MotionConfig } from 'framer-motion';

import { Svg } from './Svg';
import { SvgAxis } from './SvgAxis';

const margins = { top: 20, bottom: 34, left: 40, right: 40 };

export type ReactTimeAxisChartProps = {
  data: Date[];
  width: number;
  height: number;
  drawTicksAsGridLines: boolean;
  transitionSeconds: number;
};

export const ReactTimeAxisChart: FC<ReactTimeAxisChartProps> = memo(
  ({ data, width, height, drawTicksAsGridLines, transitionSeconds = 0.25 }) => {
    const chartWidth = width - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;

    const scale = useMemo(
      () => d3.scaleTime<AxisDomain, number>([d3.min(data) ?? 0, d3.max(data) ?? 0], [0, chartWidth]).nice(),
      [data, chartWidth]
    );

    if (!width || !height) {
      return null;
    }

    return (
      <MotionConfig
        key={transitionSeconds}
        transition={{ duration: transitionSeconds, ease: d3.easeCubicInOut }}
      >
        <Svg width={width} height={height} className="bg-slate-200 font-sans select-none">
          <SvgAxis
            scale={scale as AxisScale<AxisDomain>}
            translateX={margins.left}
            translateY={margins.top + chartHeight}
            orientation="bottom"
            tickSizeInner={drawTicksAsGridLines ? -chartHeight : null}
            tickSizeOuter={-chartHeight}
          />
        </Svg>
      </MotionConfig>
    );
  },
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.drawTicksAsGridLines === nextProps.drawTicksAsGridLines &&
    prevProps.transitionSeconds === nextProps.transitionSeconds
);
