import type { SVGProps } from 'react';
import type { SpringConfig } from 'react-spring';

import { calculateAxisMargin } from './calculateAxisMargin';
import { calculateAxisOrientation } from './calculateAxisOrientation';
import { calculateTicksData } from './calculateTicksData';
import {
  defaultBigLabelsTextStyle,
  defaultHideTicks,
  defaultHideZero,
  defaultOuterTickLength,
  defaultSmallLabelsTextStyle,
  defaultTickLabelAngle,
  defaultTickLabelPadding,
  defaultTickLength
} from './constants';
import { getDefaultAxisLabelAngle } from './getDefaultAxisLabelAngle';
import { getDependentRange, getIndependentRange } from './getRange';
import { SVGAnimatedGroup } from './SVGAnimatedGroup';
import { SVGAxisLabel } from './SVGAxisLabel';
import { SVGAxisPath } from './SVGAxisPath';
import { SVGAxisTicks } from './SVGAxisTicks';
import { TextProps } from './SVGSimpleText';
import type {
  AxisScale,
  BasicAxisProps,
  LabelAlignment,
  LineProps,
  ScaleInput,
  TickFormatter,
  TickLabelAlignment
} from './types';
import { useXYChartContext } from './useXYChartContext';

export type SVGAxisProps = BasicAxisProps & {
  // /** Whether the axis is the independent or the dependent axis. */
  // variable: Variable;
  // /** Which side of the chart the axis is rendered on. */
  // position: 'start' | 'end';
  /** Whether the stripes should animate. Optional. Defaults to `true`. */
  animate?: boolean;
  /** A react-spring configuration object for the animation. Optional. This should be a stable object. */
  springConfig?: SpringConfig;
  /** Whether the zero tick should be skipped. Optional. Defaults to `false`. */
  hideZero?: boolean;
  /** Sets the formatter function. Defaults to the scale's default formatter. */
  tickFormat?: TickFormatter<ScaleInput<AxisScale>>;
  /** The approximate number of grid lines. (It is approximate due to the d3 algorithm; specify `tickValues` for precise control.) */
  tickCount?: number;
  /** The ticks values to use for ticks instead of those returned by the scale’s automatic tick generator. */
  tickValues?: ScaleInput<AxisScale>[];
  /** Whether the axis domain line should include any range padding. Optional. Defaults to `true`. */
  includeRangePaddingInAxisPath?: boolean;
  /** Whether the axis domain line should be hidden. Optional. Defaults to `false`. */
  hideAxisPath?: boolean;
  /** Whether the axis ticks should be hidden. (The tick labels will always be shown.) Optional. Defaults to `false`. */
  hideTicks?: boolean;
  /** Props to apply to the <g> element that wraps each tick line and label. */
  tickGroupProps?: Omit<SVGProps<SVGGElement>, 'ref' | 'style'>; // TODO think about removing style.
  /** The angle that the tick label will be rendered at. */
  tickLabelAlignment?: TickLabelAlignment;
  /** Padding between the tick lines and the tick labels. */
  tickLabelPadding?: number;
  /** The props to apply to the tick labels. */
  tickLabelProps?: Partial<TextProps>;
  /** The length of the tick lines. */
  tickLength?: number;
  /** The length of the outer ticks (added at the very start and very end of the axis domain), or 'chart' to set the length of the outer ticks to the length of the inner chart. */
  outerTickLength?: number | 'chart';
  /** Props to be applied to individual tick lines. */
  tickLineProps?: LineProps;
  /** The text for the axis label. */
  label?: string;
  /** Pixel offset of the axis label. This value only applies if the chart is using auto margins. */
  autoMarginLabelPadding?: number;
  /** Props to apply to the axis label. */
  labelProps?: Partial<TextProps>;
  /** The angle that the axis label will be rendered at. */
  labelAlignment?: LabelAlignment;
  /** Props to apply to the axis domain path. */
  axisLineProps?: Omit<SVGProps<SVGPathElement>, 'ref'>;
  /** Props to apply to the <g> element that wraps the axis. */
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref' | 'x' | 'y'>;
};

