import { CSSProperties, FocusEvent, PointerEvent } from 'react';
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

// In order to plot values on an axis, output of the scale must be number.
// Some scales return undefined.
export type GridScaleOutput = number | NumberLike | undefined;

export type GridLines = { from: { x?: number; y?: number }; to: { x?: number; y?: number } }[];

export interface CommonGridProps {
  /** classname to apply to line group element. */
  className?: string;
  /** Optionally override rendering of grid lines. */
  // children?: (props: { lines: GridLines }) => ReactNode;
  /** Top offset to apply to glyph g element container. */
  top?: number;
  /** Left offset to apply to glyph g element container. */
  left?: number;
  /** Grid line stroke color. */
  stroke?: string;
  /** Grid line stroke thickness. */
  strokeWidth?: string | number;
  /** Grid line stroke-dasharray attribute. */
  strokeDasharray?: string;
  /** Approximate number of grid lines. Approximate due to d3 algorithm, specify `tickValues` for precise control. */
  numTicks?: number;
  /** Styles to apply as grid line style. */
  lineStyle?: CSSProperties;
  /** Pixel offset to apply as a translation (y- for Rows, x- for Columns) to each grid lines. */
  offset?: number;
}

export type GridComponentProps<Scale extends GridScale> = CommonGridProps & {
  /** `@visx/scale` or `d3-scale` object used to convert value to position. */
  scale: Scale;
  /**
   * Exact values used to generate grid lines using `scale`.
   * Overrides `numTicks` if specified.
   */
  tickValues?: ScaleInput<Scale>[];
  /** Total width (for rows) or height (for columns) of each grid line. */
  dimension: number;
  /**
   * Whether to animate the grid lines or not.
   * @default true
   */
  animate?: boolean;
  /* An optional react-spring configuration object */
  springConfig?: SpringConfig;
};

/** A catch-all type for scales that are compatible with grid */
export type GridScale<Output extends GridScaleOutput = GridScaleOutput> = D3Scale<Output, any, any>;

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
