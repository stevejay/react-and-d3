import { CSSProperties, FocusEvent, PointerEvent, ReactNode, Ref, SVGAttributes, SVGProps } from 'react';
import { SpringConfig } from 'react-spring';
import { AxisScale } from '@visx/axis';
import { D3Scale, NumberLike, ScaleInput, ScaleTypeToD3Scale } from '@visx/scale';
import { Series, SeriesPoint } from 'd3-shape';

import { DataRegistry } from '../DataRegistry'; // TODO there's a dep loop here.
import { STACK_OFFSETS } from '../stackOffset';
import { STACK_ORDERS } from '../stackOrder';
import type { UseTooltipParams } from '../useTooltip';

export type { AxisScale } from '@visx/axis';
export type { ScaleInput } from '@visx/scale';

export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export type Anchor = 'start' | 'middle' | 'end';
export type Angle = number;

// In order to plot values on an axis, the output of the scale must be a number
// or be number-like. Additionally, some scales return undefined.
export type GridScaleOutput = number | NumberLike | undefined;

/** A catch-all type for scales that returns number */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PositionScale = D3Scale<number, any, any>;

/** A catch-all type for scales that are compatible with grid */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GridScale<Output extends GridScaleOutput = GridScaleOutput> = D3Scale<Output, any, any>;

// export type GridLines = {
//   from: { x?: number; y?: number };
//   to: { x?: number; y?: number };
// }[];

export type CommonGridProps<Scale extends GridScale> = {
  scale: Scale;
  /**
   * Whether to animate the grid lines or not.
   * @default true
   */
  animate?: boolean;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;
  /**
   * Exact values used to generate grid lines using `scale`.
   * Overrides `tickCount` if specified.
   */
  tickValues?: ScaleInput<Scale>[];
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
  /** Pixel offset to apply as an X translation to each grid line. */
  offset?: number;

  groupProps?: SVGProps<SVGGElement>;
} & Omit<SVGProps<SVGLineElement>, 'scale' | 'ref'>;

export type LegendShape = 'rect' | 'line' | 'dashed-line' | 'circle';

export interface DataRegistryEntry<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum,
  OriginalDatum extends object
> {
  /** unique data key */
  key: string;
  /** array of data for the key. */
  data: readonly Datum[];
  /** function that returns the key value of a datum. Defaults to xAccessor or yAccessor, depending on the orientation of the chart. */
  keyAccessor: (d: OriginalDatum, dataKey?: string) => string;
  /** function that returns the x value of a datum. */
  xAccessor: (d: Datum) => ScaleInput<XScale>;
  /** function that returns the y value of a datum. */
  yAccessor: (d: Datum) => ScaleInput<YScale>;
  /** function that returns the color value of a datum. */
  colorAccessor?: (d: OriginalDatum, dataKey: string) => string;
  /** whether the entry supports mouse events. */
  mouseEvents?: boolean;
  /** Optionally update the xScale. */
  xScale?: <Scale extends AxisScale>(xScale: Scale) => Scale;
  /** Optionally update the yScale. */
  yScale?: <Scale extends AxisScale>(yScale: Scale) => Scale;
  /** Legend shape for the data key. */
  legendShape?: LegendShape;
}

export interface DataContextType<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
  OriginalDatum extends object
> {
  xScale: XScale;
  yScale: YScale;
  xRangePadding: number;
  yRangePadding: number;
  colorScale: ScaleTypeToD3Scale<string, string>['ordinal'];
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: Margin;
  dataRegistry: Omit<DataRegistry<XScale, YScale, Datum, OriginalDatum>, 'registry' | 'registryKeys'>;
  registerData: (
    data:
      | DataRegistryEntry<XScale, YScale, Datum, OriginalDatum>
      | DataRegistryEntry<XScale, YScale, Datum, OriginalDatum>[]
  ) => void;
  unregisterData: (keyOrKeys: string | string[]) => void;
  setDimensions: (dims: { width: number; height: number; margin: Margin }) => void;
  horizontal: boolean;
  /* A react-spring configuration object */
  springConfig: SpringConfig;
}

/** Call signature of PointerEvent callback. */
export interface EventHandlerParams<Datum> {
  /** Series key that datum belongs to. */
  key: string;
  /** Index of datum in series data array. */
  index: number;
  /** Datum. */
  datum: Datum;
  /** Optional distance of datum x value to event x value. Used to determine closest datum. */
  distanceX?: number;
  /** Optional distance of datum y value to event y value. Used to determine closest datum. */
  distanceY?: number;
  /** Coordinates of the event in svg space. */
  svgPoint?: { x: number; y: number };
  /** The PointerEvent or FocusEvent. */
  event?: PointerEvent | FocusEvent;

  snapLeft: number;
  snapTop: number;
}

