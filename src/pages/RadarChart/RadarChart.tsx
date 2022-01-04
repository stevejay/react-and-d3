import { Fragment, memo, ReactElement } from 'react';
import { useId } from '@uifabric/react-hooks';
import { max, min } from 'd3-array';
import { easeCubicInOut } from 'd3-ease';
import { scaleBand, scaleLinear } from 'd3-scale';
import { arc, curveLinearClosed, lineRadial, pie } from 'd3-shape';
import { m as motion, MotionConfig } from 'framer-motion';
import { every } from 'lodash-es';

import { Svg } from '@/components/Svg';
import type { CategoryValueDatum, DomainValue, Margins } from '@/types';
import { getAxisDomainAsReactKey } from '@/utils/axisUtils';

import { CategorySlice } from './CategorySlice';

const margins: Margins = { left: 1, right: 1, top: 1, bottom: 1 };

export type RadarChartProps<CategoryT extends DomainValue> = {
  title: string;
  categoryLabel: (datum: CategoryValueDatum<CategoryT, number>) => string;
  selectedCategory: CategoryT;
  data: readonly CategoryValueDatum<CategoryT, number>[];
  compact: boolean;
  diameter: number;
  /** Needs to be a stable callback. */
  onSelect: (datum: CategoryValueDatum<CategoryT, number>) => void;
  /** Needs to be a stable callback. */
  onShowTooltip: (element: Element, datum: CategoryValueDatum<CategoryT, number>) => void;
  /** Needs to be a stable callback. */
  onHideTooltip: () => void;
  datumAriaRoleDescription?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  datumAriaLabel?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  datumAriaDescription?: (datum: CategoryValueDatum<CategoryT, number>) => string;
};

