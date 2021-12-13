import { FC, memo, useMemo } from 'react';
import * as d3 from 'd3';
import { MotionConfig } from 'framer-motion';

import { Svg } from './Svg';
import { SvgAxis } from './SvgAxis';

export type ReactAxisChartProps = {
  data: number[];
  width: number;
  height: number;
  drawTicksAsGridLines: boolean;
  transitionSeconds: number;
};

export const ReactAxisChart: FC<ReactAxisChartProps> = memo(
  ({ data, width, height, drawTicksAsGridLines, transitionSeconds = 0.25 }) => {
    const margins = { top: 20, bottom: 34, left: 20, right: 20 };
    const chartWidth = width - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;
    const domain = useMemo(() => [d3.min(data) ?? 0, d3.max(data) ?? 0], [data]);
    const scale = d3.scaleLinear(domain, [0, chartWidth]);

    if (!width || !height) {
      return null;
    }

    return (
      <MotionConfig transition={{ duration: transitionSeconds, ease: d3.easeCubicInOut }}>
        <Svg width={width} height={height} className="bg-slate-200 font-sans">
          <SvgAxis
            scale={scale}
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
