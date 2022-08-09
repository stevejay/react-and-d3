import { ReactNode, SVGProps, useContext } from 'react';
import { animated } from 'react-spring';
import { Group } from '@visx/group';
import { ScaleInput } from '@visx/scale';
import { Text } from '@visx/text';

import { useAxisTransitions } from './animation';
import { AxisDomainPath } from './AxisDomainPath';
import { getLabelTransform } from './getLabelTransform';
import { getTicksData } from './getTicksData';
import { AxisScale, CommonAxisProps, SvgAxisRendererProps, TextProps, TicksRendererProps } from './types';
import { XYChartContext } from './XYChartContext';

type SvgAxisTickLineProps = Omit<SVGProps<SVGLineElement>, 'ref'>;

function SvgAxisTickLine({
  stroke = 'currentColor',
  strokeLinecap = 'square',
  strokeWidth = 1,
  shapeRendering = 'crispEdges',
  ...rest
}: SvgAxisTickLineProps) {
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

function Ticks<Scale extends AxisScale>({
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
}: TicksRendererProps<Scale>) {
  const transitions = useAxisTransitions(scale, ticks, springConfig, animate, renderingOffset);
  const isVertical = orientation === 'left' || orientation === 'right';
  const tickTranslateAxis = isVertical ? 'translateY' : 'translateX';
  const tickLineAxis = isVertical ? 'x' : 'y';
  const tickSign = orientation === 'left' || orientation === 'top' ? -1 : 1;
  return (
    <>
      {transitions(({ opacity, translate }, { label, value }, _, index) => {
        return (
          <animated.g
            data-testid="axis-tick-group"
            {...tickGroupProps}
            style={{ opacity, [tickTranslateAxis]: translate }}
          >
            {!hideTicks && (
              <SvgAxisTickLine {...{ [tickLineAxis + '2']: tickSign * tickLength }} {...tickLineProps} />
            )}
            <Text
              data-testid="axis-label"
              role="presentation"
              aria-hidden
              {...{ [tickLineAxis]: tickSign * ((hideTicks ? 0 : tickLength) + tickLabelPadding) }}
              {...(typeof tickLabelProps === 'function'
                ? tickLabelProps?.(value, index, ticks)
                : tickLabelProps)}
            >
              {label}
            </Text>
          </animated.g>
        );
      })}
    </>
  );
}

const defaultTextProps: Partial<TextProps> = {
  textAnchor: 'middle',
  fontFamily: 'inherit',
  fontSize: 12,
  fill: 'currentColor'
};

function SvgAxisRenderer<Scale extends AxisScale>({
  domainPathClassName = '',
  domainPathProps = {},
  labelClassName = '',
  labelProps = {},
  hideAxisPath = false,
  hideTicks,
  rangePadding = 0,
  label = '',
  labelPadding = 14,
  orientation = 'bottom',
  scale,
  tickLineProps,
  tickLabelProps = defaultTextProps,
  tickGroupProps,
  tickLength = 8,
  outerTickLength = 0,
  ticks,
  ticksComponent = Ticks,
  springConfig,
  renderingOffset,
  animate = true,
  tickLabelPadding
}: SvgAxisRendererProps<Scale>) {
  const isLeft = orientation === 'left';
  const isTop = orientation === 'top';
  const isVertical = orientation === 'left' || orientation === 'right';
  const tickSign = isLeft || isTop ? -1 : 1;
  const rangeFrom = Number(scale.range()[0]) ?? 0;
  const rangeTo = Number(scale.range()[1]) ?? 0;
  const range = isVertical
    ? [rangeFrom + rangePadding, rangeTo - rangePadding]
    : [rangeFrom - rangePadding, rangeTo + rangePadding];

  // compute the max tick label size to compute label offset
  const allTickLabelProps = ticks.map((value, index) =>
    typeof tickLabelProps === 'function' ? tickLabelProps(value, index, ticks) : tickLabelProps
  );

  const maxTickLabelFontSize = Math.max(
    10,
    ...allTickLabelProps.map((props) => (typeof props.fontSize === 'number' ? props.fontSize : 0))
  );

  return (
    <>
      {ticksComponent({
        hideTicks,
        orientation,
        scale,
        tickLabelProps,
        tickGroupProps,
        tickLength,
        ticks,
        tickLineProps,
        renderingOffset,
        animate,
        springConfig,
        tickLabelPadding
      })}

      {!hideAxisPath && (
        <AxisDomainPath
          data-testid="axis-domain"
          className={domainPathClassName}
          {...domainPathProps}
          orientation={orientation}
          renderingOffset={renderingOffset}
          range={range}
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
          className={labelClassName}
          {...labelProps}
          {...getLabelTransform({
            labelPadding,
            labelProps,
            orientation,
            range,
            maxTickLabelFontSize,
            tickLength
          })}
        >
          {label}
        </Text>
      )}
    </>
  );
}

export type SvgAxisProps<Scale extends AxisScale> = CommonAxisProps<Scale> & {
  /** A top pixel offset applied to the entire axis. */
  top?: number;
  /** A left pixel offset applied to the entire axis. */
  left?: number;
  /** An array of values that determine the number and values of the ticks. Falls back to `scale.ticks()` or `.domain()`. */
  tickValues?: ScaleInput<Scale>[];
  /** Use to override the default axis renderer. */
  children?: (renderProps: SvgAxisRendererProps<Scale>) => ReactNode;
};

function SvgAxis<Scale extends AxisScale>({
  axisGroupProps = {},
  hideZero = false,
  left = 0,
  top = 0,
  tickCount,
  orientation = 'bottom',
  scale,
  tickFormat,
  tickValues,
  children = SvgAxisRenderer,
  ...restProps
}: SvgAxisProps<Scale>) {
  // const filteredTickValues = (tickValues ?? getTicks(scale, tickCount)).filter(
  //   (value) => !hideZero || (value !== 0 && value !== '0')
  // );
  const ticks = getTicksData(scale, hideZero, tickFormat, tickCount, tickValues);

  return (
    <Group data-testid={`axis-${orientation}`} {...axisGroupProps} top={top} left={left}>
      {children({
        ...restProps,
        hideZero,
        tickCount,
        orientation,
        scale,
        ticks
      })}
    </Group>
  );
}

export type SvgXYChartAxisProps<Scale extends AxisScale> = Omit<
  SvgAxisProps<Scale>,
  'scale' | 'top' | 'left'
>;

export function SvgXYChartAxis<Scale extends AxisScale>({
  orientation,
  springConfig,
  rangePadding,
  ...rest
}: SvgXYChartAxisProps<Scale>) {
  const {
    xScale,
    yScale,
    margin,
    width,
    height,
    springConfig: fallbackSpringConfig,
    xRangePadding,
    yRangePadding
  } = useContext(XYChartContext);

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

  const isVertical = orientation === 'left' || orientation === 'right';
  const fallbackRangePadding = isVertical ? yRangePadding : xRangePadding;
  const scale = (isVertical ? yScale : xScale) as Scale | undefined;

  if (!scale) {
    return null;
  }

  return (
    <SvgAxis
      {...rest}
      scale={scale}
      top={top}
      left={left}
      orientation={orientation}
      springConfig={springConfig ?? fallbackSpringConfig}
      rangePadding={rangePadding ?? fallbackRangePadding}
    />
  );
}