const RadarChartImpl = <CategoryT extends DomainValue>({
  title,
  categoryLabel,
  compact,
  selectedCategory,
  data,
  diameter,
  onSelect,
  onShowTooltip,
  onHideTooltip,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumAriaDescription
}: RadarChartProps<CategoryT>): ReactElement | null => {
  const id = useId();

  // ----- DATA PREPARATION -----

  const isZeroState = every(data, (d) => d.value === 0);

  const selectedDatum = data.find((d) => d.category === selectedCategory);
  if (!selectedDatum) {
    return null;
  }

  const degreesLookup = new Map(data.map((d, index) => [d.category, (360 / data.length) * index]));

  // ----- CHART SIZING -----

  const tickFontSizePx = compact ? 10 : 12;
  const tickRectWidthPx = compact ? 24 : 28;
  const tickRectHeightPx = tickFontSizePx + 4;
  const tickRectBorderRadiusPx = 2;
  const centerRingFontSizePx = compact ? 30 : 38;
  const centerRingRadiusPx = centerRingFontSizePx + 6;
  const centerRingStrokeWidthPx = 8;
  const activePointRadiusPx = 13;
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
    .domain(isZeroState ? [0, 150] : [min(data, (d) => d.value) ?? 0, max(data, (d) => d.value) ?? 0])
    .range([centerRingRadiusPx + yAxisMarginBottomPx, chartAreaRadius])
    .nice();

  // X-scale is generated from the categories (keys).

  const x = scaleBand<DomainValue>()
    .range([0, 2 * Math.PI]) // [0 degrees, 360 degrees]
    .domain(data.map((d) => d.category));

  // ----- RADIAL POINTS -----

  const radialPointLookup = new Map(
    data.map((d) => [
      d.category,
      [
        y(d.value) * Math.cos((x(d.category) ?? 0) - Math.PI / 2),
        y(d.value) * Math.sin((x(d.category) ?? 0) - Math.PI / 2)
      ]
    ])
  );

  const gradientId = `${id}_radial_gradient`;

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
    .angle((d) => x(d.category) ?? 0)
    .radius((d) => y(d.value))
    .curve(curveLinearClosed);

  // ----- RENDERING -----

  return (
    <MotionConfig transition={{ duration: 0.3, ease: easeCubicInOut }}>
      <Svg
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
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            r={150}
            cx={radialPointLookup.get(selectedDatum.category)?.[0]}
            cy={radialPointLookup.get(selectedDatum.category)?.[1]}
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
          {slicePieGenerator(data.slice()).map((d) => (
            <CategorySlice
              key={getAxisDomainAsReactKey(d.data.category)}
              isSelected={d.data.category === selectedCategory}
              degree={degreesLookup.get(d.data.category) ?? 0}
              label={categoryLabel(d.data)}
              path={sliceArcGenerator(d as any) ?? ''}
              sliceLabelFontSizePx={sliceLabelFontSizePx}
              lowerLabelArcId={lowerLabelArcId}
              upperLabelArcId={upperLabelArcId}
              onClick={() => onSelect(d.data)}
            />
          ))}
        </g>

        {/* Indicator slice */}
        <path
          className="pointer-events-none fill-current"
          role="presentation"
          d={(indicatorSliceArc as any)()}
          style={{ transform: `rotate(${degreesLookup.get(selectedDatum.category) ?? 0}deg)` }}
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
            <motion.path
              className="stroke-current text-slate-400"
              fill={`url(#${gradientId})`}
              strokeWidth={2}
              role="presentation"
              animate={{
                d: radialLineGenerator(data) ?? '',
                opacity: isZeroState ? 0 : 1
              }}
            />
          }
        </g>

        {/* Radial lines out from chart center to data points */}
        <g>
          {data.map((d) => (
            <motion.line
              key={getAxisDomainAsReactKey(d.category)}
              className="stroke-current"
              x1={0}
              y1={0}
              role="presentation"
              strokeWidth={d.category === selectedCategory ? 5 : 2}
              animate={{
                x2: radialPointLookup.get(d.category)?.[0] ?? 0,
                y2: radialPointLookup.get(d.category)?.[1] ?? 0,
                opacity: isZeroState ? 0 : 1
              }}
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
            className="font-medium text-white"
            role="presentation"
            aria-hidden
            fill="currentColor"
            style={{ fontSize: centerRingFontSizePx }}
          >
            {Math.round(selectedDatum.value)}
          </text>
        </g>

        {/* Data point circles */}
        <g className="pointer-events-none">
          {data.map((d) => (
            <Fragment key={getAxisDomainAsReactKey(d.category)}>
              <motion.circle
                fill="currentColor"
                stroke="none"
                role="presentation"
                r={activePointRadiusPx}
                animate={{
                  cx: radialPointLookup.get(d.category)?.[0] ?? 0,
                  cy: (radialPointLookup.get(d.category)?.[1] ?? 0) + 0.5,
                  opacity: isZeroState || d !== selectedDatum ? 0 : 0.75
                }}
              />
              <motion.circle
                role="graphics-symbol"
                aria-roledescription={datumAriaRoleDescription?.(d)}
                aria-label={datumAriaLabel?.(d)}
                className="fill-current stroke-white"
                r={5}
                strokeWidth={4}
                animate={{
                  cx: radialPointLookup.get(d.category)?.[0] ?? 0,
                  cy: radialPointLookup.get(d.category)?.[1] ?? 0,
                  opacity: isZeroState ? 0 : 1
                }}
              >
                {datumAriaDescription && <desc>{datumAriaDescription(d)}</desc>}
              </motion.circle>
            </Fragment>
          ))}
        </g>

        {/* Data point tooltip trigger circles */}
        <g>
          {!isZeroState &&
            data.map((d) => {
              const circleId = `${id}_tooltip_${d.category}`;
              return (
                <circle
                  key={getAxisDomainAsReactKey(d.category)}
                  id={circleId}
                  className="fill-transparent"
                  role="presentation"
                  cx={radialPointLookup.get(d.category)?.[0] ?? 0}
                  cy={radialPointLookup.get(d.category)?.[1] ?? 0}
                  r={activePointRadiusPx}
                  onMouseEnter={() => {
                    const element = document.getElementById(circleId);
                    element && onShowTooltip(element, d);
                  }}
                  onMouseLeave={onHideTooltip}
                />
              );
            })}
        </g>
      </Svg>
    </MotionConfig>
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