/** Common props for data series. */
export interface SeriesProps<XScale extends AxisScale, YScale extends AxisScale, Datum extends object> {
  /** Required data key for the Series, should be unique across all series. */
  dataKey: string;
  /** Data for the Series. */
  data: readonly Datum[];

  keyAccessor: (d: Datum, dataKey?: string) => string;
  /** Given a Datum, returns the x-scale value. */
  xAccessor: (d: Datum) => ScaleInput<XScale>;
  /** Given a Datum, returns the y-scale value. */
  yAccessor: (d: Datum) => ScaleInput<YScale>;

  colorAccessor?: (d: Datum, dataKey: string) => string;
  /**
   * Callback invoked for onPointerMove events for the nearest Datum to the PointerEvent.
   * By default XYChart will capture and emit PointerEvents, invoking this function for
   * any Series with a defined handler. Alternatively you may set <XYChart captureEvents={false} />
   * and Series will emit their own events.
   */
  onPointerMove?: ({
    datum,
    distanceX,
    distanceY,
    event,
    index,
    key,
    svgPoint
  }: EventHandlerParams<Datum>) => void;
  /**
   * Callback invoked for onPointerOut events. By default XYChart will capture and emit
   * PointerEvents, invoking this function for any Series with a defined handler.
   * Alternatively you may set <XYChart captureEvents={false} /> and Series will emit
   * their own events.
   */
  onPointerOut?: (
    /** The PointerEvent. */
    event: PointerEvent
  ) => void;
  /**
   * Callback invoked for onPointerUp events for the nearest Datum to the PointerEvent.
   * By default XYChart will capture and emit PointerEvents, invoking this function for
   * any Series with a defined handler. Alternatively you may set <XYChart captureEvents={false} />
   * and Series will emit their own events.
   */
  onPointerUp?: ({
    datum,
    distanceX,
    distanceY,
    event,
    index,
    key,
    svgPoint
  }: EventHandlerParams<Datum>) => void;
  /**
   * Callback invoked for onFocus events for the nearest Datum to the FocusEvent.
   * XYChart will NOT capture and emit FocusEvents, they are emitted from individual Series glyph shapes.
   */
  onFocus?: ({ datum, distanceX, distanceY, event, index, key, svgPoint }: EventHandlerParams<Datum>) => void;
  /**
   * Callback invoked for onBlur events for the nearest Datum to the FocusEvent.
   * XYChart will NOT capture and emit FocusEvents, they are emitted from individual Series glyph shapes.
   */
  onBlur?: (
    /** The FocusEvent. */
    event: FocusEvent
  ) => void;
  /** Whether the Series emits and subscribes to PointerEvents and FocusEvents (including Tooltip triggering). */
  enableEvents?: boolean;
}

/** Bar shape. */
export interface Bar {
  // /** Unique key for Bar (not dataKey). */
  key: string;
  /** X coordinate of Bar. */
  x: number;
  /** Y coordinate of Bar. */
  y: number;
  /** Width of Bar. */
  width: number;
  /** Height of Bar. */
  height: number;
  // /** Fill color of Bar */
  fill?: string;
}

export type BarsProps<XScale extends AxisScale, YScale extends AxisScale> = {
  bars: Bar[];
  xScale: XScale;
  yScale: YScale;
  horizontal?: boolean;
} & Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref'>;

// /** Props for base Bars components */
// export type BarsProps<XScale extends AxisScale, YScale extends AxisScale> = {
//   bars: Bar[];
//   xScale: XScale;
//   yScale: YScale;
//   horizontal?: boolean;
//   /** Optional radius to apply to bar corners. */
//   radius?: number;
//   /** Whether to apply radius to all corners. */
//   radiusAll?: boolean;
//   /** Whether to apply radius to top corners. */
//   radiusTop?: boolean;
//   /** Whether to apply radius to right corners. */
//   radiusRight?: boolean;
//   /** Whether to apply radius to bottom corners. */
//   radiusBottom?: boolean;
//   /** Whether to apply radius to left corners. */
//   radiusLeft?: boolean;
// } & Omit<SVGProps<SVGRectElement | SVGPathElement>, 'x' | 'y' | 'width' | 'height' | 'ref' | 'children'>;

export type Orientation = 'top' | 'bottom' | 'left' | 'right';