function SVGAxis(props: SVGAxisProps) {
  const {
    variable,
    position,
    groupProps,
    springConfig: userSpringConfig,
    animate: userAnimate = true,
    tickLabelProps,
    labelProps,
    label,
    tickLabelAlignment = defaultTickLabelAngle,
    labelAlignment,
    axisLineProps = {},
    outerTickLength = defaultOuterTickLength,
    hideAxisPath = false,
    tickLength = defaultTickLength,
    hideTicks = defaultHideTicks,
    tickGroupProps = {},
    tickLineProps = {},
    tickLabelPadding = defaultTickLabelPadding,
    hideZero = defaultHideZero,
    tickFormat,
    tickCount,
    tickValues,
    includeRangePaddingInAxisPath = true
  } = props;

  const {
    scales,
    chartDimensions,
    horizontal,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    theme,
    renderingOffset
  } = useXYChartContext();

  const scale =
    variable === 'independent'
      ? scales.independent
      : scales.getDependentScale(variable === 'alternateDependent');
  const axisOrientation = calculateAxisOrientation(horizontal, variable, position);

  const top =
    axisOrientation === 'bottom'
      ? chartDimensions.chartAreaExcludingRangePadding.y1
      : axisOrientation === 'top'
      ? chartDimensions.chartAreaExcludingRangePadding.y
      : 0;

  const left =
    axisOrientation === 'left'
      ? chartDimensions.chartAreaExcludingRangePadding.x
      : axisOrientation === 'right'
      ? chartDimensions.chartAreaExcludingRangePadding.x1
      : 0;

  const isVertical = axisOrientation === 'left' || axisOrientation === 'right';
  const axisPathRange = (variable === 'independent' ? getIndependentRange : getDependentRange)(
    includeRangePaddingInAxisPath
      ? chartDimensions.chartAreaExcludingRangePadding
      : chartDimensions.chartAreaIncludingRangePadding,
    horizontal
  );
  const ticks = calculateTicksData({ scale, hideZero, tickFormat, tickCount, tickValues });
  const springConfig = userSpringConfig ?? contextSpringConfig;
  const animate = userAnimate && contextAnimate;
  const axisTheme = theme?.axis?.[axisOrientation];

  return (
    <>
      {label && (
        <SVGAxisLabel
          label={label}
          axisOrientation={axisOrientation}
          axisPathRange={axisPathRange}
          labelProps={labelProps}
          chartDimensions={chartDimensions}
          labelAlignment={labelAlignment ?? getDefaultAxisLabelAngle(axisOrientation)}
          labelStyles={
            theme.axis?.[axisOrientation]?.axisLabel ?? theme.bigLabels ?? defaultBigLabelsTextStyle
          }
        />
      )}
      <SVGAnimatedGroup
        data-testid={`axis-${axisOrientation}`}
        x={left}
        y={top}
        springConfig={springConfig}
        animate={animate}
        {...groupProps}
      >
        <SVGAxisTicks
          hideTicks={hideTicks}
          axisOrientation={axisOrientation}
          scale={scale}
          tickLabelProps={tickLabelProps}
          tickGroupProps={tickGroupProps}
          tickLength={tickLength}
          ticks={ticks}
          tickLineProps={tickLineProps}
          renderingOffset={renderingOffset}
          springConfig={springConfig}
          animate={animate}
          tickLabelPadding={tickLabelPadding}
          labelStyles={
            theme.axis?.[axisOrientation]?.tickLabel ?? theme.smallLabels ?? defaultSmallLabelsTextStyle
          }
          tickLabelAlignment={tickLabelAlignment}
          axisStyles={axisTheme}
        />
        {!hideAxisPath && (
          <SVGAxisPath
            data-testid="axis-domain"
            axisOrientation={axisOrientation}
            renderingOffset={renderingOffset}
            range={axisPathRange}
            outerTickLength={
              outerTickLength === 'chart' ? (isVertical ? -innerWidth : -innerHeight) : outerTickLength
            }
            springConfig={springConfig}
            animate={animate}
            pathStyles={axisTheme?.axisPath}
            {...axisLineProps}
          />
        )}
      </SVGAnimatedGroup>
    </>
  );
}

SVGAxis.calculateMargin = calculateAxisMargin;

export { SVGAxis };
