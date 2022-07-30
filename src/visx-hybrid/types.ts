import type {
  CSSProperties,
  FocusEvent,
  PointerEvent,
  ReactNode,
  // Ref,
  SVGAttributes,
  SVGProps
} from 'react';
import type { SpringConfig } from 'react-spring';
import type { D3Scale, ScaleInput } from '@visx/scale';
import type { Series, SeriesPoint } from 'd3-shape';

export type { ScaleInput } from '@visx/scale';

/** A value that has .valueOf() function */
export type NumberLike = { valueOf(): number };

export type AxisScaleOutput = number | NumberLike | undefined;

/** A catch-all type for scales that are compatible with axis */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AxisScale<Output extends AxisScaleOutput = AxisScaleOutput> = D3Scale<Output, any, any>;

/** A catch-all type for scales that returns number */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PositionScale = D3Scale<number, any, any>;

export type Anchor = 'start' | 'middle' | 'end';

export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/** Horizontal text anchor. */
export type TextAnchor = 'start' | 'middle' | 'end' | 'inherit';

/** Vertical text anchor. */
export type VerticalTextAnchor = 'start' | 'middle' | 'end';

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
  theme: XYChartTheme;
}

export interface TickDatum {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any; // FIXME  ?? ScaleInput<Scale> where <Scale extends GridScale> ???
  index: number;
  label: string;
}

export type GridType = 'row' | 'column';

export type Variable = 'independent' | 'dependent';

export type LabelAngle = 'horizontal' | 'vertical';
export type TickLabelAngle = 'horizontal' | 'angled' | 'vertical';

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

/** Return type for nearestDatum* functions. */
export type NearestDatumReturnType<Datum extends object> = {
  datum: Datum;
  index: number;
  distanceX: number;
  distanceY: number;
  snapLeft: number;
  snapTop: number;
} | null;

export type LineStyles = {
  style?: CSSProperties;
  className?: string;
} & Pick<SVGProps<SVGLineElement>, 'stroke' | 'strokeWidth' | 'strokeLinecap' | 'strokeDasharray'>;

export type PathStyles = {
  style?: CSSProperties;
  className?: string;
} & Pick<SVGProps<SVGPathElement>, 'stroke' | 'strokeWidth' | 'strokeLinecap' | 'strokeDasharray'>;

export interface TextStyles {
  font?: FontProperties | string;
  fill?: string;
  className?: string;
  // `style` is deliberately not a property of this interface.
}

export interface AxisStyles {
  // /** Axis label styles. */
  // axisLabel?: SVGTextProps;
  /** Axis line styles. */
  axisPath?: PathStyles;
  // /** Tick label styles. */
  // tickLabel?: SVGTextProps;
  /** Tick line styles. */
  tickLine?: LineStyles;
  /** Length of axis tick lines. */
  tickLength?: number;
}

export type RectStyles = {
  style?: CSSProperties;
  className?: string;
} & Pick<SVGProps<SVGRectElement>, 'fill'>;

export interface SVGStyles {
  style?: CSSProperties;
  className?: string;
}

export interface XYChartTheme {
  svg?: SVGStyles;
  grid?: {
    independent?: LineStyles;
    dependent?: LineStyles;
  };
  bandStripes?: RectStyles;
  /** Styles to applied to big SVG labels (axis label, annotation title, etc.). */
  bigLabels?: TextStyles;
  /** Styles to applied to small SVG labels (tick label, annotation subtitle, etc.). */
  smallLabels?: TextStyles;
  axis?: {
    top?: AxisStyles;
    bottom?: AxisStyles;
    left?: AxisStyles;
    right?: AxisStyles;
  };
}

// export interface FontProperties {
//   /**
//    * A list of one or more font family names.
//    */
//   fontFamily: string;

//   /**
//    * Set the size of the font.
//    */
//   fontSize: number;

//   /**
//    * Select a normal, condensed, or expanded face from the font.
//    * Only has an effect if the font includes the given variation.
//    * This property in itself does not cause the browser to stretch a font.
//    */
//   fontStretch?: string;

//   /**
//    * Select a normal, italic, or oblique face from the font.
//    */
//   fontStyle?: string;

//   /**
//    * Select variants from the font.
//    */
//   fontVariant?: string;

//   /**
//    * Set the weight of the font.
//    */
//   fontWeight?: number | string;

//   /**
//    * Define how tall a line of text should be.
//    */
//   lineHeight?: number;
// }

export type FontProperties = Pick<
  CSSProperties,
  'fontFamily' | 'fontSize' | 'fontStretch' | 'fontStyle' | 'fontVariant' | 'fontWeight' | 'lineHeight'
>;

export interface FontMetrics {
  height: number;
  heightFromBaseline: number;
}

