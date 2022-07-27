import { SVGProps } from 'react';
import { animated } from 'react-spring';
import { Text } from '@visx/text';

import { AxisDomainPath } from '@/visx-next/AxisDomainPath';
import { TextProps } from '@/visx-next/types';

import { getLabelTransform } from './getLabelTransform';
import { getTicksData } from './getTicksData';
import { AxisRendererProps } from './SVGAxis';
import { TickDatum } from './types';
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

export type SVGAxisTicksProps = Pick<
  AxisRendererProps,
  | 'hideTicks'
  | 'orientation'
  | 'scale'
  | 'margin'
  | 'tickLineProps'
  | 'springConfig'
  | 'animate'
  | 'renderingOffset'
  | 'tickLength'
  | 'tickLabelPadding'
  | 'tickGroupProps'
  | 'tickLabelProps'
> & { ticks: TickDatum[] };

function SVGAxisTicks({
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
}: SVGAxisTicksProps) {
  const transitions = useAxisTransitions(scale, ticks, springConfig, animate, renderingOffset);
  const isVertical = orientation === 'left' || orientation === 'right';
  const tickTranslateAxis = isVertical ? 'translateY' : 'translateX';
  const tickLineAxis = isVertical ? 'x' : 'y';
  const tickSign = orientation === 'left' || orientation === 'top' ? -1 : 1;
  return (
    <>
      {transitions(({ opacity, translate }, { label }) => (
        <animated.g
          data-test-id="axis-tick-group"
          {...tickGroupProps}
          style={{ opacity, [tickTranslateAxis]: translate }}
        >
          {!hideTicks && (
            <SVGAxisTickLine {...{ [tickLineAxis + '2']: tickSign * tickLength }} {...tickLineProps} />
          )}
          <Text
            data-test-id="axis-label"
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

export function SVGAxisRenderer({
  orientation,
  scale,
  margin,
  tickLabelProps: userTickLabelProps,
  domainPathProps = {},
  outerTickLength = 0,
  hideAxisLine = false,
  label = '',
  labelProps = {},
  labelOffset = 14,
  tickLength = 8,
  hideTicks = false,
  tickGroupProps = {},
  tickLineProps = {},
  tickLabelPadding = 6,
  rangePadding,
  springConfig,
  animate = true,
  renderingOffset = 0,
  hideZero = false,
  tickFormat,
  tickCount,
  tickValues
}: AxisRendererProps) {
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
        margin={margin}
      />
      {!hideAxisLine && (
        <AxisDomainPath
          data-test-id="axis-domain"
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
          data-test-id="axis-label"
          role="presentation"
          aria-hidden
          className="fill-slate-400 font-sans"
          textAnchor="middle"
          fontSize={14}
          {...labelProps}
          {...getLabelTransform({
            labelOffset,
            labelProps,
            orientation,
            range: domainRange,
            maxTickLabelFontSize: tickLabelFontSize,
            tickLength,
            tickLabelPadding,
            margin
          })}
        >
          {label}
        </Text>
      )}
    </>
  );
}
