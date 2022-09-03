import type { SpringConfig } from 'react-spring';
import { LinearScaleConfig, UtcScaleConfig } from '@visx/scale';

import { TickLabelOrientation } from '@/types';
import { axisTheme } from '@/utils/chartThemes';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

import { yearMonthMultiFormat } from './formatters';

const independentScale: UtcScaleConfig<Date> = {
  type: 'utc',
  nice: true,
  round: true
};

const dependentScale: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true,
  zero: true
};

export interface ReactTimeAxisChartProps {
  data: Date[];
  width: number;
  height: number;
  ariaLabelledby: string;
  springConfig: SpringConfig;
  tickLabelOrientation: TickLabelOrientation;
}

export function ReactTimeAxisChart({
  data,
  width,
  height,
  ariaLabelledby,
  springConfig
}: ReactTimeAxisChartProps) {
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
        data={data}
        independentAccessor={(datum) => datum}
        dependentAccessor={() => 20}
        renderBar={() => null}
      />
      <SVGAxis
        variable="independent"
        position="start"
        outerTickLength="chart"
        tickFormat={yearMonthMultiFormat}
      />
    </SVGXYChart>
  );
}
