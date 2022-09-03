import type { SpringConfig } from 'react-spring';
import { LinearScaleConfig, UtcScaleConfig } from '@visx/scale';

import { axisTheme } from '@/utils/chartThemes';
// import { lastMomentOfThisMonth, startOfThisMonth } from '@/utils/dateUtils';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

import { SVGCustomTimeAxis } from './SVGCustomTimeAxis';

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

export interface ReactCustomTimeAxisChartProps {
  data: Date[];
  width: number;
  height: number;
  ariaLabelledby: string;
  springConfig: SpringConfig;
}

export function ReactCustomTimeAxisChart({
  data,
  width,
  height,
  ariaLabelledby,
  springConfig
}: ReactCustomTimeAxisChartProps) {
  // const domain = useMemo(() => {
  //   const now = new Date();
  //   const minDate = startOfThisMonth(min(data) ?? now);
  //   const maxDate = lastMomentOfThisMonth(max(data) ?? now);
  //   return [minDate, maxDate];
  // }, [data]);

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
      // margin={{ top: 20, bottom: 70, left: 20, right: 20 }}
    >
      <SVGBarSeries
        dataKey="data-a"
        data={data}
        independentAccessor={(datum) => datum}
        dependentAccessor={() => 20}
        renderBar={() => null}
      />
      <SVGCustomTimeAxis variable="independent" position="start" outerTickLength="chart" />
    </SVGXYChart>
  );
}
