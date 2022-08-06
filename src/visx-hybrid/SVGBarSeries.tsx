import type { SVGProps } from 'react';
import { SpringConfig } from 'react-spring';

import { BARSERIES_EVENT_SOURCE, defaultSmallLabelsFont, XYCHART_EVENT_SOURCE } from './constants';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { SVGSimpleBar } from './SVGSimpleBar';
import { SVGAnimatedSimpleText } from './SVGSimpleText';
import type { AxisScale, BarLabelPosition, ScaleInput, SVGBarProps } from './types';
import { useBarLabelTransitions } from './useBarLabelTransitions';
import { useBarSeriesTransitions } from './useBarSeriesTransitions';
import { useDataContext } from './useDataContext';
import { useSeriesEvents } from './useSeriesEvents';

export type SVGBarSeriesProps<Datum extends object> = {
  springConfig?: SpringConfig;
  animate?: boolean;
  dataKey: string;
  data: readonly Datum[];
  keyAccessor?: (datum: Datum, dataKey?: string) => string;
  independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  colorAccessor?: (datum: Datum, dataKey: string) => string;
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  enableEvents?: boolean;
  component?: (props: SVGBarProps<Datum>) => JSX.Element;
  /** Must be a stable function. */
  labelFormatter?: (value: ScaleInput<AxisScale>) => string;
  labelPosition?: BarLabelPosition;
  positionLabelOutsideOnOverflow?: boolean;
};

export function SVGBarSeries<Datum extends object>({
  groupProps,
  springConfig: springConfigProp,
  animate: animateProp = true,
  dataKey,
  enableEvents = true,
  component: BarComponent = SVGSimpleBar,
  labelFormatter,
  labelPosition = 'inside',
  positionLabelOutsideOnOverflow = true
}: SVGBarSeriesProps<Datum>) {
  const {
    horizontal,
    independentScale,
    dependentScale,
    colorScale,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntries,
    theme
  } = useDataContext();
  const dataEntry = dataEntries.find((dataEntry) => dataEntry.dataKey === dataKey);
  if (!dataEntry) {
    throw new Error(`Could not find data for dataKey '${dataKey}'`);
  }
  const {
    independentAccessor,
    dependentAccessor,
    data,
    underlying: { keyAccessor, colorAccessor }
  } = dataEntry;
  const ownEventSourceKey = `${BARSERIES_EVENT_SOURCE}-${dataKey}`;
  const springConfig = springConfigProp ?? contextSpringConfig;
  const animate = animateProp && contextAnimate;
  // const eventEmitters =
  useSeriesEvents<AxisScale, AxisScale, Datum>({
    dataKeyOrKeys: dataKey,
    enableEvents,
    // onBlur,
    // onFocus,
    // onPointerMove,
    // onPointerOut,
    // onPointerUp,
    source: ownEventSourceKey,
    allowedSources: [XYCHART_EVENT_SOURCE]
  });
  const transitions = useBarSeriesTransitions({
    data,
    independentScale,
    dependentScale,
    keyAccessor,
    independentAccessor,
    dependentAccessor,
    horizontal,
    springConfig,
    animate,
    renderingOffset
  });
  const labelStyles = theme.smallLabels;
  const fontMetrics = getFontMetricsWithCache(labelStyles?.font ?? defaultSmallLabelsFont);
  const labelTransitions = useBarLabelTransitions({
    data,
    independentScale,
    dependentScale,
    keyAccessor,
    independentAccessor,
    dependentAccessor,
    horizontal,
    springConfig,
    animate,
    renderingOffset,
    labelFormatter,
    labelStyles,
    position: labelPosition,
    positionOutsideOnOverflow: positionLabelOutsideOnOverflow
  });
  return (
    <>
      <g data-testid={`bar-series-${dataKey}`} {...groupProps}>
        {transitions((springValues, datum, _, index) => (
          <BarComponent
            springValues={springValues}
            datum={datum}
            index={index}
            dataKey={dataKey}
            horizontal={horizontal}
            colorScale={colorScale}
            colorAccessor={colorAccessor}
          />
        ))}
        {labelTransitions((styles, datum) => (
          <SVGAnimatedSimpleText
            springValues={styles}
            textAnchor="middle"
            verticalAnchor="middle"
            fontHeight={fontMetrics.height}
            fontHeightFromBaseline={fontMetrics.heightFromBaseline}
            fill="white"
          >
            {datum.label}
          </SVGAnimatedSimpleText>
          // <animated.text
          //   // x={horizontal ? x1 : cx}
          //   // y={horizontal ? cy : y1}
          //   x={x}
          //   y={y}
          //   fill="white"
          //   style={{ opacity }}
          //   // textAnchor={horizontal ? 'start' : 'middle'}
          //   textAnchor="middle"
          //   verticalAnchor="middle"
          //   dy={-6}
          // >
          //   {datum.label}
          // </animated.text>
        ))}
        {/* 
        {data.map((datum) => {
          const dependentValue = dependentAccessor(datum);
          const dependentValueIsPositive = dependentValue >= 0;
          const fontMetrics = getFontMetricsWithCache(
            theme?.smallLabels?.font ?? defaultSmallLabelsTextStyle.font
          );
          const independentCoord =
            (coerceNumber(independentScale(independentAccessor(datum))) ?? 0) +
            getScaleBandwidth(independentScale) * 0.5;
          const padding = horizontal
            ? dependentValueIsPositive
              ? 8
              : -8
            : dependentValueIsPositive
            ? -4
            : 4;
          const dependentCoord = (coerceNumber(dependentScale(dependentValue)) ?? 0) + padding;
          return (
            <SVGSimpleText
              key={keyAccessor(datum)}
              textStyles={theme?.smallLabels ?? defaultSmallLabelsTextStyle}
              textAnchor={horizontal ? (dependentValueIsPositive ? 'start' : 'end') : 'middle'}
              verticalAnchor={horizontal ? 'middle' : dependentValueIsPositive ? 'end' : 'start'}
              x={horizontal ? dependentCoord : independentCoord}
              y={horizontal ? independentCoord : dependentCoord}
              role="presentation"
              aria-hidden
              fill="white"
              fontHeight={fontMetrics.height}
              fontHeightFromBaseline={fontMetrics.heightFromBaseline}
            >
              {dependentValue}
            </SVGSimpleText>
          );
        })} */}
      </g>
    </>
  );
}
