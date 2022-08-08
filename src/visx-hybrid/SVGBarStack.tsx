import { ReactNode, useCallback, useMemo } from 'react';
import { animated, SpringConfig } from 'react-spring';
import { isNil } from 'lodash-es';

import { BARSTACK_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from './constants';
import findNearestStackDatum from './findNearestStackDatum';
import { getChildrenAndGrandchildrenWithProps } from './getChildrenAndGrandchildrenWithProps';
import { STACK_OFFSETS } from './stackOffset';
import { STACK_ORDERS } from './stackOrder';
import { SVGBarSeriesProps } from './SVGBarSeries';
import { SVGBarStackSeries } from './SVGBarStackSeries';
import type {
  AxisScale,
  DataEntry,
  NearestDatumArgs,
  NearestDatumReturnType,
  ScaleInput,
  StackDatum,
  SVGBarProps
} from './types';
import { useDataContext } from './useDataContext';
import { useSeriesEvents } from './useSeriesEvents';
import { useSeriesTransitions } from './useSeriesTransitions';

// import { ScaleInput } from '@/visx-next/scale';
// import { PositionScale } from '@/visx-next/types';

export interface SVGBarStackProps<Datum extends object> {
  // <
  //   IndependentScale extends PositionScale,
  //   DependentScale extends PositionScale,
  //   Datum extends object
  // >
  /** Sets the stack offset to the pre-defined d3 offset, see https://github.com/d3/d3-shape#stack_offset. */
  stackOffset?: keyof typeof STACK_OFFSETS;
  /** Sets the stack order to the pre-defined d3 function, see https://github.com/d3/d3-shape#stack_order. */
  stackOrder?: keyof typeof STACK_ORDERS;

  animate?: boolean;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;
  /** Required data key for the Series. Must be unique across all series. */
  //   dataKey: string;
  //   data: readonly Datum[];
  //   keyAccessor: (d: Datum, dataKey?: string) => string;
  //   independentAccessor: (d: Datum) => ScaleInput<IndependentScale>;
  //   dependentAccessor: (d: Datum) => ScaleInput<DependentScale>;
  //   colorAccessor?: (d: Datum, dataKey: string) => string;
  enableEvents?: boolean;
  children?: ReactNode;
  component?: (props: SVGBarProps<Datum>) => JSX.Element;
  colorAccessor?: (datum: Datum, key: string) => string;
  /** Must be a stable function. */
  labelFormatter?: (value: ScaleInput<AxisScale>) => string;
}

export function SVGBarStack<Datum extends object>(
  // <
  //   IndependentScale extends PositionScale,
  //   DependentScale extends PositionScale,
  //   Datum extends object
  // >
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  {
    children,
    enableEvents = true,
    animate = true,
    springConfig,
    colorAccessor,
    component,
    labelFormatter
  }: SVGBarStackProps<Datum>
) {
  const {
    horizontal,
    independentScale,
    dependentScale,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntries,
    colorScale,
    theme
  } = useDataContext();

  const seriesChildren = useMemo(
    () => getChildrenAndGrandchildrenWithProps<SVGBarSeriesProps<Datum>>(children),
    [children]
  );

  const dataKeys = seriesChildren.map((child) => child.props.dataKey).filter((key) => key);

  // custom logic to find the nearest AreaStackDatum (context) and return the original Datum (props)
  const findNearestDatum = useCallback(
    (params: NearestDatumArgs<StackDatum<AxisScale, AxisScale, Datum>>): NearestDatumReturnType<Datum> => {
      const childData = seriesChildren.find((child) => child.props.dataKey === params.dataKey)?.props?.data;
      return childData ? findNearestStackDatum(params, childData, horizontal) : null;
    },
    [seriesChildren, horizontal]
  );

  const ownEventSourceKey = `${BARSTACK_EVENT_SOURCE}-${dataKeys.join('-')}`;

  // TODO fix the any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /* const eventEmitters = */ useSeriesEvents<AxisScale, AxisScale, any>({
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

  const transitions = useSeriesTransitions(
    dataKeys
      .map(
        (dataKey) =>
          dataEntries.find((dataEntry) => dataEntry.dataKey === dataKey) as DataEntry<AxisScale, AxisScale> // TODO find alternative to this cast.
      )
      .filter((dataEntry) => !isNil(dataEntry)),
    springConfig ?? contextSpringConfig,
    animate && contextAnimate
  );

  return (
    <>
      {transitions((styles, datum) => {
        const child = seriesChildren.find((child) => child.props.dataKey === datum.dataKey);
        const { groupProps } = child?.props ?? {};
        const { style, ...restGroupProps } = groupProps ?? {};
        return (
          <animated.g
            data-testid={`bar-stack-series-${datum.dataKey}`}
            style={{ ...style, ...styles }}
            {...restGroupProps}
          >
            <SVGBarStackSeries
              dataKey={datum.dataKey}
              data={datum.data}
              keyAccessor={datum.underlying.keyAccessor}
              independentScale={independentScale}
              dependentScale={dependentScale}
              independentAccessor={datum.independentAccessor}
              dependentAccessor={datum.dependentAccessor}
              horizontal={horizontal}
              renderingOffset={renderingOffset}
              animate={animate && contextAnimate}
              springConfig={springConfig ?? contextSpringConfig}
              colorAccessor={colorAccessor ?? datum.underlying.colorAccessor}
              colorScale={colorScale}
              underlyingDatumAccessor={datum.underlyingDatumAccessor}
              underlyingDependentAccessor={datum.underlying.dependentAccessor}
              // {...events}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              component={component as any} // TODO fix this
              labelFormatter={labelFormatter}
              theme={theme}
            />
          </animated.g>
        );
      })}
      {/* {transitions((styles, datum) => {
        const child = seriesChildren.find((child) => child.props.dataKey === datum.dataKey);
        const { dependentAccessor } = child?.props ?? {};
        if (!dependentAccessor) {
          return null;
        }
        // const { style, ...restGroupProps } = groupProps ?? {};
        return (
          <animated.g data-testid={`bar-stack-series-labels-${datum.dataKey}`} style={styles}>
            <SVGBarStackLabels
              dataKey={datum.dataKey}
              data={datum.data}
              independentScale={independentScale}
              dependentScale={dependentScale}
              keyAccessor={datum.underlying.keyAccessor}
              horizontal={horizontal}
              renderingOffset={renderingOffset}
              animate={animate && contextAnimate}
              springConfig={springConfig ?? contextSpringConfig}
              dependentAccessor={dependentAccessor}
              underlyingDatumAccessor={datum.underlyingDatumAccessor}
            />
          </animated.g>
        );
      })} */}
    </>
  );
}
