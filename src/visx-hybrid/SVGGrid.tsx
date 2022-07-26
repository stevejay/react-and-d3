import { ReactNode, SVGProps } from 'react';
import { SpringConfig } from 'react-spring';
import { Group } from '@visx/group';
import { ScaleInput } from '@visx/scale';

// import { isNil } from 'lodash-es';
import { AxisScale } from '@/visx-next/types';

import { InferDataContext } from './DataContext';
import { useDataContext } from './useDataContext';

type GridRendererCoreProps = {
  context: Required<InferDataContext>;
  // scale: AxisScale;
  // horizontal: boolean;
  variableType: 'independent' | 'dependent';
  // innerWidth: number;
  // innerHeight: number;
  // independentRangePadding: number;
  // dependentRangePadding: number;
  springConfig?: SpringConfig;
  animate?: boolean;
  // renderingOffset?: number;
  hideZero?: boolean;
  tickCount?: number;
  tickValues?: ScaleInput<AxisScale>[];
  // elementProps?: ElementProps;
}; // & Omit<ElementProps, 'ref'>;

export type GridRendererProps<ElementProps extends object> = GridRendererCoreProps &
  Omit<ElementProps, keyof GridRendererCoreProps>;

export type GridRenderer<ElementProps extends object> = (props: GridRendererProps<ElementProps>) => ReactNode;

export type SVGGridProps<ElementProps extends object> = Omit<
  GridRendererProps<ElementProps>,
  'context'
  // | 'scale'
  // | 'horizontal'
  // | 'innerWidth'
  // | 'innerHeight'
  // | 'margin'
  // | 'independentRangePadding'
  // | 'dependentRangePadding'
> & {
  renderer: GridRenderer<ElementProps>;
  groupProps?: SVGProps<SVGGElement>;
  // springConfig?: SpringConfig;
  // animate?: boolean;
};

export function SVGGrid<ElementProps extends object>(props: SVGGridProps<ElementProps>) {
  const { variableType, renderer, groupProps, springConfig, animate, ...rendererProps } = props;
  const context = useDataContext();

  // const {
  //   independentScale,
  //   dependentScale,
  //   independentRangePadding,
  //   dependentRangePadding,
  //   horizontal,
  //   margin,
  //   innerWidth,
  //   innerHeight,
  //   springConfig,
  //   animate
  // } = useDataContext();

  // if (isNil(context.independentScale || isNil(context.dependentScale))) {
  //   return null;
  // }

  // const scale = variableType === 'independent' ? independentScale : dependentScale;
  // if (!scale) {
  //   return null;
  // }

  const isRows =
    (variableType === 'independent' && context.horizontal) ||
    (variableType === 'dependent' && !context.horizontal);
  const left = isRows ? context.margin?.left ?? 0 : 0;
  const top = isRows ? 0 : context.margin?.top;

  // variableType === 'independent'
  //   ? horizontal
  //     ? margin?.left ?? 0
  //     : 0
  //   : horizontal
  //   ? 0
  //   : margin?.left ?? 0;

  // const top =
  //   variableType === 'independent' ? (horizontal ? 0 : margin?.top ?? 0) : horizontal ? margin?.top ?? 0 : 0;

  // if (isNil(context?.independentScale) || isNil(context?.dependentScale)) {
  //   return null;
  // }

  return (
    <Group data-test-id={`grid-${variableType}`} {...groupProps} left={left} top={top}>
      {renderer({
        context,
        // scale,
        // horizontal,
        // innerWidth,
        // innerHeight,
        // independentRangePadding,
        // dependentRangePadding,
        // springConfig,
        // animate,
        variableType,
        // renderingOffset,
        springConfig: springConfig ?? context.springConfig,
        animate: animate ?? context.animate,
        ...rendererProps
      } as GridRendererProps<ElementProps>)}
    </Group>
  );
}
