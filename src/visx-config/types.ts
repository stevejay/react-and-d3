import { SVGProps } from 'react';
import { SpringConfig } from 'react-spring';

import { AnyD3Scale, ScaleConfig, ScaleConfigToD3Scale, ScaleInput } from '@/visx-next/scale';
import { AxisScale, AxisScaleOutput, LineProps, Margin, TextProps, TickFormatter } from '@/visx-next/types';

export interface DataSerie<
  IndependentScale extends AnyD3Scale,
  DependentScale extends AnyD3Scale,
  Datum extends object
> {
  dataKey: string;
  data: Datum[];
  label: string;
  independentAccessor: (d: Datum) => ScaleInput<IndependentScale>;
  dependentAccessor: (d: Datum) => ScaleInput<DependentScale>;
}

export interface AxisConfig {
  position: 'start' | 'end';
  /** If true, will hide the '0' value tick and tick label. */
  hideZero?: boolean;
  tickFormat?: TickFormatter<ScaleInput<AxisScale>>; // wrong
  tickCount?: number;
  tickValues?: ScaleInput<AxisScale>[]; // wrong

  /**  If true, will hide the axis line. */
  hideAxisLine?: boolean;
  /** If true, will hide the ticks (but not the tick labels). */
  hideTicks?: boolean;
  /** Props to apply to the <g> element that wraps the entire axis. */
  axisGroupProps?: Omit<SVGProps<SVGGElement>, 'ref' | 'left' | 'right'>; // & { className?: string };
  /** Props to apply to the <g> element that wraps each tick line and label. */
  tickGroupProps?: Omit<SVGProps<SVGGElement>, 'ref' | 'style'>; // TODO think about removing style.
  /** Padding between the tick lines and the tick labels. */
  tickLabelPadding?: number;
  /** The props to apply to the tick labels. */
  tickLabelProps?: Partial<TextProps>;
  /** The length of the tick lines. */
  tickLength?: number; // TODO minus value won't work properly
  /** The length of the outer ticks (added at the very start and very end of the axis domain). */
  outerTickLength?: number; // TODO minus value won't work properly
  /** Props to be applied to individual tick lines. */
  tickLineProps?: LineProps;
  /** The text for the axis label. */
  label?: string;
  /** Pixel offset of the axis label. */
  labelPadding?: number;
  /** Props to apply to the axis label. */
  labelProps?: Partial<TextProps>;
  /** Props to apply to the axis domain path. */
  domainPathProps?: Omit<SVGProps<SVGPathElement>, 'ref'>;

  /* A react-spring configuration object */
  springConfig?: SpringConfig;
  animate?: boolean;
}

export interface GridConfig {
  animate?: boolean;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;
  /**
   * Exact values used to generate grid lines using `scale`.
   * Overrides `tickCount` if specified.
   */
  tickValues?: ScaleInput<AxisScale>[];
  // /** The class name to apply to the grid group element. */
  // className?: string;
  // /** Grid line stroke color. */
  // stroke?: string;
  // /** Grid line stroke thickness. */
  // strokeWidth?: string | number;
  // /** Grid line stroke-dasharray attribute. */
  // strokeDasharray?: string;
  /** Approximate number of grid lines. Approximate due to d3 algorithm, specify `tickValues` for precise control. */
  tickCount?: number;
  groupProps?: SVGProps<SVGGElement>;
  /** Props to be applied to individual lines. */
  tickLineProps?: LineProps;
}

export interface SVGXYChartConfig<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IndependentScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DependentScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  Datum extends object
> {
  //   data: any;
  series: DataSerie<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ScaleConfigToD3Scale<IndependentScaleConfig, AxisScaleOutput, any, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ScaleConfigToD3Scale<DependentScaleConfig, AxisScaleOutput, any, any>,
    Datum
  >[];
  independentScale: IndependentScaleConfig;
  dependentScale: DependentScaleConfig;
  //   series: {
  //     barSeries: {
  //       label: string;
  //       dataKey: string;
  //       data: Datum[];
  //       independentAccessor: (
  //         d: Datum
  //       ) => ScaleInput<ScaleConfigToD3Scale<IndependentScaleConfig, AxisScaleOutput, any, any>>;
  //       dependentAccessor: (
  //         d: Datum
  //       ) => ScaleInput<ScaleConfigToD3Scale<DependentScaleConfig, AxisScaleOutput, any, any>>;
  //     };
  //   };
  independentAxis?: AxisConfig | false;
  dependentAxis?: AxisConfig | false;
  independentGrid?: GridConfig | false;
  dependentGrid?: GridConfig | false;
  horizontal?: boolean;
  margin: Margin;
  springConfig?: SpringConfig;
  animate?: boolean;
  independentRangePadding?: number;
  dependentRangePadding?: number;
  parentSizeDebounceMs?: number;
}

/*

data: {
  barStack
      series
          dataKey
          data
          independentAccessor
          dependentAccessor
      offset
  barGroup
      series
          dataKey
          data
          independentAccessor
          dependentAccessor
  
}
*/

export interface TickDatum {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any; // FIXME  ?? ScaleInput<Scale> where <Scale extends GridScale> ???
  index: number;
  label: string;
}
