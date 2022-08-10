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
  defaultTickLabelAngle,
  defaultTickLabelPadding,
  defaultTickLength
} from './constants';
import { getDefaultAxisLabelAngle } from './getDefaultAxisLabelAngle';
import { SVGAnimatedGroup } from './SVGAnimatedGroup';
import { SVGAxisLabel } from './SVGAxisLabel';
import { SVGAxisPath } from './SVGAxisPath';
import { SVGAxisTicks } from './SVGAxisTicks';
import { TextProps } from './SVGSimpleText';
import type {
  AxisScale,
  BasicAxisProps,
  LabelAngle,
  LineProps,
  ScaleInput,
  TickFormatter,
  TickLabelAngle
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
  /** Whether the axis domain line should be hidden. Optional. Defaults to `false`. */
  hideAxisPath?: boolean;
  /** Whether the axis ticks should be hidden. (The tick labels will always be shown.) Optional. Defaults to `false`. */
  hideTicks?: boolean;
  /** Props to apply to the <g> element that wraps each tick line and label. */
  tickGroupProps?: Omit<SVGProps<SVGGElement>, 'ref' | 'style'>; // TODO think about removing style.
  /** The angle that the tick label will be rendered at. */
  tickLabelAngle?: TickLabelAngle;
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
  labelAngle?: LabelAngle;
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
    tickLabelAngle = defaultTickLabelAngle,
    labelAngle,
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
    tickValues
  } = props;

  const {
    scales,
    independentRangePadding,
    dependentRangePadding,
    horizontal,
    margin,
    width,
    height,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    theme,
    innerWidth,
    innerHeight,
    renderingOffset
  } = useXYChartContext();

  const scale = variable === 'independent' ? scales.independent : scales.dependent;
  const axisOrientation = calculateAxisOrientation(horizontal, variable, position);

  const top =
    axisOrientation === 'bottom'
      ? (height ?? 0) - (margin?.bottom ?? 0)
      : axisOrientation === 'top'
      ? margin?.top ?? 0
      : 0;

  const left =
    axisOrientation === 'left'
      ? margin?.left ?? 0
      : axisOrientation === 'right'
      ? (width ?? 0) - (margin?.right ?? 0)
      : 0;

  const rangePadding = variable === 'independent' ? independentRangePadding : dependentRangePadding;
  const isVertical = axisOrientation === 'left' || axisOrientation === 'right';
  const rangeFrom = Number(scale.range()[0]) ?? 0;
  const rangeTo = Number(scale.range()[1]) ?? 0;
  const domainRange = isVertical
    ? [rangeFrom + rangePadding, rangeTo - rangePadding]
    : [rangeFrom - rangePadding, rangeTo + rangePadding];
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
          labelProps={labelProps}
          scale={scale}
          rangePadding={rangePadding}
          width={width}
          height={height}
          labelAngle={labelAngle ?? getDefaultAxisLabelAngle(axisOrientation)}
          labelStyles={theme.bigLabels ?? defaultBigLabelsTextStyle}
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
          margin={margin}
          labelStyles={theme.smallLabels}
          tickLabelAngle={tickLabelAngle}
          axisStyles={axisTheme}
        />
        {!hideAxisPath && (
          <SVGAxisPath
            data-testid="axis-domain"
            axisOrientation={axisOrientation}
            renderingOffset={renderingOffset}
            range={domainRange}
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
