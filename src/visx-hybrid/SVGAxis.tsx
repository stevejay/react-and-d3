import type { SVGProps } from 'react';
import type { SpringConfig } from 'react-spring';

import { calculateAxisOrientation } from './calculateAxisOrientation';
import {
  defaultHideTicks,
  defaultHideZero,
  defaultTickLabelAngle,
  defaultTickLabelPadding,
  defaultTickLength
} from './constants';
import { getDefaultAxisLabelAngle } from './getDefaultAxisLabelAngle';
import { getTicksData } from './getTicksData';
import { SVGAnimatedGroup } from './SVGAnimatedGroup';
import { SVGAxisDomainPath } from './SVGAxisDomainPath';
import { SVGAxisLabel } from './SVGAxisLabel';
import { SVGAxisTicks } from './SVGAxisTicks';
import { TextProps } from './SVGSimpleText';
import type {
  AxisScale,
  LabelAngle,
  LineProps,
  ScaleInput,
  TickFormatter,
  TickLabelAngle,
  VariableType
} from './types';
import { useDataContext } from './useDataContext';

export interface SVGAxisProps {
  springConfig?: SpringConfig;
  animate?: boolean;
  renderingOffset?: number;
  hideZero?: boolean;
  tickFormat?: TickFormatter<ScaleInput<AxisScale>>;
  tickCount?: number;
  tickValues?: ScaleInput<AxisScale>[];
  /**  If true, will hide the axis line. */
  hideAxisLine?: boolean;
  /** If true, will hide the ticks (but not the tick labels). */
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
  /**
   * The length of the outer ticks (added at the very start and very end of the axis domain), or
   * 'domain' to set the length of the outer ticks to the length of the inner chart.
   */
  outerTickLength?: number | 'domain';
  /** Props to be applied to individual tick lines. */
  tickLineProps?: LineProps;
  /** The text for the axis label. */
  label?: string;
  /** Pixel offset of the axis label. */
  autoMarginLabelPadding?: number;
  /** Props to apply to the axis label. */
  labelProps?: Partial<TextProps>;
  /** The angle that the axis label will be rendered at. */
  labelAngle?: LabelAngle;
  /** Props to apply to the axis domain path. */
  domainPathProps?: Omit<SVGProps<SVGPathElement>, 'ref'>;
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref' | 'x' | 'y'>;
  position: 'start' | 'end';
  variableType: VariableType;
}

export function SVGAxis(props: SVGAxisProps) {
  const {
    variableType,
    position,
    groupProps,
    springConfig,
    animate = true,
    tickLabelProps,
    labelProps,
    label,
    tickLabelAngle = defaultTickLabelAngle,
    labelAngle,
    domainPathProps = {},
    outerTickLength = 0,
    hideAxisLine = false,
    tickLength = defaultTickLength,
    hideTicks = defaultHideTicks,
    tickGroupProps = {},
    tickLineProps = {},
    tickLabelPadding = defaultTickLabelPadding,
    renderingOffset = 0,
    hideZero = defaultHideZero,
    tickFormat,
    tickCount,
    tickValues
  } = props;

  const {
    independentScale,
    dependentScale,
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
    innerHeight
  } = useDataContext();

  const scale = variableType === 'independent' ? independentScale : dependentScale;
  const orientation = calculateAxisOrientation(horizontal, variableType, position);

  const top =
    orientation === 'bottom'
      ? (height ?? 0) - (margin?.bottom ?? 0)
      : orientation === 'top'
      ? margin?.top ?? 0
      : 0;

  const left =
    orientation === 'left'
      ? margin?.left ?? 0
      : orientation === 'right'
      ? (width ?? 0) - (margin?.right ?? 0)
      : 0;

  const rangePadding = variableType === 'independent' ? independentRangePadding : dependentRangePadding;
  const isLeft = orientation === 'left';
  const isTop = orientation === 'top';
  const isVertical = orientation === 'left' || orientation === 'right';
  const tickSign = isLeft || isTop ? -1 : 1;
  const rangeFrom = Number(scale.range()[0]) ?? 0;
  const rangeTo = Number(scale.range()[1]) ?? 0;
  const domainRange = isVertical
    ? [rangeFrom + rangePadding, rangeTo - rangePadding]
    : [rangeFrom - rangePadding, rangeTo + rangePadding];
  const ticks = getTicksData(scale, hideZero, tickFormat, tickCount, tickValues);

  return (
    <>
      {label && (
        <SVGAxisLabel
          label={label}
          orientation={orientation}
          labelProps={labelProps}
          scale={scale}
          rangePadding={rangePadding}
          width={width}
          height={height}
          labelAngle={labelAngle ?? getDefaultAxisLabelAngle(orientation)}
          labelStyles={theme.bigLabels}
        />
      )}
      <SVGAnimatedGroup
        data-testid={`axis-${orientation}`}
        x={left}
        y={top}
        springConfig={springConfig ?? contextSpringConfig}
        animate={animate && contextAnimate}
        {...groupProps}
      >
        <SVGAxisTicks
          hideTicks={hideTicks}
          orientation={orientation}
          scale={scale}
          tickLabelProps={tickLabelProps}
          tickGroupProps={tickGroupProps}
          tickLength={tickLength}
          ticks={ticks}
          tickLineProps={tickLineProps}
          renderingOffset={renderingOffset}
          animate={animate && contextAnimate}
          springConfig={springConfig ?? contextSpringConfig}
          tickLabelPadding={tickLabelPadding}
          margin={margin}
          labelStyles={theme.smallLabels}
          tickLabelAngle={tickLabelAngle}
        />
        {!hideAxisLine && (
          <SVGAxisDomainPath
            data-testid="axis-domain"
            {...domainPathProps}
            orientation={orientation}
            renderingOffset={renderingOffset}
            range={domainRange}
            outerTickLength={
              typeof outerTickLength === 'string'
                ? isVertical
                  ? -innerWidth
                  : -innerHeight
                : outerTickLength
            }
            tickSign={tickSign}
            animate={animate && contextAnimate}
            springConfig={springConfig ?? contextSpringConfig}
          />
        )}
      </SVGAnimatedGroup>
    </>
  );
}
