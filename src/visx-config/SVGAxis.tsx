import { SVGProps } from 'react';
import { animated, SpringConfig } from 'react-spring';
import { Group } from '@visx/group';
import { Text } from '@visx/text';

import { VariableType } from '@/visx-hybrid/types';
import { AxisDomainPath } from '@/visx-next/AxisDomainPath';
import { getLabelTransform } from '@/visx-next/getLabelTransform';
import { AxisScale, LineProps, Margin, Orientation, TextProps } from '@/visx-next/types';

import { getTicksData } from './getTicksData';
import { AxisConfig, TickDatum } from './types';
import { useAxisTransitions } from './useAxisTransitions';

type SVGAxisTickLineProps = Omit<SVGProps<SVGLineElement>, 'ref'>;

function SVGAxisTickLine({
  stroke = 'currentColor',
  strokeLinecap = 'square',
  strokeWidth = 1,
  shapeRendering = 'crispEdges',
  ...rest
}: SVGAxisTickLineProps) {
  return (
    <line
      data-testid="axis-tick"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      shapeRendering={shapeRendering}
      role="presentation"
      aria-hidden
      {...rest}
    />
  );
}

export type SVGAxisTicksProps<Scale extends AxisScale> = Pick<
  SvgAxisRendererProps<Scale>,
  | 'hideTicks'
  | 'orientation'
  | 'scale'
  | 'ticks'
  | 'tickLineProps'
  | 'springConfig'
  | 'animate'
  | 'renderingOffset'
  | 'tickLength'
  | 'tickLabelPadding'
  | 'tickGroupProps'
  | 'tickLabelProps'
>;

function SVGAxisTicks<Scale extends AxisScale>({
  scale,
  hideTicks = false,
  orientation,
  tickLabelProps,
  tickGroupProps,
  ticks,
  tickLength = 0,
  tickLineProps,
  springConfig,
  animate = true,
  renderingOffset,
  tickLabelPadding = 3
}: SVGAxisTicksProps<Scale>) {
  const transitions = useAxisTransitions(scale, ticks, springConfig, animate, renderingOffset);
  const isVertical = orientation === 'left' || orientation === 'right';
  const tickTranslateAxis = isVertical ? 'translateY' : 'translateX';
  const tickLineAxis = isVertical ? 'x' : 'y';
  const tickSign = orientation === 'left' || orientation === 'top' ? -1 : 1;
  return (
    <>
      {transitions(({ opacity, translate }, { label }) => (
        <animated.g
          data-testid="axis-tick-group"
          {...tickGroupProps}
          style={{ opacity, [tickTranslateAxis]: translate }}
        >
          {!hideTicks && (
            <SVGAxisTickLine {...{ [tickLineAxis + '2']: tickSign * tickLength }} {...tickLineProps} />
          )}
          <Text
            data-testid="axis-label"
            role="presentation"
            aria-hidden
            // className='fill-slate-400 font-sans'
            // fontSize={12}
            {...{ [tickLineAxis]: tickSign * ((hideTicks ? 0 : tickLength) + tickLabelPadding) }}
            {...tickLabelProps}
          >
            {label}
          </Text>
        </animated.g>
      ))}
    </>
  );
}

// const defaultTickLabelProps: Partial<TextProps> = {
//   textAnchor: 'middle',
//   fontFamily: 'inherit',
//   fontSize: 12,
//   fill: 'currentColor'
// };

export type SvgAxisRendererProps<Scale extends AxisScale> = {
  orientation: Orientation;
  scale: Scale;
  //   axisConfig: AxisConfig;
  ticks: TickDatum[];
  rangePadding: number;
  springConfig: SpringConfig;
  animate: boolean;
  renderingOffset: number;

  /**  If true, will hide the axis line. */
  hideAxisLine?: boolean;
  /** If true, will hide the ticks (but not the tick labels). */
  hideTicks?: boolean;
  /** Props to apply to the <g> element that wraps each tick line and label. */
  tickGroupProps?: Omit<SVGProps<SVGGElement>, 'ref' | 'style'>; // TODO think about removing style.
  /** Padding between the tick lines and the tick labels. */
  tickLabelPadding?: number;
  /** The props to apply to the tick labels. */
  tickLabelProps?: Partial<TextProps>;
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
  labelProps?: Partial<TextProps>;
  /** Props to apply to the axis domain path. */
  domainPathProps?: Omit<SVGProps<SVGPathElement>, 'ref'>;
};

