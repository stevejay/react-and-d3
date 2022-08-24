import { LinearScaleConfig, UtcScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { curveCatmullRom } from 'd3-shape';

import type { TimeValueDatum } from '@/types';
import { darkTheme } from '@/utils/chartThemes';
import { SVGInterpolatedPath } from '@/visx-hybrid/SVGInterpolatedPath';
import { SVGLineSeries } from '@/visx-hybrid/SVGLineSeries';
import { SVGSwipedPath } from '@/visx-hybrid/SVGSwipedPath';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

const independentScaleConfig: UtcScaleConfig<number> = { type: 'utc' } as const;
const dependentScaleConfig: LinearScaleConfig<number> = { type: 'linear' } as const;

const springConfig = { duration: 350, easing: easeCubicInOut };

export interface SparklineProps {
  data: TimeValueDatum<number>[];
  width: number;
  height: number;
  animation: 'swipe' | 'interpolation';
}

export function Sparkline({ data, width, height, animation }: SparklineProps) {
  const PathComponent = animation === 'swipe' ? SVGSwipedPath : SVGInterpolatedPath;
  return (
    <SVGXYChart
      independentScale={independentScaleConfig}
      dependentScale={dependentScaleConfig}
      springConfig={springConfig}
      theme={darkTheme}
      width={width}
      height={height}
      outerMargin={2}
    >
      <SVGLineSeries
        dataKey="data-a"
        data={data}
        independentAccessor={(datum) => datum.date}
        dependentAccessor={(datum) => datum.value}
        renderPath={(props) => <PathComponent {...props} strokeWidth={4} curve={curveCatmullRom} />}
      />
    </SVGXYChart>
  );
}
