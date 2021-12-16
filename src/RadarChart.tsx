import { FC, forwardRef, memo } from 'react';
import { useId } from '@uifabric/react-hooks';
// import { SHOT_CATEGORY_COLOR_MAP } from '@clippd/constants/player';
// import { ShotCategory } from '@clippd/graphql/generated/react-apollo';
// import { formatQScore } from '@clippd/utils/formatter';
import * as d3 from 'd3';
import { every, range } from 'lodash-es';

import type { Margins } from './types';

export type CategorySliceProps = {
  /** Whether this slice is the currently selected slice. */
  isSelected: boolean;
  /**
   * The angle of the center of the slice, in degrees, with
   * the first slice position being zero degrees.
   */
  degree: number;
  /** The text to show in the slice. */
  label: string;
  /** The value of the `d` attribute of the slice path. */
  path: string;
  /** The font size in px of the slice label text. */
  sliceLabelFontSizePx: number;
  /**
   * The path ID to use to draw the labels in the lower half
   * of the radar chart
   */
  lowerLabelArcId: string;
  /**
   * The path ID to use to draw the labels in the upper half
   * of the radar chart
   */
  upperLabelArcId: string;
  /** The callback for when a slice is clicked. */
  onClick: () => void;
};

/** Renders a slice of the outer ring of the radar chart. */
export const CategorySlice: FC<CategorySliceProps> = ({
  isSelected,
  degree,
  label,
  path,
  sliceLabelFontSizePx,
  lowerLabelArcId,
  upperLabelArcId,
  onClick
}) => {
  //   const [isHovering, toggleIsHovering] = useSwitch(false);
  return (
    <>
      <path
        className={`slice-arc transition-colors ${isSelected ? 'text-gray-750' : 'text-gray-850'} ${
          /*isHovering ? 'fill-gray-750' : 'fill-current'*/ 'fill-gray-750'
        }`}
        role="presentation"
        aria-hidden
        d={path}
        // onMouseEnter={toggleIsHovering.on}
        // onMouseLeave={toggleIsHovering.off}
        onClick={onClick}
      />
      <text
        className={`slice-label pointer-events-none transition-colors uppercase ${
          isSelected ? 'text-white' : 'text-gray-400'
        } ${/*isHovering ? 'fill-white' : 'fill-current'*/ 'fill-current'}`}
        role="presentation"
        aria-hidden
        dy={degree > 90 && degree < 270 ? '0.75em' : '0em'}
        style={{
          transform: `rotate(${degree}deg)`,
          fontSize: sliceLabelFontSizePx
        }}
      >
        <textPath
          startOffset="50%"
          href={degree > 90 && degree < 270 ? `#${lowerLabelArcId}` : `#${upperLabelArcId}`}
          style={{ textAnchor: 'middle' }}
        >
          {label}
        </textPath>
      </text>
    </>
  );
};

const TOTAL = 'TOTAL';

enum ShotCategory {
  /** Approach */
  App = 'APP',
  /** Around the green */
  Arg = 'ARG',
  /** Putting */
  Putt = 'PUTT',
  /** Off the tee */
  Tee = 'TEE'
}

export type Key = typeof TOTAL | ShotCategory.Tee | ShotCategory.App | ShotCategory.Arg | ShotCategory.Putt;
export type Datum = { key: Key; value: number };
export type Legend = { key: Key; label: string };
export type DatumWithLegend = Legend & Pick<Datum, 'value'> & { degree: number };

const MARGINS: Margins = { left: 1, right: 1, top: 1, bottom: 1 };

export const REALISTIC_DATA: Datum[] = [
  { key: TOTAL, value: 89.34 },
  { key: ShotCategory.Tee, value: 83.56 },
  { key: ShotCategory.App, value: 81.32 },
  { key: ShotCategory.Arg, value: 102.974 },
  { key: ShotCategory.Putt, value: 87.247 }
];

const SHOT_CATEGORY_COLOR_MAP = {
  TOTAL: {
    color: 'text-total',
    border: 'border-total',
    stroke: 'stroke-total',
    fill: 'fill-total'
  },
  [ShotCategory.Tee]: {
    color: 'text-ott',
    border: 'border-ott',
    stroke: 'stroke-ott',
    fill: 'fill-ott'
  },
  [ShotCategory.App]: {
    color: 'text-app',
    border: 'border-app',
    stroke: 'stroke-app',
    fill: 'fill-app'
  },
  [ShotCategory.Arg]: {
    color: 'text-arg',
    border: 'border-arg',
    stroke: 'stroke-arg',
    fill: 'fill-arg'
  },
  [ShotCategory.Putt]: {
    color: 'text-put',
    border: 'border-put',
    stroke: 'stroke-put',
    fill: 'fill-put'
  }
} as const;

