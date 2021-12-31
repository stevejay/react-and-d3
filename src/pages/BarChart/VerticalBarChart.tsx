import { forwardRef, ReactElement, ReactNode, useMemo } from 'react';
import type { AxisDomain, AxisScale } from 'd3';
import * as d3 from 'd3';
import { MotionConfig } from 'framer-motion';
import { identity, isNil } from 'lodash-es';

import { Svg } from '@/Svg';
import { SvgAxis } from '@/SvgAxis';
import { SvgBars } from '@/SvgBars';
import type { Margins } from '@/types';

export type Datum<CategoryT extends AxisDomain> = {
  category: CategoryT;
  value: number;
};

type VerticalBarChartProps<CategoryT extends AxisDomain> = {
  data: Datum<CategoryT>[];
  width: number;
  height: number;
  margins: Margins;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescription?: string;
  ariaDescribedby?: string;
};

function useContinuousDomain<Datum>(
  data: Datum[],
  accessor: (d: Datum) => number = identity,
  options?: { includeZero?: boolean }
): readonly [number, number] {
  const { includeZero } = options ?? {};
  return useMemo(() => {
    let min = d3.min(data, accessor) ?? 0;
    let max = d3.max(data, accessor) ?? 0;
    if (includeZero) {
      if (min > 0) {
        min = 0;
      } else if (max < 0) {
        max = 0;
      }
    }
    return [min, max] as const;
    // Deliberately ignore accessor in useMemo deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, includeZero]);
}

function useOrdinalDomain<Datum, CategoryT extends AxisDomain>(
  data: Datum[],
  accessor: (d: Datum) => CategoryT = identity
): readonly CategoryT[] {
  // Deliberately ignore accessor in useMemo deps.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => data.map(accessor), [data]);
}

// This only supports continuous scales that have two values each in their domain and range.
// All of the args do not need to be stable.
function useLinearScale(
  domain: readonly number[],
  range: readonly number[],
  options?: { nice?: boolean; rangeRound?: boolean; clamp?: boolean; unknown?: number; ticks?: number }
): AxisScale<number> {
  const { nice, rangeRound, clamp, unknown, ticks } = options ?? {};
  return useMemo<AxisScale<number>>(() => {
    const scale = d3.scaleLinear();
    scale.domain(domain);
    scale.range(range);
    nice && scale.nice(); // 'Nice'-ing must happen after setting the domain.
    rangeRound && scale.interpolate(d3.interpolateRound);
    clamp && scale.clamp();
    scale.unknown(unknown);
    scale.ticks(ticks ?? 10);
    return scale;
  }, [domain, range, nice, rangeRound, clamp, unknown, ticks]);
}

function useBandScale<CategoryT extends AxisDomain>(
  domain: readonly CategoryT[],
  range: readonly number[],
  options?: { paddingInner?: number; paddingOuter?: number }
): AxisScale<CategoryT> {
  const { paddingInner, paddingOuter } = options ?? {};
  return useMemo<AxisScale<CategoryT>>(() => {
    const scale = d3.scaleBand<CategoryT>();
    scale.domain(domain);
    scale.range(range);
    !isNil(paddingInner) && scale.paddingInner(paddingInner);
    !isNil(paddingOuter) && scale.paddingOuter(paddingOuter);
    return scale;
  }, [domain, range, paddingInner, paddingOuter]);
}

function useChartArea(
  svgWidth: number,
  svgHeight: number,
  margins: Margins
): {
  width: number;
  height: number;
  translateX: number;
  translateY: number;
  xRange: readonly [number, number];
  yRange: readonly [number, number];
} {
  const width = svgWidth - margins.left - margins.right;
  const height = svgHeight - margins.top - margins.bottom;
  const translateX = margins.left;
  const translateY = margins.top;
  const xRange = useMemo(() => [0, width] as const, [width]);
  const yRange = useMemo(() => [height, 0] as const, [height]);
  return { width, height, translateX, translateY, xRange, yRange };
}

export type SvgChartRootProps = {
  width: number;
  height: number;
  durationSecs?: number;
  className?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescription?: string;
  ariaDescribedby?: string;
  children?: ReactNode;
};

const SvgChartRoot = forwardRef<SVGSVGElement, SvgChartRootProps>(
  (
    {
      width,
      height,
      durationSecs = 0.25,
      className = '',
      ariaLabel,
      ariaLabelledby,
      ariaDescription,
      ariaDescribedby,
      children
    },
    ref
  ) => {
    if (!width || !height) {
      return null;
    }
    return (
      <MotionConfig transition={{ duration: durationSecs, ease: d3.easeCubicInOut }}>
        <Svg
          ref={ref}
          width={width}
          height={height}
          className={className}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-description={ariaDescription}
          aria-describedby={ariaDescribedby}
        >
          {children}
        </Svg>
      </MotionConfig>
    );
  }
);

export function VerticalBarChart<CategoryT extends AxisDomain>({
  data,
  width,
  height,
  margins,
  ariaLabel,
  ariaLabelledby,
  ariaDescription,
  ariaDescribedby
}: VerticalBarChartProps<CategoryT>): ReactElement<any, any> | null {
  const chartArea = useChartArea(width, height, margins);
  const valueDomain = useContinuousDomain(data, (d) => d.value, { includeZero: true });
  const valueScale = useLinearScale(valueDomain, chartArea.yRange, { nice: true, clamp: true });
  const categoryDomain = useOrdinalDomain(data, (d) => d.category);
  const categoryScale = useBandScale(categoryDomain, chartArea.xRange, {
    paddingInner: 0.3,
    paddingOuter: 0.2
  });
  return (
    <SvgChartRoot
      width={width}
      height={height}
      durationSecs={0.5}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      ariaDescription={ariaDescription}
      ariaDescribedby={ariaDescribedby}
      className="font-sans select-none bg-slate-800"
    >
      <SvgAxis
        scale={valueScale}
        translateX={chartArea.translateX}
        translateY={chartArea.translateY}
        orientation="left"
        tickSizeOuter={0}
        tickSizeInner={-chartArea.width}
        tickPadding={10}
        className="text-xs"
        domainClassName="text-transparent"
        tickLineClassName="text-slate-600"
        tickTextClassName="text-slate-200"
      />
      {/* <SvgAxisLabel 
        label="Y Axis Label"
        orientation="left"
        align="end"
      /> */}
      <SvgAxis
        scale={categoryScale}
        translateX={chartArea.translateX}
        translateY={chartArea.translateY + chartArea.height}
        orientation="bottom"
        tickSizeInner={0}
        tickPadding={10}
        className="text-sm"
        domainClassName="text-slate-400"
      />
      <SvgBars
        data={data}
        categoryScale={categoryScale}
        valueScale={valueScale}
        translateX={chartArea.translateX}
        translateY={chartArea.translateY}
        chartWidth={chartArea.width}
        chartHeight={chartArea.height}
        orientation="vertical"
        className="text-slate-600"
      />
    </SvgChartRoot>
  );
}
