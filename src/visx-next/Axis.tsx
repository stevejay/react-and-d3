import { ReactNode, SVGProps, useContext } from 'react';
import { animated } from 'react-spring';
import { AxisScale } from '@visx/axis';
import { Group } from '@visx/group';
import { getTicks, ScaleInput } from '@visx/scale';
import { Text } from '@visx/text';

import { useAxisTransitions } from './animation';
import { AxisDomainPath } from './AxisDomainPath';
import { DataContext } from './DataContext';
import { getLabelTransform } from './getLabelTransform';
import { getTickFormatter } from './getTickFormatter';
import { CommonAxisProps, SvgAxisRendererProps, TextProps, TicksRendererProps } from './types';

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
      data-test-id="axis-tick"
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
  tickValues,
  tickFormat,
  tickLength = 0,
  tickLineProps,
  springConfig,
  animate = true,
  renderingOffset,
  tickLabelPadding = 3
}: TicksRendererProps<Scale>) {
  const transitions = useAxisTransitions(scale, tickValues, springConfig, animate, renderingOffset);
  const isVertical = orientation === 'left' || orientation === 'right';
  const tickTranslateAxis = isVertical ? 'translateY' : 'translateX';
  const tickLineAxis = isVertical ? 'x' : 'y';
  const tickSign = orientation === 'left' || orientation === 'top' ? -1 : 1;
  return (
    <>
      {transitions(({ opacity, translate }, tickValue, _, index) => {
        return (
          <animated.g
            data-test-id="axis-tick-group"
            {...tickGroupProps}
            style={{ opacity, [tickTranslateAxis]: translate }}
          >
            {!hideTicks && (
              <SvgAxisTickLine {...{ [tickLineAxis + '2']: tickSign * tickLength }} {...tickLineProps} />
            )}
            <Text
              data-test-id="axis-label"
              role="presentation"
              aria-hidden
              {...{ [tickLineAxis]: tickSign * ((hideTicks ? 0 : tickLength) + tickLabelPadding) }}
              {...(typeof tickLabelProps === 'function'
                ? tickLabelProps?.(tickValue, index, tickValues)
                : tickLabelProps)}
            >
              {tickFormat?.(tickValue, index, tickValues) ?? ''}
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
  hideAxisLine = false,
  hideTicks,
  rangePadding = 0,
  label = '',
  labelOffset = 14,
  orientation = 'bottom',
  scale,
  tickLineProps,
  tickLabelProps = defaultTextProps,
  tickGroupProps,
  tickLength = 8,
  outerTickLength = 0,
  tickFormat,
  tickValues,
  ticksComponent = Ticks,
  springConfig,
  renderingOffset,
  animate = true,
  tickLabelPadding
}: SvgAxisRendererProps<Scale>) {
  const isLeft = orientation === 'left';
  const isTop = orientation === 'top';
  // const horizontal = isTop || orientation === 'bottom';
  const tickSign = isLeft || isTop ? -1 : 1;

  // compute the max tick label size to compute label offset
  const allTickLabelProps = tickValues.map((value, index) =>
    typeof tickLabelProps === 'function' ? tickLabelProps(value, index, tickValues) : tickLabelProps
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
        tickFormat,
        tickLength,
        tickValues,
        tickLineProps,
        renderingOffset,
        animate,
        springConfig,
        tickLabelPadding
      })}

      {!hideAxisLine && (
        <AxisDomainPath
          data-test-id="axis-domain"
          className={domainPathClassName}
          {...domainPathProps}
          orientation={orientation}
          renderingOffset={renderingOffset}
          range={scale.range()}
          outerTickLength={outerTickLength}
          tickSign={tickSign}
          animate={animate}
          springConfig={springConfig}
        />
      )}

      {label && (
        <Text
          data-test-id="axis-label"
          role="presentation"
          aria-hidden
          className={labelClassName}
          {...labelProps}
          {...getLabelTransform({
            labelOffset,
            labelProps,
            orientation,
            range: scale.range(),
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
  /** The class name applied to the outermost axis group element. */
  // axisClassName?: string;
  /** A top pixel offset applied to the entire axis. */
  top?: number;
  /** A left pixel offset applied to the entire axis. */
  left?: number;
  /** A [d3](https://github.com/d3/d3-scale) or [visx](https://github.com/airbnb/visx/tree/master/packages/visx-scale) scale function. */
  // scale: Scale;
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
  tickCount = 10,
  orientation = 'bottom',
  scale,
  tickFormat,
  tickValues,
  children = SvgAxisRenderer,
  ...restProps
}: SvgAxisProps<Scale>) {
  const filteredTickValues = (tickValues ?? getTicks(scale, tickCount)).filter(
    (value) => !hideZero || (value !== 0 && value !== '0')
  );
  return (
    <Group data-test-id={`axis-${orientation}`} {...axisGroupProps} top={top} left={left}>
      {children({
        ...restProps,
        hideZero,
        tickCount,
        orientation,
        scale,
        tickFormat: tickFormat ?? getTickFormatter(scale),
        tickValues: filteredTickValues
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
  ...rest
}: SvgXYChartAxisProps<Scale>) {
  const {
    xScale,
    yScale,
    margin,
    width,
    height,
    springConfig: fallbackSpringConfig
  } = useContext(DataContext);

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

  const scale = (orientation === 'left' || orientation === 'right' ? yScale : xScale) as Scale | undefined;
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
    />
  );
}
