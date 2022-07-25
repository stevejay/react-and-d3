import { ReactNode } from 'react';
import { SpringConfig } from 'react-spring';

import { STACK_OFFSETS } from '@/visx-next/stackOffset';
import { STACK_ORDERS } from '@/visx-next/stackOrder';

// import { ScaleInput } from '@/visx-next/scale';
// import { PositionScale } from '@/visx-next/types';

export interface SVGBarStackProps {
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
  children?: ReactNode;
}

export function SVGBarStack(
  // <
  //   IndependentScale extends PositionScale,
  //   DependentScale extends PositionScale,
  //   Datum extends object
  // >
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { children, animate = true }: SVGBarStackProps
) {
  return <>{children}</>;
}
