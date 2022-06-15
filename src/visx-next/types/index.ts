import { CSSProperties, FocusEvent, PointerEvent, ReactNode, Ref, SVGAttributes, SVGProps } from 'react';
import { SpringConfig } from 'react-spring';
import { AxisScale } from '@visx/axis';
import { D3Scale, NumberLike, ScaleInput } from '@visx/scale';

import { DataRegistry } from '../DataRegistry'; // TODO there's a dep loop here.

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

/** A catch-all type for scales that are compatible with grid */
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

export interface DataRegistryEntry<XScale extends AxisScale, YScale extends AxisScale, Datum> {
  /** unique data key */
  key: string;
  /** array of data for the key. */
  data: readonly Datum[];
  /** function that returns the x value of a datum. */
  xAccessor: (d: Datum) => ScaleInput<XScale>;
  /** function that returns the y value of a datum. */
  yAccessor: (d: Datum) => ScaleInput<YScale>;
  /** whether the entry supports mouse events. */
  mouseEvents?: boolean;
  /** Optionally update the xScale. */
  xScale?: <Scale extends AxisScale>(xScale: Scale) => Scale;
  /** Optionally update the yScale. */
  yScale?: <Scale extends AxisScale>(yScale: Scale) => Scale;
  /** Legend shape for the data key. */
  legendShape?: LegendShape;
}

export interface DataContextType<XScale extends AxisScale, YScale extends AxisScale, Datum extends object> {
  xScale: XScale;
  yScale: YScale;
  //   colorScale: ScaleTypeToD3Scale<string, string>['ordinal'];
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: Margin;
  dataRegistry: Omit<DataRegistry<XScale, YScale, Datum>, 'registry' | 'registryKeys'>;
  registerData: (
    data: DataRegistryEntry<XScale, YScale, Datum> | DataRegistryEntry<XScale, YScale, Datum>[]
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
}

/** Common props for data series. */
export interface SeriesProps<XScale extends AxisScale, YScale extends AxisScale, Datum extends object> {
  /** Required data key for the Series, should be unique across all series. */
  dataKey: string;
  /** Data for the Series. */
  data: readonly Datum[];
  /** Given a Datum, returns the x-scale value. */
  xAccessor: (d: Datum) => ScaleInput<XScale>;
  /** Given a Datum, returns the y-scale value. */
  yAccessor: (d: Datum) => ScaleInput<YScale>;

  // TODO REMOVE!!!!
  // colorAccessor: (d: Datum) => string | null | undefined;
  // keyAccessor: (d: Datum) => Key;
  // getBarProps?: (datum: Datum) => Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref'>;

