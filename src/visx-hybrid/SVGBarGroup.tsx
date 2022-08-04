import { ReactNode, useMemo } from 'react';
import { animated, SpringConfig } from 'react-spring';
import { scaleBand } from '@visx/scale';
import { isNil } from 'lodash-es';

import { getChildrenAndGrandchildrenWithProps } from './getChildrenAndGrandchildrenWithProps';
import { getScaleBandwidth } from './getScaleBandwidth';
import { SVGBarGroupSeries } from './SVGBarGroupSeries';
import { SVGBarSeriesProps } from './SVGBarSeries';
import type { AxisScale, DataEntry, SVGBarProps } from './types';
import { useDataContext } from './useDataContext';
import { useSeriesTransitions } from './useSeriesTransitions';

type SVGBarGroupProps<Datum extends object> = {
  springConfig?: SpringConfig;
  animate?: boolean;
  /** Comparator function to sort `dataKeys` within a bar group. By default the DOM rendering order of `BarGroup`s `children` is used. Must be a stable function. */
  sortBars?: (dataKeyA: string, dataKeyB: string) => number;
  children?: ReactNode;
  /** Group band scale padding, [0, 1] where 0 = no padding, 1 = no bar. */
  padding?: number;
  /** Optional color accessor that overrides any color accessor on the group's children. */
  colorAccessor?: (datum: Datum, dataKey: string) => string;
  component?: (props: SVGBarProps<Datum>) => JSX.Element;
};

export function SVGBarGroup<Datum extends object>({
  children,
  padding = 0.1,
  springConfig,
  animate = true,
  sortBars,
  colorAccessor,
  component
}: SVGBarGroupProps<Datum>) {
  const {
    horizontal,
    independentScale,
    dependentScale,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntries,
    colorScale
  } = useDataContext();

  const barSeriesChildren = useMemo(
    () => getChildrenAndGrandchildrenWithProps<SVGBarSeriesProps<Datum>>(children),
    [children]
  );
  const dataKeys = barSeriesChildren.map((child) => child.props.dataKey).filter((key) => key);

  // create group scale
  const groupScale = useMemo(
    () =>
      scaleBand<string>({
        domain: sortBars ? [...dataKeys].sort(sortBars) : dataKeys,
        range: [0, getScaleBandwidth(independentScale)],
        padding
      }),
    [sortBars, dataKeys, independentScale, padding]
  );

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
        const child = barSeriesChildren.find((child) => child.props.dataKey === datum.dataKey);
        const { groupProps, dataKey } = child?.props ?? {};
        const { style, ...restGroupProps } = groupProps ?? {};
        return (
          <animated.g
            data-testid={`bar-series-${dataKey}`}
            style={{ ...style, ...styles }}
            {...restGroupProps}
          >
            <SVGBarGroupSeries
              dataKey={datum.dataKey}
              data={datum.data}
              dataKeys={dataKeys}
              independentScale={independentScale}
              dependentScale={dependentScale}
              groupScale={groupScale}
              keyAccessor={datum.underlying.keyAccessor}
              independentAccessor={datum.independentAccessor}
              dependentAccessor={datum.dependentAccessor}
              horizontal={horizontal}
              renderingOffset={renderingOffset}
              animate={animate && contextAnimate}
              springConfig={springConfig ?? contextSpringConfig}
              colorAccessor={colorAccessor ?? datum.underlying.colorAccessor}
              colorScale={colorScale}
              // {...events}
              component={component}
            />
          </animated.g>
        );
      })}
      {/* {categoryA11yProps && (
        <SVGAccessibleBarSeries
          independentScale={independentScale}
          horizontal={horizontal}
          margin={margin}
          innerWidth={innerWidth}
          innerHeight={innerHeight}
          dataKeyOrKeys={groupScale.domain()}
          dataEntries={dataEntries}
          categoryA11yProps={categoryA11yProps}
        />
      )} */}
    </>
  );
}