type OwnTextProps = {
  /** className to apply to the SVGText element. */
  className?: string;
  /** Whether to scale the fontSize to accommodate the specified width.  */
  scaleToFit?: boolean | 'shrink-only';
  /** Rotational angle of the text. */
  angle?: number;
  /** Horizontal text anchor. */
  textAnchor?: 'start' | 'middle' | 'end' | 'inherit';
  /** Vertical text anchor. */
  verticalAnchor?: 'start' | 'middle' | 'end';
  /** Styles to be applied to the text (and used in computation of its size). */
  style?: CSSProperties;
  /** Ref passed to the Text SVG element. */
  innerRef?: Ref<SVGSVGElement>;
  /** Ref passed to the Text text element */
  innerTextRef?: Ref<SVGTextElement>;
  /** x position of the text. */
  x?: string | number;
  /** y position of the text. */
  y?: string | number;
  /** dx offset of the text. */
  dx?: string | number;
  /** dy offset of the text. */
  dy?: string | number;
  /** Desired "line height" of the text, implemented as y offsets. */
  lineHeight?: SVGTSpanProps['dy'];
  /** Cap height of the text. */
  capHeight?: SVGTSpanProps['capHeight'];
  /** Font size of text. */
  fontSize?: string | number;
  /** Font family of text. */
  fontFamily?: string;
  /** Fill color of text. */
  fill?: string;
  /** Maximum width to occupy (approximate as words are not split). */
  width?: number;
  /** String (or number coercible to one) to be styled and positioned. */
  children?: string | number;
};

type SVGTSpanProps = SVGAttributes<SVGTSpanElement>;
type SVGTextProps = SVGAttributes<SVGTextElement>;
export type LineProps = Omit<SVGProps<SVGLineElement>, 'to' | 'from' | 'ref'>;
export type RectProps = Omit<SVGProps<SVGRectElement>, 'ref'>;

export type TextProps = OwnTextProps & Omit<SVGTextProps, keyof OwnTextProps>;

export type FormattedValue = string | undefined;

export type TickRendererProps = Partial<TextProps> & {
  x: number;
  y: number;
  formattedValue: FormattedValue;
};

export type SvgAxisRendererProps<Scale extends AxisScale> = CommonAxisProps<Scale> & {
  // /** Start point of the axis line */
  // axisFromPoint: Point;
  // /** End point of the axis line */
  // axisToPoint: Point;
  /** Whether this axis is horizontal */
  // horizontal: boolean;
  /** A [d3](https://github.com/d3/d3-scale) or [visx](https://github.com/airbnb/visx/tree/master/packages/visx-scale) scale function. */
  // scale: Scale;
  // /** Function to compute tick position along the axis from tick value */
  // tickPosition: (value: ScaleInput<Scale>) => AxisScaleOutput;
  /** Axis coordinate sign, -1 for left or top orientation. */
  // tickSign: 1 | -1;
  // /** Computed ticks with positions and formatted value */
  // ticks: ComputedTick<Scale>[];

  tickValues: ScaleInput<Scale>[];

  renderingOffset?: number;
};

export type TicksRendererProps<Scale extends AxisScale> = Pick<
  SvgAxisRendererProps<Scale>,
  | 'hideTicks'
  | 'orientation'
  | 'scale'
  | 'tickValues'
  | 'tickLineProps'
  | 'springConfig'
  | 'animate'
  | 'renderingOffset'
  | 'tickFormat'
  | 'tickLength'
  | 'tickLabelPadding'
  | 'tickGroupProps'
  | 'tickLabelProps'
>;

export type CommonAxisProps<Scale extends AxisScale> = {
  /** A [d3](https://github.com/d3/d3-scale) or [visx](https://github.com/airbnb/visx/tree/master/packages/visx-scale) scale function. */
  scale: Scale;
  /** The number of ticks wanted for the axis (note this is approximate)  */
  tickCount?: number;
  /** A [d3 formatter](https://github.com/d3/d3-scale/blob/master/README.md#continuous_tickFormat) for the tick text. */
  tickFormat?: TickFormatter<ScaleInput<Scale>>;
  /** Placement of the axis */
  orientation: Orientation;
  /** Pixel padding to apply to both sides of the axis. */
  rangePadding?: number;
  /**  If true, will hide the axis line. */
  hideAxisLine?: boolean;
  /** If true, will hide the ticks (but not the tick labels). */
  hideTicks?: boolean;
  /** If true, will hide the '0' value tick and tick label. */
  hideZero?: boolean;
  /* A react-spring configuration object to control the axis animation. */
  springConfig?: SpringConfig;
  /** Whether the axis should be animated or not. */
  animate?: boolean;
  /** Props to apply to the <g> element that wraps the entire axis. */
  axisGroupProps?: Omit<SVGProps<SVGGElement>, 'ref' | 'left' | 'right'> & { className?: string };
  /** Props to apply to the <g> element that wraps each tick line and label. */
  tickGroupProps?: Omit<SVGProps<SVGGElement>, 'ref' | 'style'>; // TODO think about removing style.
  /** Padding between the tick lines and the tick labels. */
  tickLabelPadding?: number;
  /** The props to apply to the tick labels. Can be a props object or a function that returns a props object. */
  tickLabelProps?: TickLabelProps<ScaleInput<Scale>> | Partial<TextProps>;
  /** The length of the tick lines. */
  tickLength?: number;
  /** The length of the outer ticks (added at the very start and very end of the axis domain). */
  outerTickLength?: number;
  /** Props to be applied to individual tick lines. */
  tickLineProps?: LineProps;
  /** Override the component used to render all tick lines and labels. */
  ticksComponent?: (tickRendererProps: TicksRendererProps<Scale>) => ReactNode;
  /** Classes to apply to the axis domain path. */ // TODO think about putting into domainPathProps.
  domainPathClassName?: string;
  /** Props to apply to the axis domain path. */
  domainPathProps?: Omit<SVGProps<SVGPathElement>, 'ref'>;
  /** The text for the axis label. */
  label?: string;
  /** Pixel offset of the axis label. */
  labelOffset?: number;
  /** Classes to apply to the axis label. */ // TODO think about putting into labelProps.
  labelClassName?: string;
  /** Props to apply to the axis label. */
  labelProps?: Partial<TextProps>;
};

