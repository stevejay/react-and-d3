import { useCallback } from 'react';
import type { SpringConfig } from 'react-spring';
import { ScaleBand, ScaleOrdinal } from 'd3-scale';

import { BARGROUP_EVENT_SOURCE, defaultSmallLabelsFont, XYCHART_EVENT_SOURCE } from './constants';
import { findNearestGroupDatum } from './findNearestGroupDatum';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { SVGSimpleBar } from './SVGSimpleBar';
import { SVGAnimatedSimpleText } from './SVGSimpleText';
import type {
  AxisScale,
  BarLabelPosition,
  NearestDatumArgs,
  NearestDatumReturnType,
  ScaleInput,
  SeriesProps,
  SVGBarProps,
  XYChartTheme
} from './types';
import { useBarGroupTransitions } from './useBarGroupTransitions';
import { useBarLabelTransitions } from './useBarLabelTransitions';
import { useSeriesEvents } from './useSeriesEvents';

export type SVGBarGroupSeriesProps<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
> = {
  dataKey: string;
  data: readonly Datum[];
  dataKeys: readonly string[];
  independentScale: IndependentScale;
  dependentScale: DependentScale;
  groupScale: ScaleBand<string>;
  keyAccessor: (datum: Datum) => string;
  independentAccessor: (datum: Datum) => ScaleInput<IndependentScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<DependentScale>;
  underlyingDatumAccessor: (datum: Datum) => Datum;
  underlyingDependentAccessor: (datum: Datum) => ScaleInput<IndependentScale>;
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  /* A react-spring configuration object */
  springConfig: SpringConfig;
  colorAccessor?: (datum: Datum, key: string) => string;
  colorScale: ScaleOrdinal<string, string, never>;
  // barClassName?: string;
  enableEvents?: boolean;
  // barProps?: PolygonProps | ((datum: Datum, index: number, dataKey: string) => PolygonProps);
  component?: (props: SVGBarProps<Datum>) => JSX.Element;
  /** Must be a stable function. */
  labelFormatter?: (value: ScaleInput<AxisScale>) => string;
  /** Optional; defaults to `'inside'`. Ignored if `labelFormatter` prop is not given. */
  labelPosition?: BarLabelPosition;
  /** Optional; defaults to `true`. Ignored if `labelFormatter` prop is not given. */
  outsideOnLabelOverflow?: boolean;
  theme: XYChartTheme;
} & Pick<
  SeriesProps<IndependentScale, DependentScale, Datum>,
  'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus' | 'enableEvents'
>;

export function SVGBarGroupSeries<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>({
  dataKey,
  data,
  dataKeys,
  independentScale,
  dependentScale,
  groupScale,
  keyAccessor,
  independentAccessor,
  dependentAccessor,
  underlyingDatumAccessor,
  underlyingDependentAccessor,
  horizontal,
  renderingOffset,
  springConfig,
  animate,
  colorAccessor,
  colorScale,
  // barProps = {},
  //   onBlur,
  //   onFocus,
  //   onPointerMove,
  //   onPointerOut,
  //   onPointerUp,
  enableEvents = true,
  component: BarComponent = SVGSimpleBar,
  labelFormatter,
  labelPosition = 'inside',
  outsideOnLabelOverflow = true,
  theme
}: SVGBarGroupSeriesProps<IndependentScale, DependentScale, Datum>) {
  const findNearestDatum = useCallback(
    (params: NearestDatumArgs<Datum>): NearestDatumReturnType<Datum> =>
      findNearestGroupDatum(params, groupScale, horizontal),
    [groupScale, horizontal]
  );

  const ownEventSourceKey = `${BARGROUP_EVENT_SOURCE}-${dataKeys.join('-')}}`;

  /* const eventEmitters =  */ useSeriesEvents<IndependentScale, DependentScale, Datum>({
    dataKeyOrKeys: dataKeys,
    enableEvents,
    findNearestDatum,
    // onBlur,
    // onFocus,
    // onPointerMove,
    // onPointerOut,
    // onPointerUp,
    source: ownEventSourceKey,
    allowedSources: [XYCHART_EVENT_SOURCE, ownEventSourceKey]
  });

  const transitions = useBarGroupTransitions({
    data,
    independentScale,
    dependentScale,
    groupScale,
    keyAccessor,
    independentAccessor,
    dependentAccessor,
    dataKey,
    dataKeys,
    horizontal,
    springConfig,
    animate,
    renderingOffset
  });

  const labelStyles = theme.datumLabels ?? theme.smallLabels;
  const labelFont = labelStyles?.font ?? defaultSmallLabelsFont;
  const fontMetrics = getFontMetricsWithCache(labelStyles?.font ?? defaultSmallLabelsFont);
  const labelTransitions = useBarLabelTransitions({
    data,
    independentScale,
    dependentScale,
    groupScale,
    keyAccessor,
    independentAccessor,
    dependentAccessor,
    underlyingDatumAccessor,
    underlyingDependentAccessor,
    dataKey,
    horizontal,
    springConfig,
    animate,
    renderingOffset,
    labelFormatter,
    font: labelFont,
    position: labelPosition,
    positionOutsideOnOverflow: outsideOnLabelOverflow,
    hideOnOverflow: true
  });

  return (
    <>
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
          textStyles={labelStyles}
          fill="white"
        >
          {datum.label}
        </SVGAnimatedSimpleText>
      ))}
    </>
  );
}
