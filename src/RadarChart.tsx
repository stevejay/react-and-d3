import { FC, forwardRef, memo } from 'react';
import { useId } from '@uifabric/react-hooks';
import * as d3 from 'd3';
import { every, range } from 'lodash-es';

import { Svg } from './Svg';
import type { Margins } from './types';

export type Datum = {
  key: string;
  value: number;
  label: string | ((d: Datum) => string);
};

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
  return (
    <>
      <path
        className={`slice-arc transition-colors ${
          isSelected ? 'text-gray-700' : 'text-gray-800'
        } fill-gray-800`}
        role="presentation"
        aria-hidden
        d={path}
        onClick={onClick}
      />
      <text
        className={`slice-label pointer-events-none transition-colors uppercase ${
          isSelected ? 'text-white' : 'text-gray-400'
        } fill-current`}
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

const margins: Margins = { left: 1, right: 1, top: 1, bottom: 1 };

function getLabel(d: Datum): string {
  return typeof d.label === 'function' ? d.label(d) : d.label;
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
  selectedKey: Datum['key'];
  data: readonly Datum[];
  diameter: number;
  /** Needs to be a stable callback. */
  onSelect: (key: Datum['key']) => void;
  /** Needs to be a stable callback. */
  onShowTooltip: (element: Element, datum: Datum) => void;
  /** Needs to be a stable callback. */
  onHideTooltip: () => void;
};

export const RadarChart = memo(
  forwardRef<SVGSVGElement, RadarChartProps>(
    ({ label, selectedKey, data, diameter, onSelect, onShowTooltip, onHideTooltip }, ref) => {
      const id = useId();

      // ----- DATA PREPARATION -----

      const isZeroState = every(data, (d) => d.value === 0);

      const selectedDatum = data.find((d) => d.key === selectedKey);
      if (!selectedDatum) {
        return null;
      }

      const degreesLookup = new Map(data.map((d, index) => [d.key, (360 / data.length) * index]));

      // ----- CHART SIZING -----

      const tickFontSizePx = /*isSmallChart ? 10 :*/ 12;
      const tickRectWidthPx = /*isSmallChart ? 24 :*/ 28;
      const tickRectHeightPx = tickFontSizePx + 4;
      const tickRectBorderRadiusPx = 2;
      const radiatingPointRadiusPx = 5;
      const radiatingPointStrokeWidthPx = 4;
      const centerRingFontSizePx = /*isSmallChart ? 38 :*/ 38; // fix
      const centerRingRadiusPx = centerRingFontSizePx + 6;
      const centerRingStrokeWidthPx = 8;
      const activePointRadiusPx = 17;
      const activePointStrokeWidthPx = 2;
      const yAxisMarginTopPx = 12;
      const yAxisMarginBottomPx = yAxisMarginTopPx + centerRingStrokeWidthPx * 0.5;
      const slicePadAngleRadians = 0.0075;
      const sliceHeightPx = /*isSmallChart ? 24 :*/ 32;
      const sliceLabelFontSizePx = /*isSmallChart ? 11 :*/ 14;

      const chartAreaRadius =
        (diameter - margins.left - margins.right - sliceHeightPx * 2 - yAxisMarginTopPx * 2) * 0.5;

      // ----- SCALES -----

      // Y-scale is generated from the data values.
      // The range is [innerRadius, outerRadius].

      const y = d3
        .scaleLinear()
        .domain([d3.min(data, (d) => d.value) ?? 0, d3.max(data, (d) => d.value) ?? 0])
        .range([centerRingRadiusPx + yAxisMarginBottomPx, chartAreaRadius]);

      // X-scale is generated from the categories (keys).

      const x = d3
        .scaleBand()
        .range([0, 2 * Math.PI]) // [0 degrees, 360 degrees]
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
        .pie<Datum>()
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
        .lineRadial<Datum>()
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
        <Svg
          ref={ref}
          width={diameter}
          height={diameter}
          role="graphics-document group"
          viewBox={`${-diameter / 2} ${-diameter / 2} ${diameter} ${diameter}`}
          className="select-none text-pink-600"
          aria-label={label}
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
                degree={degreesLookup.get(d.data.key) ?? 0}
                label={getLabel(d.data)}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
                path={sliceArcGenerator(d as any) ?? ''}
                sliceLabelFontSizePx={sliceLabelFontSizePx}
                lowerLabelArcId={lowerLabelArcId}
                upperLabelArcId={upperLabelArcId}
                onClick={() => onSelect(d.data.key)}
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
            style={{ transform: `rotate(${degreesLookup.get(selectedDatum.key) ?? 0}deg)` }}
          />

          {/* Y-scale circles */}
          <g>
            {getYScaleTicks(y.domain()).map((tick) => (
              <circle
                key={tick}
                className="text-gray-700 stroke-current fill-transparent"
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
                className="text-gray-400 stroke-current"
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
                  className="stroke-current"
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

          {/* Centre ring with big number */}
          <g className="pointer-events-none">
            <circle
              className={`${isZeroState ? 'stroke-gray-800' : 'stroke-current'} fill-gray-900`}
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
              {Math.round(selectedDatum.value)}
            </text>
          </g>

          {/* Y-scale labels */}
          <g className="pointer-events-none">
            {getYScaleLabelTicks(y.domain()).map((tick) => (
              <g key={tick}>
                <rect
                  className="text-gray-700 stroke-current fill-gray-900"
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

          {/* Data point circles */}
          <g className="pointer-events-none">
            {!isZeroState &&
              data.map((d) => {
                const legendDatum = data.find((element) => element.key === d.key);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const ariaRoleDescription = legendDatum ? `${getLabel(legendDatum)} value of ${d.value}` : '';
                return (
                  <circle
                    key={d.key}
                    className="stroke-white fill-current"
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
        </Svg>
      );
    }
  ),
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.selectedKey === nextProps.selectedKey &&
    prevProps.diameter === nextProps.diameter
);
