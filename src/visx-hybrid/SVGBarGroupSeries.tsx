import { useCallback } from 'react';
import type { SpringConfig } from 'react-spring';
import { ScaleOrdinal } from 'd3-scale';

import { BARGROUP_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from './constants';
import { findNearestGroupDatum } from './findNearestGroupDatum';
import { SVGSimpleBar } from './SVGSimpleBar';
import type {
  AxisScale,
  IDatumEntry,
  NearestDatumArgs,
  NearestDatumReturnType,
  ScaleSet,
  SeriesProps,
  SVGBarProps
} from './types';
import { useBarTransitions } from './useBarTransitions';
import { useSeriesEvents } from './useSeriesEvents';

export type SVGBarGroupSeriesProps<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
> = {
  dataKey: string;
  dataEntry: IDatumEntry;
  scales: ScaleSet;
  groupDataKeys: readonly string[];
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  /* A react-spring configuration object */
  springConfig: SpringConfig;
  colorAccessor: (datum: Datum, dataKey: string) => string;
  colorScale: ScaleOrdinal<string, string, never>;
  enableEvents?: boolean;
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
  dataEntry,
  groupDataKeys,
  scales,
  horizontal,
  renderingOffset,
  springConfig,
  animate,
  colorAccessor,
  colorScale,
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
      findNearestGroupDatum(params, scales.group[0], horizontal),
    [scales.group, horizontal]
  );
  const ownEventSourceKey = `${BARGROUP_EVENT_SOURCE}-${groupDataKeys.join('-')}}`;
  /* const eventEmitters =  */ useSeriesEvents<IndependentScale, DependentScale, Datum>({
    dataKeyOrKeysRef: groupDataKeys,
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
  const transitions = useBarTransitions<Datum>({
    dataEntry,
    scales,
    horizontal,
    renderingOffset,
    springConfig,
    animate,
    seriesIsLeaving: !groupDataKeys.includes(dataEntry.dataKey)
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