export type AxisOrientation = 'top' | 'bottom' | 'left' | 'right';

export type FormattedValue = string | undefined;

export type TickFormatter<T> = (
  value: T,
  index: number,
  values: { value: T; index: number }[]
) => FormattedValue;

export type CombinedStackData<XScale extends AxisScale, YScale extends AxisScale, Datum extends object> = {
  [dataKey: string]: ScaleInput<XScale> | ScaleInput<YScale>;
} & {
  stack: ScaleInput<XScale> | ScaleInput<YScale>;
  positiveSum: number;
  negativeSum: number;
  __datum__: Datum;
};

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

export type UseTooltipParams<TooltipData> = {
  tooltipOpen: boolean;
  tooltipLeft?: number;
  tooltipTop?: number;
  tooltipData?: TooltipData;
  updateTooltip: (args: UpdateTooltipArgs<TooltipData>) => void;
  showTooltip: (args: ShowTooltipArgs<TooltipData>) => void;
  hideTooltip: () => void;
};

export type UseTooltipState<TooltipData> = Pick<
  UseTooltipParams<TooltipData>,
  'tooltipOpen' | 'tooltipLeft' | 'tooltipTop' | 'tooltipData'
>;

type ValueOrFunc<T> = T | ((t: T) => T);
export type ShowTooltipArgs<TooltipData> = ValueOrFunc<Omit<UseTooltipState<TooltipData>, 'tooltipOpen'>>;
export type UpdateTooltipArgs<TooltipData> = ValueOrFunc<UseTooltipState<TooltipData>>;

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

// type SVGTSpanProps = SVGAttributes<SVGTSpanElement>;
export type SVGTextProps = SVGAttributes<SVGTextElement>;

// type OwnTextProps = {
//   /** className to apply to the SVGText element. */
//   className?: string;
//   /** Whether to scale the fontSize to accommodate the specified width.  */
//   scaleToFit?: boolean | 'shrink-only';
//   /** Rotational angle of the text. */
//   angle?: number;
//   /** Horizontal text anchor. */
//   textAnchor?: 'start' | 'middle' | 'end' | 'inherit';
//   /** Vertical text anchor. */
//   verticalAnchor?: 'start' | 'middle' | 'end';
//   /** Styles to be applied to the text (and used in computation of its size). */
//   style?: CSSProperties;
//   /** Ref passed to the Text SVG element. */
//   innerRef?: Ref<SVGSVGElement>;
//   /** Ref passed to the Text text element */
//   innerTextRef?: Ref<SVGTextElement>;
//   /** x position of the text. */
//   x?: string | number;
//   /** y position of the text. */
//   y?: string | number;
//   /** dx offset of the text. */
//   dx?: string | number;
//   /** dy offset of the text. */
//   dy?: string | number;
//   /** Desired "line height" of the text, implemented as y offsets. */
//   lineHeight?: SVGTSpanProps['dy'];
//   /** Cap height of the text. */
//   capHeight?: SVGTSpanProps['capHeight'];
//   /** Font size of text. */
//   fontSize?: string | number;
//   /** Font family of text. */
//   fontFamily?: string;
//   /** Fill color of text. */
//   fill?: string;
//   /** Maximum width to occupy (approximate as words are not split). */
//   width?: number;
//   /** String (or number coercible to one) to be styled and positioned. */
//   children?: string | number;
// };

export type LineProps = Omit<SVGProps<SVGLineElement>, 'to' | 'from' | 'ref'>;
export type RectProps = Omit<SVGProps<SVGRectElement>, 'ref'>;
// export type TextProps = OwnTextProps & Omit<SVGTextProps, keyof OwnTextProps>;

export type TooltipProps = {
  /** Tooltip content. */
  children?: ReactNode;
  /** Optional className to apply to the Tooltip in addition to `visx-tooltip`. */
  className?: string;
  /** The `left` position of the Tooltip. */
  left?: number;
  /** Offset the `left` position of the Tooltip by this margin. */
  offsetLeft?: number;
  /** Offset the `top` position of the Tooltip by this margin. */
  offsetTop?: number;
  /** Styles to apply, unless `unstyled=true`. */
  style?: CSSProperties;
  /** The `top` position of the Tooltip. */
  top?: number;
  /**
   * Applies position: 'absolute' for tooltips to correctly position themselves
   * when `unstyled=true`. In a future major release this will be the default behavior.
   */
  applyPositionStyle?: boolean;
  /**
   * Whether to omit applying any style, except `left` / `top`.
   * In most cases if this is `true` a developer must do one of the following
   * for positioning to work correctly:
   * - set `applyPositionStyle=true`
   * - create a CSS selector like: `.visx-tooltip { position: 'absolute' }`
   */
  unstyled?: boolean;
};

export interface Point {
  x: number;
  y: number;
}

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
