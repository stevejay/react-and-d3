import type { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { format } from 'd3-format';

import type { CategoryValueDatum } from '@/types';
import { darkTheme } from '@/utils/chartThemes';
import { InView } from '@/visx-hybrid/InView';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBar } from '@/visx-hybrid/SVGBar';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGTooltip, TooltipRenderParams } from '@/visx-hybrid/SVGTooltip';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

const independentScaleConfig: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.4,
  paddingOuter: 0.2,
  round: true
} as const;

const dependentScaleConfig: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true,
  zero: true
} as const;

const dependentAxisTickLabelFormatter = format(',.1~f');

function Tooltip({ tooltipData }: TooltipRenderParams<CategoryValueDatum<string, number>>) {
  const datum = tooltipData?.nearestDatum?.datum;
  return datum ? (
    <div className="flex flex-col space-y-1 p-1">{`${datum.category}: ${format('.2f')(datum.value)}`}</div>
  ) : null;
}

export interface HorizontalBarChartProps {
  data: CategoryValueDatum<string, number>[];
}

export function HorizontalBarChart({ data }: HorizontalBarChartProps) {
  return (
    <div className="relative w-full h-[384px]">
      <InView>
        <SVGXYChart
          independentScale={independentScaleConfig}
          dependentScale={dependentScaleConfig}
          theme={darkTheme}
          horizontal
        >
          <SVGBarSeries
            dataKey="data-a"
            data={data}
            independentAccessor={(datum) => datum.category}
            dependentAccessor={(datum) => datum.value}
            renderBar={SVGBar}
          />
          <SVGGrid
            tickCount={5}
            variable="dependent"
            lineProps={({ value }) => ({
              strokeDasharray: value === 0 ? 'none' : undefined,
              className: value === 0 ? 'text-slate-200' : undefined,
              strokeWidth: value === 0 ? 2 : undefined
            })}
          />
          <SVGAxis variable="independent" position="start" label="Independent Axis" tickLength={0} />
          <SVGAxis
            variable="dependent"
            position="start"
            label="Dependent Axis"
            tickCount={5}
            tickFormat={dependentAxisTickLabelFormatter}
          />
          <SVGTooltip<CategoryValueDatum<string, number>>
            snapTooltipToIndependentScale
            showIndependentScaleCrosshair
            renderTooltip={Tooltip}
          />
        </SVGXYChart>
      </InView>
    </div>
  );
}