  // /**
  //  * Callback invoked for onPointerMove events for the nearest Datum to the PointerEvent.
  //  * By default XYChart will capture and emit PointerEvents, invoking this function for
  //  * any Series with a defined handler. Alternatively you may set <XYChart captureEvents={false} />
  //  * and Series will emit their own events.
  //  */
  // onPointerMove?: ({
  //   datum,
  //   distanceX,
  //   distanceY,
  //   event,
  //   index,
  //   key,
  //   svgPoint
  // }: EventHandlerParams<Datum>) => void;
  // /**
  //  * Callback invoked for onPointerOut events. By default XYChart will capture and emit
  //  * PointerEvents, invoking this function for any Series with a defined handler.
  //  * Alternatively you may set <XYChart captureEvents={false} /> and Series will emit
  //  * their own events.
  //  */
  // onPointerOut?: (
  //   /** The PointerEvent. */
  //   event: PointerEvent
  // ) => void;
  // /**
  //  * Callback invoked for onPointerUp events for the nearest Datum to the PointerEvent.
  //  * By default XYChart will capture and emit PointerEvents, invoking this function for
  //  * any Series with a defined handler. Alternatively you may set <XYChart captureEvents={false} />
  //  * and Series will emit their own events.
  //  */
  // onPointerUp?: ({
  //   datum,
  //   distanceX,
  //   distanceY,
  //   event,
  //   index,
  //   key,
  //   svgPoint
  // }: EventHandlerParams<Datum>) => void;
  // /**
  //  * Callback invoked for onFocus events for the nearest Datum to the FocusEvent.
  //  * XYChart will NOT capture and emit FocusEvents, they are emitted from individual Series glyph shapes.
  //  */
  // onFocus?: ({ datum, distanceX, distanceY, event, index, key, svgPoint }: EventHandlerParams<Datum>) => void;
  // /**
  //  * Callback invoked for onBlur events for the nearest Datum to the FocusEvent.
  //  * XYChart will NOT capture and emit FocusEvents, they are emitted from individual Series glyph shapes.
  //  */
  // onBlur?: (
  //   /** The FocusEvent. */
  //   event: FocusEvent
  // ) => void;
  // /** Whether the Series emits and subscribes to PointerEvents and FocusEvents (including Tooltip triggering). */
  // enableEvents?: boolean;
}

/** Bar shape. */
export interface Bar {
  // /** Unique key for Bar (not dataKey). */
  // key: string;
  /** X coordinate of Bar. */
  x: number;
  /** Y coordinate of Bar. */
  y: number;
  /** Width of Bar. */
  width: number;
  /** Height of Bar. */
  height: number;
  // /** Fill color of Bar */
  // fill?: string;
}

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

type OwnProps = {
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
type LineProps = Omit<SVGProps<SVGLineElement>, 'to' | 'from' | 'ref'>;

export type TextProps = OwnProps & Omit<SVGTextProps, keyof OwnProps>;

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
  /** The class name applied to the axis line element. */
  // axisLineClassName?: string;
  /**  If true, will hide the axis line. */
  hideAxisLine?: boolean;
  /** If true, will hide the ticks (but not the tick labels). */
  hideTicks?: boolean;
  /** If true, will hide the '0' value tick and tick label. */
  hideZero?: boolean;
  /** The text for the axis label. */
  label?: string;
  /** The class name applied to the axis label text element. */
  // labelClassName?: string;
  // /** Pixel offset of the axis label (does not include tick label font size, which is accounted for automatically)  */
  labelOffset?: number;
  /** Props applied to the axis label component. */
  // labelProps?: Partial<TextProps>;
  /** The number of ticks wanted for the axis (note this is approximate)  */
  tickCount?: number;
  /** Placement of the axis */
  orientation: Orientation;
  /** Pixel padding to apply to both sides of the axis. */
  rangePadding?: number;
  /** The color for the stroke of the lines. */
  // stroke?: string;
  /** The pixel value for the width of the lines. */
  // strokeWidth?: number | string;
  /** The pattern of dashes in the stroke. */
  // strokeDasharray?: string;
  /** Props to be applied to individual tick lines. */
  tickLineProps?: LineProps;
  /** The class name applied to each tick group. */
  tickClassName?: string;
  /** Override the component used to render tick labels (instead of <Text /> from @visx/text). */
  // tickComponent?: (tickRendererProps: TickRendererProps) => ReactNode;
  /** Override the component used to render all tick lines and labels. */
  ticksComponent?: (tickRendererProps: TicksRendererProps<Scale>) => ReactNode;
  /** A [d3 formatter](https://github.com/d3/d3-scale/blob/master/README.md#continuous_tickFormat) for the tick text. */
  tickFormat?: TickFormatter<ScaleInput<Scale>>;
  /** A function that returns props for a given tick label. */
  tickLabelProps?: TickLabelProps<ScaleInput<Scale>> | Partial<TextProps>;
  /** The length of the tick lines. */
  tickLength?: number;

  outerTickLength?: number;
  /** The color for the tick's stroke value. */
  // tickStroke?: string;
  /** A custom SVG transform value to be applied to each tick group. */
  // tickTransform?: string;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;

  animate?: boolean;

  axisGroupProps?: Omit<SVGProps<SVGGElement>, 'ref' | 'left' | 'right'> & { className?: string };

  domainPathClassName?: string;
  domainPathProps?: Omit<SVGProps<SVGPathElement>, 'ref'>;

  labelClassName?: string;
  labelProps?: Partial<TextProps>;

  tickGroupProps?: Omit<SVGProps<SVGGElement>, 'ref' | 'style'>; // TODO think about removing style.

  // tickLabelAlignment: {
  //   textAnchor: Anchor;
  //   verticalAnchor: Anchor;
  //   angle: Angle;
  // };

  tickLabelPadding?: number;
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
