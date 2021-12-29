import { FC, memo, useMemo } from 'react';
import * as d3 from 'd3';
import { AxisDomain, AxisScale } from 'd3';
import { MotionConfig } from 'framer-motion';

import { Svg } from '../../Svg';
import { SvgAxis } from '../../SvgAxis';

const margins = { top: 20, bottom: 34, left: 40, right: 40 };

export type ReactBandAxisChartProps = {
  data: string[];
  width: number;
  height: number;
  drawTicksAsGridLines: boolean;
  transitionSeconds: number;
};

export const ReactBandAxisChart: FC<ReactBandAxisChartProps> = memo(
  ({ data, width, height, drawTicksAsGridLines, transitionSeconds = 0.25 }) => {
    const chartWidth = width - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;

    const scale = useMemo(() => d3.scaleBand(data, [0, chartWidth]), [data, chartWidth]);

    if (!width || !height) {
      return null;
    }

    return (
      <MotionConfig
        key={transitionSeconds}
        transition={{ duration: transitionSeconds, ease: d3.easeCubicInOut }}
      >
        <Svg width={width} height={height} className="font-sans select-none bg-slate-800">
          <SvgAxis
            scale={scale as AxisScale<AxisDomain>}
            translateX={margins.left}
            translateY={margins.top + chartHeight}
            orientation="bottom"
            tickSizeInner={drawTicksAsGridLines ? -chartHeight : null}
            tickSizeOuter={-chartHeight}
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
    prevProps.drawTicksAsGridLines === nextProps.drawTicksAsGridLines &&
    prevProps.transitionSeconds === nextProps.transitionSeconds
);
