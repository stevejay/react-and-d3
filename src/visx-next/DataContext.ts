import { createContext } from 'react';
import { AxisScale } from '@visx/axis';

import { DataContextType } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDataContext = DataContextType<AxisScale, AxisScale, any, any>;

/** Utilities for inferring context generics */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferXScaleConfig<X extends AnyDataContext> = X extends DataContextType<infer T, any, any, any>
  ? T
  : AxisScale;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferYScaleConfig<X extends AnyDataContext> = X extends DataContextType<any, infer T, any, any>
  ? T
  : AxisScale;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferDatum<X extends AnyDataContext> = X extends DataContextType<any, any, infer T, any>
  ? T
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferOriginalDatum<X extends AnyDataContext> = X extends DataContextType<any, any, any, infer T>
  ? T
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any;

export type InferDataContext<C extends AnyDataContext = AnyDataContext> = DataContextType<
  InferXScaleConfig<C>,
  InferYScaleConfig<C>,
  InferDatum<C>,
  InferOriginalDatum<C>
>;

export const DataContext = createContext<Partial<InferDataContext>>({});