function SvgAxisRenderer<Scale extends AxisScale>({
  orientation,
  scale,
  tickLabelProps: userTickLabelProps,
  domainPathProps = {},
  outerTickLength = 0,
  hideAxisLine = false,
  label = '',
  labelProps = {},
  labelPadding = 14,
  tickLength = 8,
  hideTicks = false,
  tickGroupProps = {},
  tickLineProps = {},
  tickLabelPadding = 6,
  ticks,
  rangePadding,
  springConfig,
  animate,
  renderingOffset
}: SvgAxisRendererProps<Scale>) {
  const isLeft = orientation === 'left';
  const isTop = orientation === 'top';
  const isVertical = orientation === 'left' || orientation === 'right';
  const tickSign = isLeft || isTop ? -1 : 1;
  const rangeFrom = Number(scale.range()[0]) ?? 0;
  const rangeTo = Number(scale.range()[1]) ?? 0;
  const domainRange = isVertical
    ? [rangeFrom + rangePadding, rangeTo - rangePadding]
    : [rangeFrom - rangePadding, rangeTo + rangePadding];

  const tickLabelProps = {
    textAnchor: (orientation === 'left'
      ? 'end'
      : orientation === 'right'
      ? 'start'
      : 'middle') as NonNullable<TextProps['textAnchor']>,
    verticalAnchor: (orientation === 'top'
      ? 'end'
      : orientation === 'bottom'
      ? 'start'
      : 'middle') as NonNullable<TextProps['verticalAnchor']>,
    fontFamily: 'inherit',
    fontSize: 12,
    fill: 'currentColor',
    className: 'fill-slate-400 font-sans',
    ...userTickLabelProps
  };

  const tickLabelFontSize = typeof tickLabelProps?.fontSize === 'number' ? tickLabelProps.fontSize : 0;
  return (
    <>
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
        animate={animate}
        springConfig={springConfig}
        tickLabelPadding={tickLabelPadding}
      />
      {!hideAxisLine && (
        <AxisDomainPath
          data-testid="axis-domain"
          {...domainPathProps}
          orientation={orientation}
          renderingOffset={renderingOffset}
          range={domainRange}
          outerTickLength={outerTickLength}
          tickSign={tickSign}
          animate={animate}
          springConfig={springConfig}
        />
      )}
      {label && (
        <Text
          data-testid="axis-label"
          role="presentation"
          aria-hidden
          className="fill-slate-400 font-sans"
          textAnchor="middle"
          fontSize={14}
          {...labelProps}
          {...getLabelTransform({
            labelPadding,
            labelProps,
            orientation,
            range: domainRange,
            maxTickLabelFontSize: tickLabelFontSize,
            tickLength
          })}
        >
          {label}
        </Text>
      )}
    </>
  );
}

export type SVGAxisProps<Scale extends AxisScale> = {
  scale: Scale;
  axisConfig: AxisConfig;
  horizontal: boolean;
  variableType: VariableType;
  width: number;
  height: number;
  margin: Margin;
  rangePadding: number;
  springConfig: SpringConfig;
  animate: boolean;
  renderingOffset?: number;
};

export function SVGAxis<Scale extends AxisScale>({
  scale,
  axisConfig,
  horizontal,
  variableType,
  width,
  height,
  margin,
  rangePadding,
  springConfig,
  animate,
  renderingOffset = 0
}: SVGAxisProps<Scale>) {
  const orientation =
    horizontal && variableType === 'independent'
      ? axisConfig.position === 'start'
        ? 'left'
        : 'right'
      : horizontal && variableType === 'dependent'
      ? axisConfig.position === 'start'
        ? 'bottom'
        : 'top'
      : !horizontal && variableType == 'independent'
      ? axisConfig.position === 'start'
        ? 'bottom'
        : 'top'
      : axisConfig.position === 'start'
      ? 'left'
      : 'right'; // !horizontal && variableType === 'dependent'

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

  //   const isVertical = orientation === 'left' || orientation === 'right';
  //   const fallbackRangePadding = isVertical ? yRangePadding : xRangePadding;

  const axisTicks = getTicksData(scale, axisConfig);

  return (
    <Group
      data-testid={`axis-${orientation}`}
      // {...axisGroupProps}
      top={top}
      left={left}
    >
      {SvgAxisRenderer({
        // ...restProps,
        // hideZero,
        // tickCount,
        orientation,
        scale,
        ticks: axisTicks,
        springConfig,
        animate,
        rangePadding,
        renderingOffset,
        ...axisConfig
        // tickFormat: tickFormat ?? getTickFormatter(scale),
      })}
    </Group>
  );
}
