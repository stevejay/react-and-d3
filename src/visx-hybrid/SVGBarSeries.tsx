import { ReactNode, SVGProps } from 'react';
import { SpringConfig } from 'react-spring';
import { Group } from '@visx/group';

// import { isNil } from 'lodash-es';
import { ScaleInput } from '@/visx-next/scale';
import { AxisScale } from '@/visx-next/types';

import { InferDataContext } from './DataContext';
import { useDataContext } from './useDataContext';

// export interface SVGBarSeriesProps<
//   IndependentScale extends PositionScale,
//   DependentScale extends PositionScale,
//   Datum extends object
// > {
//   /** Required data key for the Series. Must be unique across all series. */
//   dataKey: string;
//   data: readonly Datum[];
//   keyAccessor: (d: Datum, dataKey?: string) => string;
//   independentAccessor: (d: Datum) => ScaleInput<IndependentScale>;
//   dependentAccessor: (d: Datum) => ScaleInput<DependentScale>;
//   colorAccessor?: (d: Datum, dataKey: string) => string;

//   animate?: boolean;
//   springConfig?: SpringConfig;
//   renderingOffset?: number;
//   /** Props to apply to the <g> element containing the series. */
//   groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
//   barProps?:
//     | Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref'>
//     | ((
//         datum: Datum,
//         index: number,
//         dataKey: string
//       ) => Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref'>);
// }

// export function OldSVGBarSeries<
//   IndependentScale extends PositionScale,
//   DependentScale extends PositionScale,
//   Datum extends object
// >(props: SVGBarSeriesProps<IndependentScale, DependentScale, Datum>) {
//   const { dataKey, springConfig, animate = true, renderingOffset = 0, groupProps, barProps } = props;
//   const {
//     independentScale,
//     dependentScale,
//     horizontal,
//     springConfig: contextSpringConfig,
//     animate: contextAnimate,
//     dataEntries
//   } = useDataContext();

//   const dataEntry = dataEntries.find((x) => x.dataKey === dataKey);
//   if (!dataEntry) {
//     throw new Error(`Could not find data for dataKey '${dataKey}'`);
//   }

//   const { data, keyAccessor, independentAccessor, dependentAccessor, colorAccessor } = dataEntry as DataEntry<
//     IndependentScale,
//     DependentScale,
//     Datum,
//     Datum
//   >;

//   const transitions = useBarSeriesTransitions(
//     data,
//     horizontal ? dependentScale : independentScale,
//     horizontal ? independentScale : dependentScale,
//     keyAccessor,
//     horizontal ? dependentAccessor : independentAccessor,
//     horizontal ? independentAccessor : dependentAccessor,
//     horizontal,
//     springConfig ?? contextSpringConfig,
//     animate ?? contextAnimate,
//     renderingOffset
//   );

//   return (
//     <Group data-test-id="bar-series" {...groupProps}>
//       {transitions(({ opacity, x, y, width, height }, datum, _, index) => {
//         const { style, ...restBarProps } =
//           typeof barProps === 'function' ? barProps(datum, index, dataKey) : barProps;
//         return (
//           <animated.rect
//             data-test-id="bar"
//             x={x}
//             y={y}
//             width={width}
//             height={height}
//             fill={colorAccessor?.(datum, dataKey) ?? restBarProps.fill}
//             style={{ ...style, opacity }}
//             shapeRendering="crispEdges" // {shapeRendering}
//             // className={barClassName}
//             {...restBarProps}
//             // {...eventEmitters}
//           />
//         );
//       })}
//     </Group>
//   );
// }

type BarSeriesRendererCoreProps<Datum extends object> = {
  context: Required<InferDataContext>;
  // variableType: 'independent' | 'dependent';
  springConfig?: SpringConfig;
  animate?: boolean;
  // hideZero?: boolean;
  // tickCount?: number;
  // tickValues?: ScaleInput<AxisScale>[];
  dataKey: string;
  data: readonly Datum[];
  keyAccessor: (d: Datum, dataKey?: string) => string;
  independentAccessor: (d: Datum) => ScaleInput<AxisScale>;
  dependentAccessor: (d: Datum) => ScaleInput<AxisScale>;
  colorAccessor?: (d: Datum, dataKey: string) => string;
};

export type BarSeriesRendererProps<
  ElementProps extends object,
  Datum extends object
> = BarSeriesRendererCoreProps<Datum> & Omit<ElementProps, keyof BarSeriesRendererCoreProps<Datum>>;

export type BarSeriesRenderer<ElementProps extends object, Datum extends object> = (
  props: BarSeriesRendererProps<ElementProps, Datum>
) => ReactNode;

export type SVGBarSeriesProps<ElementProps extends object, Datum extends object> = Omit<
  BarSeriesRendererProps<ElementProps, Datum>,
  'context'
> & {
  renderer: BarSeriesRenderer<ElementProps, Datum>;
  groupProps?: SVGProps<SVGGElement>;
};

export function SVGBarSeries<ElementProps extends object, Datum extends object>(
  props: SVGBarSeriesProps<ElementProps, Datum>
) {
  const { renderer, groupProps, springConfig, animate, ...rendererProps } = props;
  const context = useDataContext();
  // if (isNil(context?.independentScale) || isNil(context?.dependentScale)) {
  //   return null;
  // }
  return (
    <Group data-test-id={`bar-series-${props.dataKey}`} {...groupProps}>
      {renderer({
        context,
        springConfig: springConfig ?? context.springConfig,
        animate: animate ?? context.animate,
        ...rendererProps
      } as BarSeriesRendererProps<ElementProps, Datum>)}
    </Group>
  );
}