/**
 * Creates a domain that extends above and below the data values to
 * the nearest tens value, and extends to at least the range [50, 120].
 * The maximum possible range is [0, 200].
 */
export function getYScaleDomain(data: readonly DatumWithLegend[], isZeroState: boolean): [number, number] {
  if (isZeroState) {
    return [0, 100];
  }
  const min = d3.min(data, (d) => d.value) ?? 0;
  const floorMin = Math.max(Math.floor(min * 0.1) * 10, 0);
  const max = d3.max(data, (d) => d.value) ?? 0;
  const ceilMax = Math.min(Math.ceil(max * 0.1) * 10, 200);
  const domainMin = Math.min(floorMin, 50);
  const domainMax = Math.max(ceilMax, 120);
  return [domainMin, domainMax];
}

/**
 * Creates a list of tick values for the range [domain[0], domain[1]],
 * in increments of 10.
 */
function getYScaleTicks(domain: number[]): number[] {
  return range(domain[0], domain[1] + 1, 10);
}

/**
 * Creates a list of tick values for the y-scale labels.
 * The number of tick values generated depends on the domain range
 * of the y-scale.
 */
export function getYScaleLabelTicks(domain: number[]): number[] {
  const ticks = getYScaleTicks(domain);
  if (ticks.length > 10) {
    return ticks.filter((tick) => tick % 30 === 0 && tick > 0);
  } else {
    return ticks.filter((tick) => tick % 20 === 0 && tick > 0);
  }
}

export type RadarChartProps = {
  label: string;
  selectedKey: DatumWithLegend['key'];
  data: readonly DatumWithLegend[];
  size: 'sm' | 'lg';
  /** Needs to be a stable callback. */
  onSelected: (key: DatumWithLegend['key']) => void;
  /** Needs to be a stable callback. */
  onShowTooltip: (element: Element, datum: DatumWithLegend) => void;
  /** Needs to be a stable callback. */
  onHideTooltip: () => void;
};

