import { Fragment, memo, ReactElement, RefObject } from 'react';
import { animated, useSpring, useSprings } from 'react-spring';
import { useId } from '@uifabric/react-hooks';
import { max, min } from 'd3-array';
import { easeCubicInOut } from 'd3-ease';
import { scaleBand, scaleLinear } from 'd3-scale';
import { arc, curveLinearClosed, lineRadial, pie } from 'd3-shape';
import { every } from 'lodash-es';

import { Svg } from '@/components/Svg';
import { CategoryValueDatum, DomainValue, Margin, Rect } from '@/types';
import { getAxisDomainAsReactKey } from '@/utils/axisUtils';

import { CategorySlice } from './CategorySlice';

const margins: Margin = { left: 1, right: 1, top: 1, bottom: 1 };

const springConfig = { duration: 250, easing: easeCubicInOut };

export interface RadarChartProps<CategoryT extends DomainValue> {
  title: string;
  categoryLabel: (datum: CategoryValueDatum<CategoryT, number>) => string;
  selectedCategory: CategoryT;
  data: readonly CategoryValueDatum<CategoryT, number>[];
  compact: boolean;
  diameter: number;
  onSelect: (datum: CategoryValueDatum<CategoryT, number>) => void;
  datumAriaRoleDescription?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  datumAriaLabel?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  datumDescription?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  svgRef: RefObject<SVGSVGElement>;
  onMouseMove: (datum: CategoryValueDatum<CategoryT, number>, rect: Rect) => void;
  onMouseLeave: () => void;
  onClick: (datum: CategoryValueDatum<CategoryT, number>, rect: Rect) => void;
}

