import { FC, memo, useMemo } from 'react';
import * as d3 from 'd3';
import { MotionConfig } from 'framer-motion';

import { SVGAxis } from './SVGoldAxis';
import { SvgSvg } from './SvgSvg';

type SvgChartProps = {
  data: number[];
  width: number;
  height: number;
  drawTicksAsGridLines: boolean;
  transitionDurationSeconds: number;
};

export const SvgChart: FC<SvgChartProps> = memo(
  ({ data, width, height, drawTicksAsGridLines, transitionDurationSeconds = 0.25 }) => {
    const margins = { top: 20, bottom: 34, left: 20, right: 20 };
    const chartWidth = width - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;
    const domain = useMemo(() => [d3.min(data) ?? 0, d3.max(data) ?? 0], [data]);
    // TODO determine if this is the correct way to handle the d3 scale object.
    const scale = d3.scaleLinear().domain(domain).range([0, chartWidth]);

    return (
      <MotionConfig
        transition={{
          duration: transitionDurationSeconds,
          ease: d3.easeCubicInOut
        }}
      >
        <SvgSvg width={width} height={height} className="bg-slate-200 font-sans">
          <SVGAxis
            scale={scale}
            translateX={margins.left}
            translateY={margins.top + chartHeight}
            orientation="bottom"
            tickSizeInner={drawTicksAsGridLines ? -chartHeight : null}
            tickSizeOuter={-chartHeight}
          />
        </SvgSvg>
      </MotionConfig>
    );
  },
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.drawTicksAsGridLines === nextProps.drawTicksAsGridLines
);