export const RadarChart = memo(
  forwardRef<SVGSVGElement, RadarChartProps>(
    ({ label, selectedKey, onSelected, data, size, onShowTooltip, onHideTooltip }, ref) => {
      const id = useId();
      const isSmallChart = size === 'sm';
      const dimension = isSmallChart ? 330 : 420;

      // ----- DATA PREPARATION -----

      const isZeroState = every(data, (d) => d.value === 0);

      const selectedDatum = data.find((d) => d.key === selectedKey);
      if (!selectedDatum) {
        return null;
      }

      // ----- CHART SIZING -----

      const tickFontSizePx = isSmallChart ? 10 : 12;
      const tickRectWidthPx = isSmallChart ? 24 : 28;
      const tickRectHeightPx = tickFontSizePx + 4;
      const tickRectBorderRadiusPx = 2;
      const radiatingPointRadiusPx = 5;
      const radiatingPointStrokeWidthPx = 4;
      const centerRingFontSizePx = isSmallChart ? 38 : 38; // fix
      const centerRingRadiusPx = centerRingFontSizePx + 6;
      const centerRingStrokeWidthPx = 8;
      const activePointRadiusPx = 17;
      const activePointStrokeWidthPx = 2;
      const yAxisMarginTopPx = 12;
      const yAxisMarginBottomPx = yAxisMarginTopPx + centerRingStrokeWidthPx * 0.5;
      const slicePadAngleRadians = 0.0075;
      const sliceHeightPx = isSmallChart ? 24 : 32;
      const sliceLabelFontSizePx = isSmallChart ? 11 : 14;

      const chartAreaRadius =
        (dimension - MARGINS.left - MARGINS.right - sliceHeightPx * 2 - yAxisMarginTopPx * 2) * 0.5;

      // ----- SCALES -----

      // Y-scale is generated from the data values.
      // The range is [innerRadius, outerRadius].

      const y = d3
        .scaleLinear()
        .range([centerRingRadiusPx + yAxisMarginBottomPx, chartAreaRadius])
        .domain(getYScaleDomain(data, isZeroState));

      // X-scale is generated from the categories (keys).
      // The domain is 360 degrees, i.e., 2*Pi radians.

      const x = d3
        .scaleBand()
        .range([0, 2 * Math.PI])
        .domain(data.map((d) => d.key));

      // ----- RADIAL POINTS -----

      const radialPointLookup = new Map(
        data.map((d) => [
          d.key,
          [
            y(d.value) * Math.cos((x(d.key) ?? 0) - Math.PI / 2),
            y(d.value) * Math.sin((x(d.key) ?? 0) - Math.PI / 2)
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

      const sliceArcGenerator = d3
        .arc()
        .innerRadius(chartAreaRadius + yAxisMarginTopPx)
        .outerRadius(chartAreaRadius + yAxisMarginTopPx + sliceHeightPx);

      const slicePieGenerator = d3
        .pie<DatumWithLegend>()
        .sort(null)
        .value(1)
        .padAngle(slicePadAngleRadians)
        // Center the first slice at the top of the chart:
        .startAngle(-Math.PI / data.length);

      // ----- INDICATOR SLICE -----

      const indicatorSliceArc = d3
        .arc()
        .innerRadius(chartAreaRadius + yAxisMarginTopPx - 2)
        .outerRadius(chartAreaRadius + yAxisMarginTopPx)
        .startAngle(-Math.PI / data.length)
        .endAngle(Math.PI / data.length)
        .padAngle(slicePadAngleRadians);

      // ----- RADIAL POLYGON -----

      const radialLineGenerator = d3
        .lineRadial<DatumWithLegend>()
        .angle((d) => x(d.key) ?? 0)
        .radius((d) => y(d.value))
        .curve(d3.curveLinearClosed);

      // ----- ACTIVE POINT INDICATOR -----

      // Determine the bounds of the inner opaque circle of the active point:
      const activePointOuterRadius = activePointRadiusPx - activePointStrokeWidthPx * 0.5;
      const activePointInnerRadius = radiatingPointRadiusPx + radiatingPointStrokeWidthPx * 0.5;

      // Get the active point center coordinates:
      const activePointCoords = radialPointLookup.get(selectedDatum.key);

      // ----- RENDERING -----

      return (
        <svg
          ref={ref}
          className={`select-none flex-shrink-0 ${SHOT_CATEGORY_COLOR_MAP[selectedDatum.key].color}`}
          role="graphics-document group"
          aria-label={label}
          width={dimension}
          height={dimension}
          viewBox={`${-dimension / 2} ${-dimension / 2} ${dimension} ${dimension}`}
        >
          {/* Definitions */}
          <defs role="presentation" aria-hidden>
            <radialGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              r={150}
              cx={radialPointLookup.get(selectedDatum.key)?.[0]}
              cy={radialPointLookup.get(selectedDatum.key)?.[1]}
            >
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
            </radialGradient>
            <path
              id={upperLabelArcId}
              d={`M-${labelArcRadiusPx},0 a${labelArcRadiusPx},${labelArcRadiusPx} 0 0,1 ${
                labelArcRadiusPx * 2
              },0`}
            ></path>
            <path
              id={lowerLabelArcId}
              d={`M${labelArcRadiusPx},0 a${labelArcRadiusPx},${labelArcRadiusPx} 0 0,0 -${
                labelArcRadiusPx * 2
              },0`}
            ></path>
          </defs>

          {/* Category slices */}
          <g>
            {slicePieGenerator(data.slice()).map((d) => (
              <CategorySlice
                key={d.data.key}
                isSelected={d.data.key === selectedKey}
                degree={d.data.degree}
                label={d.data.label}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
                path={sliceArcGenerator(d as any) ?? ''}
                sliceLabelFontSizePx={sliceLabelFontSizePx}
                lowerLabelArcId={lowerLabelArcId}
                upperLabelArcId={upperLabelArcId}
                onClick={() => onSelected(d.data.key)}
              />
            ))}
          </g>

          {/* Indicator slice */}
          <path
            className="pointer-events-none fill-current"
            role="presentation"
            aria-hidden
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
            d={(indicatorSliceArc as any)()}
            style={{ transform: `rotate(${selectedDatum.degree}deg)` }}
          />

          {/* Y-scale circles */}
          <g>
            {getYScaleTicks(y.domain()).map((tick) => (
              <circle
                key={tick}
                className="text-gray-750 stroke-current fill-transparent"
                strokeWidth={1}
                cx={0}
                cy={0}
                role="presentation"
                aria-hidden
                r={y(tick)}
              ></circle>
            ))}
          </g>

          {/* Radial polygon between the data points */}
          <g>
            {!isZeroState && (
              <path
                className="text-gray-300 stroke-current"
                fill={`url(#${gradientId})`}
                strokeWidth={2}
                role="presentation"
                aria-hidden
                d={radialLineGenerator(data) ?? ''}
              />
            )}
          </g>

          {/* Radial lines out from chart center to data points */}
          <g>
            {!isZeroState &&
              data.map((d) => (
                <line
                  key={d.key}
                  className={`${SHOT_CATEGORY_COLOR_MAP[d.key].color} stroke-current`}
                  x1={0}
                  y1={0}
                  role="presentation"
                  aria-hidden
                  x2={radialPointLookup.get(d.key)?.[0] ?? 0}
                  y2={radialPointLookup.get(d.key)?.[1] ?? 0}
                  strokeWidth={d.key === selectedKey ? 5 : 2}
                />
              ))}
          </g>

          {/* Data point circles */}
          <g className="pointer-events-none">
            {!isZeroState &&
              data.map((d) => {
                const legendDatum = data.find((element) => element.key === d.key);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const ariaRoleDescription = legendDatum
                  ? `${legendDatum.label} player quality score of ${d.value}`
                  : '';
                return (
                  <circle
                    key={d.key}
                    className={`${SHOT_CATEGORY_COLOR_MAP[d.key].color} stroke-white fill-current`}
                    r={5}
                    strokeWidth={4}
                    role="graphics-symbol img"
                    cx={radialPointLookup.get(d.key)?.[0] ?? 0}
                    cy={radialPointLookup.get(d.key)?.[1] ?? 0}
                    aria-roledescription={ariaRoleDescription}
                  />
                );
              })}
          </g>

          {/* Centre ring with big number */}
          <g className="pointer-events-none">
            <circle
              className={`${isZeroState ? 'stroke-gray-850' : 'stroke-current'} fill-gray-950`}
              cx={0}
              cy={0}
              role="presentation"
              aria-hidden
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
              {selectedDatum.value}
            </text>
          </g>

          {/* Y-scale labels */}
          <g className="pointer-events-none">
            {getYScaleLabelTicks(y.domain()).map((tick) => (
              <g key={tick}>
                <rect
                  className="text-gray-750 stroke-current fill-gray-950"
                  rx={tickRectBorderRadiusPx}
                  ry={tickRectBorderRadiusPx}
                  strokeWidth={1}
                  role="presentation"
                  aria-hidden
                  width={tickRectWidthPx}
                  height={tickRectHeightPx}
                  x={tickRectWidthPx * -0.5}
                  y={y(tick) - tickRectHeightPx * 0.5}
                />
                <text
                  className="text-white fill-current"
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

          {/* Selected data point highlight */}
          <g
            className="pointer-events-none"
            style={{
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              transform: `translate(${activePointCoords?.[0]}px, ${activePointCoords?.[1]}px)`
            }}
          >
            {!isZeroState && (
              <g>
                <circle
                  className="stroke-current fill-transparent"
                  strokeWidth={activePointStrokeWidthPx}
                  role="presentation"
                  aria-hidden
                  cx={0}
                  cy={0}
                  r={activePointRadiusPx}
                />
                <circle
                  className="stroke-current fill-transparent opacity-75"
                  strokeWidth={activePointOuterRadius - activePointInnerRadius}
                  role="presentation"
                  aria-hidden
                  cx={0}
                  cy={0}
                  r={activePointInnerRadius + (activePointOuterRadius - activePointInnerRadius) * 0.5}
                />
              </g>
            )}
          </g>

          {/* Data point tooltip trigger circles */}
          <g>
            {!isZeroState &&
              data.map((d) => {
                const circleId = `${id}_tooltip_${d.key}`;
                return (
                  <circle
                    key={d.key}
                    id={circleId}
                    className="fill-transparent"
                    role="presentation"
                    aria-hidden
                    cx={radialPointLookup.get(d.key)?.[0] ?? 0}
                    cy={radialPointLookup.get(d.key)?.[1] ?? 0}
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
        </svg>
      );
    }
  ),
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.selectedKey === nextProps.selectedKey &&
    prevProps.size === nextProps.size
);
