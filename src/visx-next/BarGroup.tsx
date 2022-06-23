import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  SVGProps,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { animated, SpringConfig } from 'react-spring';
import { scaleBand, ScaleInput } from '@visx/scale';
import { ScaleBand, ScaleOrdinal } from 'd3-scale';
import { isEmpty, isEqual } from 'lodash-es';

import { getChildrenAndGrandchildrenWithProps } from './types/typeguards/isChildWithProps';
import { useBarGroupTransitions, useSeriesTransitions } from './animation';
import { BarSeriesProps } from './BarSeries';
import { DataContext } from './DataContext';
import { DataRegistry } from './DataRegistry';
import { getScaleBandwidth } from './scale';
import { DataContextType, PositionScale } from './types';

export declare enum TransitionPhase {
  /** This transition is being mounted */
  MOUNT = 'mount',
  /** This transition is entering or has entered */
  ENTER = 'enter',
  /** This transition had its animations updated */
  UPDATE = 'update',
  /** This transition will expire after animating */
  LEAVE = 'leave'
}

type BarGroupSeriesProps<XScale extends PositionScale, YScale extends PositionScale, Datum extends object> = {
  dataKey: string;
  data: readonly Datum[];
  dataKeys: readonly string[];
  xScale: XScale;
  yScale: YScale;
  groupScale: ScaleBand<string>;
  xAccessor: (datum: Datum) => ScaleInput<XScale>;
  yAccessor: (datum: Datum) => ScaleInput<YScale>;
  horizontal: boolean;
  renderingOffset?: number;
  animate: boolean;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;
  colorAccessor?: (d: Datum, key: string) => string;
  colorScale?: ScaleOrdinal<string, string, never>;
  barClassName?: string;
  barProps?:
    | Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref'>
    | ((
        datum: Datum,
        index: number,
        dataKey: string
      ) => Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref'>);
};

function BarGroupSeries<XScale extends PositionScale, YScale extends PositionScale, Datum extends object>({
  dataKey,
  data,
  dataKeys,
  xScale,
  yScale,
  groupScale,
  xAccessor,
  yAccessor,
  horizontal,
  renderingOffset,
  springConfig,
  animate,
  colorAccessor,
  colorScale,
  barClassName = '',
  barProps = {}
}: BarGroupSeriesProps<XScale, YScale, Datum>) {
  const transitions = useBarGroupTransitions(
    data,
    xScale,
    yScale,
    groupScale,
    xAccessor,
    yAccessor,
    dataKey,
    dataKeys,
    horizontal,
    springConfig,
    animate,
    renderingOffset
  );
  return (
    <>
      {transitions(({ opacity, x, y, width, height }, datum, _, index) => {
        const { style, ...restBarProps } =
          typeof barProps === 'function' ? barProps(datum, index, dataKey) : barProps;
        return (
          <animated.rect
            data-test-id="bar"
            x={x}
            y={y}
            width={width}
            height={height}
            fill={colorAccessor?.(datum, dataKey) ?? colorScale?.(dataKey) ?? 'gray'}
            style={{ ...style, opacity }}
            className={barClassName}
            {...restBarProps}
          />
        );
      })}
    </>
  );
}

function XYChartBarGroupSeries<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>({
  dataKeys,
  dataRegistry,
  barSeriesChildren,
  xScale,
  yScale,
  groupScale,
  colorScale,
  horizontal,
  springConfig,
  animate
}: {
  dataKeys: string[];
  dataRegistry: Omit<DataRegistry<XScale, YScale, Datum, Datum>, 'registry' | 'registryKeys'>;
  barSeriesChildren: ReactElement<
    BarSeriesProps<XScale, YScale, Datum>,
    string | JSXElementConstructor<any>
  >[];
  xScale: XScale;
  yScale: YScale;
  groupScale: ScaleBand<string>;
  horizontal: boolean;
  animate: boolean;
  springConfig: SpringConfig;
  colorScale?: ScaleOrdinal<string, string, never>;
}) {
  const transitions = useSeriesTransitions(
    dataKeys.map((dataKey) => dataRegistry.get(dataKey)),
    springConfig,
    animate
  );
  return (
    <>
      {transitions((styles, datum) => {
        const child = barSeriesChildren.find((child) => child.props.dataKey === datum.key);
        const { groupProps, groupClassName, renderingOffset, barProps, barClassName } = child?.props ?? {};
        const { style, ...restGroupProps } = groupProps ?? {};
        return (
          <animated.g
            data-test-id="bar-series"
            {...restGroupProps}
            className={groupClassName}
            style={{ ...style, ...styles }}
          >
            <BarGroupSeries
              dataKey={datum.key}
              data={datum.data}
              dataKeys={dataKeys}
              xScale={xScale}
              yScale={yScale}
              groupScale={groupScale}
              xAccessor={datum.xAccessor}
              yAccessor={datum.yAccessor}
              horizontal={horizontal ?? false}
              renderingOffset={renderingOffset}
              animate={animate}
              springConfig={springConfig}
              colorAccessor={datum.colorAccessor}
              colorScale={colorScale}
              barProps={barProps}
              barClassName={barClassName}
            />
          </animated.g>
        );
      })}
    </>
  );
}

export type XYChartBarGroupProps<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
> = {
  /** `BarSeries` elements */
  children: ReactNode;
  /** Group band scale padding, [0, 1] where 0 = no padding, 1 = no bar. */
  padding?: number;
  /** Comparator function to sort `dataKeys` within a bar group. By default the DOM rendering order of `BarGroup`s `children` is used. Must be stable. */
  sortBars?: (dataKeyA: string, dataKeyB: string) => number;
  animate?: boolean;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;
};
// & Pick<
//   SeriesProps<XScale, YScale, Datum>,
//   'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus' | 'enableEvents'
// >;

export function XYChartBarGroup<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>({
  children,
  padding = 0.1,
  springConfig,
  animate = true,
  sortBars
}: XYChartBarGroupProps<XScale, YScale, Datum>) {
  const [groupKeys, setGroupKeys] = useState<string[]>([]);

  const {
    dataRegistry,
    horizontal,
    registerData,
    unregisterData,
    xScale,
    yScale,
    colorScale,
    springConfig: fallbackSpringConfig
  } = useContext(DataContext) as unknown as DataContextType<XScale, YScale, Datum, Datum>;

  const barSeriesChildren = useMemo(
    () => getChildrenAndGrandchildrenWithProps<BarSeriesProps<XScale, YScale, Datum>>(children),
    [children]
  );

  useEffect(() => {
    const dataKeys = barSeriesChildren.map((child) => child.props.dataKey).filter((key) => key);
    setGroupKeys((prev) => (isEqual(prev, dataKeys) ? prev : dataKeys));
    const dataToRegister = barSeriesChildren.map((child) => {
      const { dataKey: key, data, xAccessor, yAccessor, colorAccessor } = child.props;
      return { key, data, xAccessor, yAccessor, colorAccessor };
    });
    registerData?.(dataToRegister);
    return () => unregisterData?.(dataKeys);
  }, [registerData, unregisterData, barSeriesChildren]);

  // create group scale
  const groupScale = useMemo(
    () =>
      scaleBand<string>({
        domain: sortBars ? [...groupKeys].sort(sortBars) : groupKeys,
        range: [0, getScaleBandwidth(horizontal ? yScale : xScale)],
        padding
      }),
    [sortBars, groupKeys, xScale, yScale, horizontal, padding]
  );

  // If scales and data are not available in the registry, or there are no registered keys
  // for the group, then bail.
  if (!xScale || !yScale || !colorScale || isEmpty(groupKeys)) {
    return null;
  }

  return (
    <XYChartBarGroupSeries
      dataKeys={groupKeys}
      dataRegistry={dataRegistry}
      barSeriesChildren={barSeriesChildren}
      xScale={xScale}
      yScale={yScale}
      groupScale={groupScale}
      colorScale={colorScale}
      horizontal={horizontal}
      springConfig={springConfig ?? fallbackSpringConfig}
      animate={animate}
    />
  );
}
