import { useCallback } from 'react';
import type { SpringConfig } from 'react-spring';
import { ScaleBand, ScaleOrdinal } from 'd3-scale';

import { BARGROUP_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from './constants';
import { findNearestGroupDatum } from './findNearestGroupDatum';
import { SVGSimpleBar } from './SVGSimpleBar';
import type {
  AxisScale,
  NearestDatumArgs,
  NearestDatumReturnType,
  ScaleInput,
  SeriesProps,
  SVGBarProps
} from './types';
import { useBarGroupTransitions } from './useBarGroupTransitions';
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
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  /* A react-spring configuration object */
  springConfig: SpringConfig;
  colorAccessor?: (d: Datum, key: string) => string;
  colorScale: ScaleOrdinal<string, string, never>;
  // barClassName?: string;
  enableEvents?: boolean;
  // barProps?: PolygonProps | ((datum: Datum, index: number, dataKey: string) => PolygonProps);
  component?: (props: SVGBarProps<Datum>) => JSX.Element;
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
  component: BarComponent = SVGSimpleBar
}: SVGBarGroupSeriesProps<IndependentScale, DependentScale, Datum>) {
  const findNearestDatum = useCallback(
    (params: NearestDatumArgs<Datum>): NearestDatumReturnType<Datum> =>
      findNearestGroupDatum(params, groupScale, horizontal),
    [groupScale, horizontal]
  );

  const ownEventSourceKey = `${BARGROUP_EVENT_SOURCE}-${dataKeys.join('-')}}`;

  /* const eventEmitters =  */ useSeriesEvents<IndependentScale, DependentScale, Datum>({
    dataKey: dataKeys,
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
    </>
  );
}