export type TickFormatter<T> = (
  value: T,
  index: number,
  values: { value: T; index: number }[]
) => FormattedValue;

export type TickLabelProps<T> = (
  value: T,
  index: number,
  values: { value: T; index: number }[]
) => Partial<TextProps>;

export interface Point {
  x: number;
  y: number;
}

export type ComputedTick<Scale extends AxisScale> = {
  value: ScaleInput<Scale>;
  index: number;
  from: Point;
  to: Point;
  formattedValue: FormattedValue;
};

// In order to plot values on an axis, output of the scale must be number.
// Some scales return undefined.
export type AxisScaleOutput = number | NumberLike | undefined;

export type StackPathConfig<Datum, Key> = {
  /** Array of keys corresponding to stack layers. */
  keys?: Key[];
  /** Sets the stack offset to the pre-defined d3 offset, see https://github.com/d3/d3-shape#stack_offset. */
  stackOffset?: keyof typeof STACK_OFFSETS;
  /** Sets the stack order to the pre-defined d3 function, see https://github.com/d3/d3-shape#stack_order. */
  stackOrder?: keyof typeof STACK_ORDERS;
  /** Sets the value accessor for a Datum, which defaults to d[key]. */
  value?: number | ((d: Datum, key: Key) => number);
};

export type CombinedStackData<XScale extends AxisScale, YScale extends AxisScale, Datum extends object> = {
  [dataKey: string]: ScaleInput<XScale> | ScaleInput<YScale>;
} & {
  stack: ScaleInput<XScale> | ScaleInput<YScale>;
  positiveSum: number;
  negativeSum: number;
  __datum__: Datum;
};

// BarStack transforms its child series Datum into CombinedData<XScale, YScale>
export type BarStackDatum<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = SeriesPoint<CombinedStackData<XScale, YScale, Datum>>;

export type BarStackData<XScale extends AxisScale, YScale extends AxisScale, Datum extends object> = Series<
  CombinedStackData<XScale, YScale, Datum>,
  string
>[];

/** Arguments for findNearestDatum* functions. */
export type NearestDatumArgs<XScale extends AxisScale, YScale extends AxisScale, Datum extends object> = {
  dataKey: string;
  point: { x: number; y: number } | null;
  xAccessor: (d: Datum) => ScaleInput<XScale>;
  yAccessor: (d: Datum) => ScaleInput<YScale>;
  data: readonly Datum[];
  width: number;
  height: number;
  xScale: XScale;
  yScale: YScale;
};

/** Return type for nearestDatum* functions. */
export type NearestDatumReturnType<Datum extends object> = {
  datum: Datum;
  index: number;
  distanceX: number;
  distanceY: number;

  snapLeft: number;
  snapTop: number;
  // xAccessor: (d: Datum) => ScaleInput<XScale>;
  // yAccessor: (d: Datum) => ScaleInput<YScale>;
} | null;

export type TooltipDatum<Datum extends object> = {
  /** Series key that datum belongs to. */
  key: string;
  /** Index of datum in series data array. */
  index: number;
  /** Datum. */
  datum: Datum;

  snapLeft: number;
  snapTop: number;
};

export type TooltipData<Datum extends object = object> = {
  /** Nearest Datum to event across all Series. */
  nearestDatum?: TooltipDatum<Datum> & { distance: number };
  /** Nearest Datum to event across for each Series. */
  datumByKey: {
    [key: string]: TooltipDatum<Datum>;
  };
};

export type TooltipContextType<Datum extends object> = UseTooltipParams<TooltipData<Datum>> & {
  showTooltip: (params: EventHandlerParams<Datum>) => void;
};
