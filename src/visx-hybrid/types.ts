import { SpringConfig } from 'react-spring';

import { ScaleInput } from '@/visx-next/scale';
import { AxisScale, Margin } from '@/visx-next/types';

export interface DataEntry<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Datum = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  OriginalDatum = any
> {
  dataKey: string;
  data: readonly Datum[];
  /** function that returns the key value of a datum. Defaults to xAccessor or yAccessor, depending on the orientation of the chart. */
  keyAccessor: (d: OriginalDatum, dataKey?: string) => string;
  independentAccessor: (d: Datum) => ScaleInput<IndependentScale>;
  dependentAccessor: (d: Datum) => ScaleInput<DependentScale>;
  /** function that returns the color value of a datum. */
  colorAccessor?: (d: OriginalDatum, dataKey: string) => string;

  /** Legend shape for the data key. */
  // legendShape?: LegendShape;
}

export interface DataContextType<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale
  // Datum extends object,
  // OriginalDatum extends object
> {
  independentScale: IndependentScale;
  dependentScale: DependentScale;
  independentRangePadding: number;
  dependentRangePadding: number;
  // colorScale: ScaleTypeToD3Scale<string, string>['ordinal'];
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: Margin;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataEntries: readonly DataEntry<IndependentScale, DependentScale, any, any>[];
  // dataRegistry: Omit<DataRegistry<XScale, YScale, Datum, OriginalDatum>, 'registry' | 'registryKeys'>;
  // registerData: (
  //   data:
  //     | DataRegistryEntry<XScale, YScale, Datum, OriginalDatum>
  //     | DataRegistryEntry<XScale, YScale, Datum, OriginalDatum>[]
  // ) => void;
  // unregisterData: (keyOrKeys: string | string[]) => void;
  // setDimensions: (dims: { width: number; height: number; margin: Margin }) => void;
  horizontal: boolean;
  animate: boolean;
  /* A react-spring configuration object */
  springConfig: SpringConfig;
  renderingOffset: number;
}

export interface TickDatum {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any; // FIXME  ?? ScaleInput<Scale> where <Scale extends GridScale> ???
  index: number;
  label: string;
}

export type GridType = 'row' | 'column';

/** Arguments for findNearestDatum* functions. */
export type NearestDatumArgs<Datum extends object> = {
  dataKey: string;
  point: { x: number; y: number } | null;
  independentAccessor: (d: Datum) => ScaleInput<AxisScale>;
  dependentAccessor: (d: Datum) => ScaleInput<AxisScale>;
  data: readonly Datum[];
  width: number;
  height: number;
  independentScale: AxisScale;
  dependentScale: AxisScale;
};
