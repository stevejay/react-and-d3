import type { SVGProps } from 'react';
import type { SpringConfig } from 'react-spring';

import { BARSERIES_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from './constants';
import { SVGAccessibleBarSeries, SVGAccessibleBarSeriesProps } from './SVGAccessibleBarSeries';
import { SVGSimpleBar } from './SVGSimpleBar';
import type { AxisScale, ScaleInput, SVGBarProps } from './types';
import { useBarSeriesTransitions } from './useBarSeriesTransitions';
import { useDataContext } from './useDataContext';
import { useSeriesEvents } from './useSeriesEvents';

// type PolygonProps = Omit<SVGProps<SVGPolygonElement>, 'points' | 'ref'>;
// type LineProps = Omit<SVGProps<SVGLineElement>, 'x1' | 'y1' | 'x2' | 'y2' | 'ref'>;

export type SVGBarSeriesProps<Datum extends object> = {
  springConfig?: SpringConfig;
  animate?: boolean;
  dataKey: string;
  data: readonly Datum[];
  keyAccessor: (d: Datum, dataKey?: string) => string;
  independentAccessor: (d: Datum) => ScaleInput<AxisScale>;
  dependentAccessor: (d: Datum) => ScaleInput<AxisScale>;
  colorAccessor?: (d: Datum, dataKey: string) => string;
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  // barProps?: PolygonProps | ((datum: Datum, index: number, dataKey: string) => PolygonProps);
  // lineProps?: LineProps | ((datum: Datum, index: number, dataKey: string) => LineProps);
  enableEvents?: boolean;
  component?: (props: SVGBarProps<Datum>) => JSX.Element;
  categoryA11yProps?: SVGAccessibleBarSeriesProps<
    ScaleInput<AxisScale>,
    ScaleInput<AxisScale>,
    Datum
  >['categoryA11yProps'];
};

export function SVGBarSeries<Datum extends object>({
  groupProps,
  springConfig,
  animate = true,
  dataKey,
  enableEvents = true,
  component: BarComponent = SVGSimpleBar,
  categoryA11yProps
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
    margin,
    innerWidth,
    innerHeight
  } = useDataContext();
  const dataEntry = dataEntries.find((dataEntry) => dataEntry.dataKey === dataKey);
  if (!dataEntry) {
    throw new Error(`Could not find data for dataKey '${dataKey}'`);
  }
  const { independentAccessor, dependentAccessor, data, keyAccessor, colorAccessor } = dataEntry;
  const ownEventSourceKey = `${BARSERIES_EVENT_SOURCE}-${dataKey}`;
  // const eventEmitters =
  useSeriesEvents<AxisScale, AxisScale, Datum>({
    dataKey,
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
    springConfig: springConfig ?? contextSpringConfig,
    animate: animate && contextAnimate,
    renderingOffset
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
      </g>
      {categoryA11yProps && (
        <SVGAccessibleBarSeries
          independentScale={independentScale}
          horizontal={horizontal}
          margin={margin}
          innerWidth={innerWidth}
          innerHeight={innerHeight}
          dataKeys={[dataKey]}
          dataEntries={dataEntries}
          categoryA11yProps={categoryA11yProps}
        />
      )}
    </>
  );
}