const RadarChartImpl = <CategoryT extends DomainValue>({
  title,
  categoryLabel,
  compact,
  selectedCategory,
  data,
  diameter,
  onSelect,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription,
  svgRef,
  onMouseMove,
  onMouseLeave,
  onClick
}: RadarChartProps<CategoryT>): ReactElement | null => {
  const id = useId();

  // ----- DATA PREPARATION -----

  const isZeroState = every(data, (datum) => datum.value === 0);
  const selectedDatum = data.find((datum) => datum.category === selectedCategory);
  const degreesLookup = new Map(data.map((datum, index) => [datum.category, (360 / data.length) * index]));

  // ----- CHART SIZING -----

  const tickFontSizePx = compact ? 10 : 12;
  const tickRectWidthPx = compact ? 24 : 28;
  const tickRectHeightPx = tickFontSizePx + 4;
  const tickRectBorderRadiusPx = 2;
  const centerRingFontSizePx = compact ? 30 : 38;
  const centerRingRadiusPx = centerRingFontSizePx + 6;
  const centerRingStrokeWidthPx = 8;
  const activePointRadiusPx = 13;
  const tooltipPointRadiusPx = activePointRadiusPx + 12;
  const yAxisMarginTopPx = 12;
  const yAxisMarginBottomPx = yAxisMarginTopPx + centerRingStrokeWidthPx * 0.5;
  const slicePadAngleRadians = 0.0075;
  const sliceHeightPx = compact ? 24 : 32;
  const sliceLabelFontSizePx = compact ? 11 : 14;
  const chartAreaRadius =
    (diameter - margins.left - margins.right - sliceHeightPx * 2 - yAxisMarginTopPx * 2) * 0.5;

  // ----- SCALES -----

  // Y-scale is generated from the data values.
  // The range is [innerRadius, outerRadius].

  const y = scaleLinear()
    .domain(
      isZeroState
        ? [0, 150]
        : [min(data, (datum) => datum.value) ?? 0, max(data, (datum) => datum.value) ?? 0]
    )
    .range([centerRingRadiusPx + yAxisMarginBottomPx, chartAreaRadius])
    .nice();

  // X-scale is generated from the categories (keys).

  const x = scaleBand<DomainValue>()
    .range([0, 2 * Math.PI]) // a.k.a. [0 degrees, 360 degrees]
    .domain(data.map((datum) => datum.category));

  // ----- RADIAL POINTS -----

  const radialPointLookup = new Map(
    data.map((datum) => [
      datum.category,
      [
        y(datum.value) * Math.cos((x(datum.category) ?? 0) - Math.PI / 2),
        y(datum.value) * Math.sin((x(datum.category) ?? 0) - Math.PI / 2)
      ]
    ])
  );

  const radialGradientId = `${id}_radial_gradient`;

  // ----- ARC DEFINITIONS FOR THE SLICE LABELS -----

  // Ref: https://www.smashingmagazine.com/2019/03/svg-circle-decomposition-paths/

  const labelArcRadiusPx =
    chartAreaRadius + yAxisMarginTopPx + (sliceHeightPx - sliceLabelFontSizePx) * 0.5 + 1;

  // For labels that appear in the upper half of the chart.
  // This arc is defined so that text drawn along it is rendered right way up.
  const upperLabelArcId = `${id}_upper_label_arc`;
  // For labels that appear in the lower half of the chart.
  // This arc is defined so that text drawn along it is rendered upside down.
  // This is what we want for labels in the lower half of the chart.
  const lowerLabelArcId = `${id}_lower_label_arc`;

  // ----- SLICES -----

  const sliceArcGenerator = arc()
    .innerRadius(chartAreaRadius + yAxisMarginTopPx)
    .outerRadius(chartAreaRadius + yAxisMarginTopPx + sliceHeightPx);

  const slicePieGenerator = pie<CategoryValueDatum<CategoryT, number>>()
    .sort(null)
    .value(1)
    .padAngle(slicePadAngleRadians)
    // Center the first slice at the top of the chart:
    .startAngle(-Math.PI / data.length);

  // ----- INDICATOR SLICE -----

  const indicatorSliceArc = arc()
    .innerRadius(chartAreaRadius + yAxisMarginTopPx - 2)
    .outerRadius(chartAreaRadius + yAxisMarginTopPx)
    .startAngle(-Math.PI / data.length)
    .endAngle(Math.PI / data.length)
    .padAngle(slicePadAngleRadians);

  // ----- RADIAL POLYGON -----

  const radialLineGenerator = lineRadial<CategoryValueDatum<CategoryT, number>>()
    .angle((datum) => x(datum.category) ?? 0)
    .radius((datum) => y(datum.value))
    .curve(curveLinearClosed);

  // ----- ANIMATION -----

  const radialPolygonSpring = useSpring({
    d: radialLineGenerator(data) ?? '',
    opacity: isZeroState ? 0 : 1,
    config: springConfig
  });

  const radialLineSprings = useSprings(
    data.length,
    data.map((datum) => ({
      x2: radialPointLookup.get(datum.category)?.[0] ?? 0,
      y2: radialPointLookup.get(datum.category)?.[1] ?? 0,
      opacity: isZeroState ? 0 : 1,
      config: springConfig
    }))
  );

  const activeDataPointSprings = useSprings(
    data.length,
    data.map((datum) => ({
      cx: radialPointLookup.get(datum.category)?.[0] ?? 0,
      cy: (radialPointLookup.get(datum.category)?.[1] ?? 0) + 0.5,
      opacity: isZeroState || datum !== selectedDatum ? 0 : 0.75,
      config: springConfig
    }))
  );

  const allDataPointSprings = useSprings(
    data.length,
    data.map((datum) => ({
      cx: radialPointLookup.get(datum.category)?.[0] ?? 0,
      cy: (radialPointLookup.get(datum.category)?.[1] ?? 0) + 0.5,
      opacity: isZeroState ? 0 : 1,
      config: springConfig
    }))
  );

  // ----- RENDERING -----

  return (
    <Svg
      ref={svgRef}
      width={diameter}
      height={diameter}
      role="graphics-document"
      aria-roledescription="Radar chart"
      viewBox={`${-diameter / 2} ${-diameter / 2} ${diameter} ${diameter}`}
      className="text-pink-600 select-none"
      aria-label={title}
    >
      {/* Definitions */}
      <defs>
        <radialGradient
          id={radialGradientId}
          gradientUnits="userSpaceOnUse"
          r={150}
          cx={radialPointLookup.get(selectedCategory)?.[0]}
          cy={radialPointLookup.get(selectedCategory)?.[1]}
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
        </radialGradient>
        <path
          role="presentation"
          id={upperLabelArcId}
          d={`M-${labelArcRadiusPx},0 a${labelArcRadiusPx},${labelArcRadiusPx} 0 0,1 ${
            labelArcRadiusPx * 2
          },0`}
        />
        <path
          role="presentation"
          id={lowerLabelArcId}
          d={`M${labelArcRadiusPx},0 a${labelArcRadiusPx},${labelArcRadiusPx} 0 0,0 -${
            labelArcRadiusPx * 2
          },0`}
        />
      </defs>

      {/* Category slices */}
      <g>
        {slicePieGenerator(data.slice()).map((datum) => (
          <CategorySlice
            key={getAxisDomainAsReactKey(datum.data.category)}
            isSelected={datum.data.category === selectedCategory}
            degree={degreesLookup.get(datum.data.category) ?? 0}
            label={categoryLabel(datum.data)}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            path={sliceArcGenerator(datum as any) ?? ''}
            sliceLabelFontSizePx={sliceLabelFontSizePx}
            lowerLabelArcId={lowerLabelArcId}
            upperLabelArcId={upperLabelArcId}
            onClick={() => onSelect(datum.data)}
          />
        ))}
      </g>

      {/* Indicator slice */}
      <path
        className="pointer-events-none fill-current"
        role="presentation"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        d={(indicatorSliceArc as any)()}
        style={{ transform: `rotate(${degreesLookup.get(selectedCategory) ?? 0}deg)` }}
      />

      {/* Y-scale circles */}
      <g>
        {y.ticks(5).map((tick) => (
          <circle
            key={tick}
            className="stroke-current text-slate-700 fill-transparent"
            strokeWidth={1}
            cx={0}
            cy={0}
            role="presentation"
            r={y(tick)}
          ></circle>
        ))}
      </g>

      {/* Y-scale labels */}
      <g className="pointer-events-none">
        {y.ticks(5).map((tick) => (
          <g key={tick}>
            <rect
              className="text-slate-700 fill-slate-900"
              rx={tickRectBorderRadiusPx}
              ry={tickRectBorderRadiusPx}
              stroke="none"
              role="presentation"
              width={tickRectWidthPx}
              height={tickRectHeightPx}
              x={tickRectWidthPx * -0.5}
              y={y(tick) - tickRectHeightPx * 0.5}
            />
            <text
              className="fill-current text-slate-400"
              role="presentation"
              aria-hidden
              x={0}
              y={y(tick)}
              dy="0.35em"
              style={{ textAnchor: 'middle', fontSize: tickFontSizePx }}
            >
              {tick}
            </text>
          </g>
        ))}
      </g>

      {/* Radial polygon between the data points */}
      <g>
        {
          <animated.path
            className="stroke-current text-slate-400"
            fill={`url(#${radialGradientId})`}
            strokeWidth={2}
            role="presentation"
            style={{ opacity: radialPolygonSpring.opacity }}
            d={radialPolygonSpring.d}
          />
        }
      </g>

      {/* Radial lines out from chart center to data points */}
      <g>
        {data.map((datum, index) => (
          <animated.line
            key={getAxisDomainAsReactKey(datum.category)}
            className="stroke-current"
            x1={0}
            y1={0}
            x2={radialLineSprings[index].x2}
            y2={radialLineSprings[index].y2}
            style={{ opacity: radialLineSprings[index].opacity }}
            role="presentation"
            strokeWidth={datum.category === selectedCategory ? 5 : 2}
          />
        ))}
      </g>

      {/* Centre ring with big number */}
      <g className="pointer-events-none">
        <circle
          className={`${
            isZeroState ? 'stroke-slate-800' : 'stroke-current'
          } fill-slate-900 transition-colors`}
          cx={0}
          cy={0}
          role="presentation"
          r={centerRingRadiusPx}
          strokeWidth={centerRingStrokeWidthPx}
        />
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dy="0.35em"
          className="font-semibold text-white"
          role="presentation"
          aria-hidden
          fill="currentColor"
          style={{ fontSize: centerRingFontSizePx }}
        >
          {Math.round(selectedDatum?.value ?? 0)}
        </text>
      </g>

      {/* Data point circles */}
      <g className="pointer-events-none">
        {data.map((datum, index) => (
          <Fragment key={getAxisDomainAsReactKey(datum.category)}>
            <animated.circle
              fill="currentColor"
              stroke="none"
              role="presentation"
              r={activePointRadiusPx}
              cx={activeDataPointSprings[index].cx}
              cy={activeDataPointSprings[index].cy}
              style={{ opacity: activeDataPointSprings[index].opacity }}
            />
            <animated.circle
              role="graphics-symbol"
              aria-roledescription={datumAriaRoleDescription?.(datum)}
              aria-label={datumAriaLabel?.(datum)}
              className="fill-current stroke-white"
              r={5}
              strokeWidth={4}
              cx={allDataPointSprings[index].cx}
              cy={allDataPointSprings[index].cy}
              style={{ opacity: allDataPointSprings[index].opacity }}
            >
              {datumDescription && <desc>{datumDescription(datum)}</desc>}
            </animated.circle>
          </Fragment>
        ))}
      </g>

      {/* Data point tooltip trigger circles */}
      <g>
        {!isZeroState &&
          data.map((datum) => {
            const circleId = `${id}_tooltip_${datum.category}`;
            const cx = radialPointLookup.get(datum.category)?.[0] ?? 0;
            const cy = radialPointLookup.get(datum.category)?.[1] ?? 0;
            const rect: Rect = { x: diameter * 0.5 + cx, y: diameter * 0.5 + cy, width: 0, height: 0 };
            return (
              <circle
                key={getAxisDomainAsReactKey(datum.category)}
                id={circleId}
                className="fill-transparent"
                role="presentation"
                cx={cx}
                cy={cy}
                r={tooltipPointRadiusPx}
                onMouseMove={() => onMouseMove(datum, rect)}
                onMouseLeave={onMouseLeave}
                onClick={(event) => {
                  onClick(datum, rect);
                  // Prevent clicks from being picked up by the document.window
                  // onclick event listener, which closes the tooltip on a click
                  // outside of the chart area.
                  event.stopPropagation();
                }}
              />
            );
          })}
      </g>
    </Svg>
  );
};

export const RadarChart = memo(
  RadarChartImpl,
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.selectedCategory === nextProps.selectedCategory &&
    prevProps.diameter === nextProps.diameter &&
    prevProps.compact === nextProps.compact
) as typeof RadarChartImpl;
