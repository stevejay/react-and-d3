import { ReactNode, useCallback, useMemo } from 'react';
import { animated, SpringConfig } from 'react-spring';
import { isNil } from 'lodash-es';

import { BARSTACK_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from './constants';
import findNearestStackDatum from './findNearestStackDatum';
import { getChildrenAndGrandchildrenWithProps } from './getChildrenAndGrandchildrenWithProps';
import { getStackOriginalDatum } from './getStackOriginalDatum';
import { STACK_OFFSETS } from './stackOffset';
import { STACK_ORDERS } from './stackOrder';
import { SVGAccessibleBarSeries, SVGAccessibleBarSeriesProps } from './SVGAccessibleBarSeries';
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
  colorAccessor?: (d: StackDatum<AxisScale, AxisScale, Datum>, key: string) => string;
  categoryA11yProps?: SVGAccessibleBarSeriesProps<
    ScaleInput<AxisScale>,
    ScaleInput<AxisScale>,
    Datum
  >['categoryA11yProps'];
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
    categoryA11yProps
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
    margin,
    innerWidth,
    innerHeight
  } = useDataContext();

  const seriesChildren = useMemo(
    () => getChildrenAndGrandchildrenWithProps<SVGBarSeriesProps<Datum>>(children),
    [children]
  );

  const dataKeys = seriesChildren.map((child) => child.props.dataKey).filter((key) => key);

  // custom logic to find the nearest AreaStackDatum (context) and return the original Datum (props)
  const findNearestDatum = useCallback(
    (params: NearestDatumArgs<StackDatum<AxisScale, AxisScale, Datum>>): NearestDatumReturnType<Datum> => {
      // const childProps = seriesChildren.find((child) => child.props.dataKey === params.dataKey)?.props;
      // if (!childProps) {
      //   return null;
      // }
      // const { data: childData, xAccessor, yAccessor } = childProps;
      // const datum = findNearestStackDatum(params, childData, horizontal);
      // return datum ? ({ ...datum, xAccessor, yAccessor } as any) : null;

      const childData = seriesChildren.find((child) => child.props.dataKey === params.dataKey)?.props?.data;
      return childData ? findNearestStackDatum(params, childData, horizontal) : null;
    },
    [seriesChildren, horizontal]
  );

  const ownEventSourceKey = `${BARSTACK_EVENT_SOURCE}-${dataKeys.join('-')}`;

  // TODO fix the any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /* const eventEmitters = */ useSeriesEvents<AxisScale, AxisScale, any>({
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
              dataKeys={dataKeys}
              independentScale={independentScale}
              dependentScale={dependentScale}
              keyAccessor={datum.keyAccessor}
              independentAccessor={datum.independentAccessor}
              dependentAccessor={datum.dependentAccessor}
              horizontal={horizontal}
              renderingOffset={renderingOffset}
              animate={animate && contextAnimate}
              springConfig={springConfig ?? contextSpringConfig}
              colorAccessor={colorAccessor ?? datum.colorAccessor}
              colorScale={colorScale}
              // barProps={barProps}
              // barClassName={barClassName}
              // {...events}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              component={component as any} // TODO fix this
            />
          </animated.g>
        );
      })}
      {categoryA11yProps && (
        <SVGAccessibleBarSeries
          independentScale={independentScale}
          horizontal={horizontal}
          margin={margin}
          innerWidth={innerWidth}
          innerHeight={innerHeight}
          dataKeys={dataKeys}
          dataEntries={dataEntries}
          categoryA11yProps={categoryA11yProps}
          datumAccessor={getStackOriginalDatum}
        />
      )}
    </>
  );
}
