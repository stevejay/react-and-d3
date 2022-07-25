import { ReactNode } from 'react';
import { SpringConfig } from 'react-spring';

// import { ScaleInput } from '@/visx-next/scale';
// import { PositionScale } from '@/visx-next/types';

export interface SVGBarGroupProps {
  // <
  //   IndependentScale extends PositionScale,
  //   DependentScale extends PositionScale,
  //   Datum extends object
  // >
  /** Group band scale padding, [0, 1] where 0 = no padding, 1 = no bar. */
  padding?: number;
  /** Comparator function to sort `dataKeys` within a bar group. By default the DOM rendering order of `BarGroup`s `children` is used. Must be stable. */
  sortBars?: (dataKeyA: string, dataKeyB: string) => number;
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

export function SVGBarGroup(
  // <
  //   IndependentScale extends PositionScale,
  //   DependentScale extends PositionScale,
  //   Datum extends object
  // >
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { children, animate = true, padding = 0.1 }: SVGBarGroupProps
) {
  return <>{children}</>;
}
