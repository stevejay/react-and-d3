import type { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';

import { InView } from '@/visx-hybrid/InView';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

import { darkTheme } from './darkTheme';

const independentScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.3,
  paddingOuter: 0.2,
  round: true
} as const;

const dependentScale: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true,
  zero: true
} as const;

const springConfig = { duration: 350, easing: easeCubicInOut };

export function EmptyBarChart() {
  return (
    <div className="my-8">
      <div className="relative w-full h-[384px] bg-slate-700">
        <InView>
          <SVGXYChart
            independentScale={independentScale}
            dependentScale={dependentScale}
            springConfig={springConfig}
            role="graphics-document"
            aria-roledescription="Bar chart"
            aria-label="Some Important Results"
            dependentRangePadding={50}
            independentRangePadding={50}
            theme={darkTheme}
          />
        </InView>
      </div>
    </div>
  );
}
