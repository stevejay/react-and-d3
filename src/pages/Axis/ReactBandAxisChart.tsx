import type { SpringConfig } from 'react-spring';
import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';

import { TickLabelOrientation } from '@/types';
import { axisTheme } from '@/utils/chartThemes';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

const independentScale: BandScaleConfig<number> = {
  type: 'band'
};

const dependentScale: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true,
  zero: true
};

export interface ReactBandAxisChartProps {
  data: string[];
  width: number;
  height: number;
  ariaLabelledby: string;
  springConfig: SpringConfig;
  tickLabelOrientation: TickLabelOrientation;
}

export function ReactBandAxisChart({
  data,
  width,
  height,
  ariaLabelledby,
  springConfig
}: ReactBandAxisChartProps) {
  if (!width || !height) {
    return null;
  }
  return (
    <SVGXYChart
      independentScale={independentScale}
      dependentScale={dependentScale}
      springConfig={springConfig}
      role="graphics-document"
      aria-roledescription="Bar chart"
      aria-labelledby={ariaLabelledby}
      theme={axisTheme}
      width={width}
      height={height}
      margin={{ top: 20, bottom: 34, left: 24, right: 24 }}
    >
      <SVGBarSeries
        dataKey="data-a"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data={data as any}
        independentAccessor={(datum) => datum}
        dependentAccessor={() => 20}
        renderBar={() => null}
      />
      <SVGAxis variable="independent" position="start" outerTickLength="chart" />
    </SVGXYChart>
  );
}
