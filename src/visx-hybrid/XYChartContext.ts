import { createContext } from 'react';

import type { XYChartContextType } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyDataContext = DataContextType<AxisScale, AxisScale>;

// /** Utilities for inferring context generics */
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export type InferXScaleConfig<X extends AnyDataContext> = X extends DataContextType<infer T, any>
//   ? T
//   : AxisScale;

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export type InferYScaleConfig<X extends AnyDataContext> = X extends DataContextType<any, infer T>
//   ? T
//   : AxisScale;

// export type InferDataContext<C extends AnyDataContext = AnyDataContext> = DataContextType<
//   InferXScaleConfig<C>,
//   InferYScaleConfig<C>
// >;

export const XYChartContext = createContext<XYChartContextType | null>(null);
