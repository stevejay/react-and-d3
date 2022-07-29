import { ReactNode, SVGProps } from 'react';
import { SpringConfig } from 'react-spring';

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
import type {
  AxisOrientation,
  AxisScale,
  LabelAngle,
  LineProps,
  Margin,
  ScaleInput,
  SVGTextProps,
  TextProps,
  TickFormatter,
  TickLabelAngle,
  VariableType,
  XYChartTheme
} from './types';
import { useDataContext } from './useDataContext';

export type AxisRendererProps = {
  orientation: AxisOrientation;
  scale: AxisScale;
  margin: Margin;
  rangePadding: number;
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
  tickLabelProps?: Partial<Omit<TextProps, 'verticalAnchor' | 'textAnchor'>>;
  /** The length of the tick lines. */
  tickLength?: number;
  /** The length of the outer ticks (added at the very start and very end of the axis domain). */
  outerTickLength?: number;
  /** Props to be applied to individual tick lines. */
  tickLineProps?: LineProps;
  /** The text for the axis label. */
  label?: string;
  /** Pixel offset of the axis label. */
  labelPadding?: number;
  /** Props to apply to the axis label. */
  labelProps?: Partial<SVGTextProps>;
  /** The angle that the axis label will be rendered at. */
  labelAngle?: LabelAngle;
  /** Props to apply to the axis domain path. */
  domainPathProps?: Omit<SVGProps<SVGPathElement>, 'ref'>;
  theme: XYChartTheme;
};

export type AxisRenderer = (props: AxisRendererProps) => ReactNode;

export type SVGAxisProps = Omit<
  AxisRendererProps,
  'scale' | 'margin' | 'theme' | 'rangePadding' | 'orientation'
> & {
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref' | 'x' | 'y'>;
  position: 'start' | 'end';
  variableType: VariableType;
  // renderer: AxisRenderer;
};

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
    theme
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
          labelStyles={theme.svgLabelBig}
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
          labelStyles={theme.svgLabelSmall}
          tickLabelAngle={tickLabelAngle}
        />
        {!hideAxisLine && (
          <SVGAxisDomainPath
            data-testid="axis-domain"
            {...domainPathProps}
            orientation={orientation}
            renderingOffset={renderingOffset}
            range={domainRange}
            outerTickLength={outerTickLength}
            tickSign={tickSign}
            animate={animate && contextAnimate}
            springConfig={springConfig ?? contextSpringConfig}
          />
        )}
        {/* 
        {renderer({
          ...restProps,
          tickLabelProps,
          orientation,
          scale,
          springConfig: springConfig ?? contextSpringConfig,
          animate: animate && contextAnimate,
          rangePadding,
          margin,
          tickLabelAngle,
          theme
        })} */}
      </SVGAnimatedGroup>
    </>
  );
}
