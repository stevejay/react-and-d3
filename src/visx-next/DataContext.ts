import { createContext } from 'react';
import { AxisScale } from '@visx/axis';

import { DataContextType } from './types';

type AnyDataContext = DataContextType<AxisScale, AxisScale, any, any>;

/** Utilities for inferring context generics */
export type InferXScaleConfig<X extends AnyDataContext> = X extends DataContextType<infer T, any, any, any>
  ? T
  : AxisScale;

export type InferYScaleConfig<X extends AnyDataContext> = X extends DataContextType<any, infer T, any, any>
  ? T
  : AxisScale;

export type InferDatum<X extends AnyDataContext> = X extends DataContextType<any, any, infer T, any>
  ? T
  : any;

export type InferOriginalDatum<X extends AnyDataContext> = X extends DataContextType<any, any, any, infer T>
  ? T
  : any;

export type InferDataContext<C extends AnyDataContext = AnyDataContext> = DataContextType<
  InferXScaleConfig<C>,
  InferYScaleConfig<C>,
  InferDatum<C>,
  InferOriginalDatum<C>
>;

export const DataContext = createContext<Partial<InferDataContext>>({});
