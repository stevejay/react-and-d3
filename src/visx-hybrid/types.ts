import type { CSSProperties, FocusEvent, PointerEvent, ReactNode, SVGAttributes, SVGProps } from 'react';
import type { SpringConfig, SpringValues } from 'react-spring';
import type { D3Scale, ScaleInput, ScaleTypeToD3Scale } from '@visx/scale';
import type { ScaleBand } from 'd3-scale';
import type { CurveFactory, CurveFactoryLineOnly, Series, SeriesPoint } from 'd3-shape';

export type { ScaleConfig, ScaleConfigToD3Scale, ScaleInput } from '@visx/scale';

/** A value that has .valueOf() function */
export type NumberLike = { valueOf(): number };

export type AxisScaleOutput = number | NumberLike | undefined;

/** A catch-all type for scales that are compatible with axis */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AxisScale<Output extends AxisScaleOutput = AxisScaleOutput> = D3Scale<Output, any, any>;

export type Anchor = 'start' | 'middle' | 'end';

export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export type AxisOrientation = 'top' | 'bottom' | 'left' | 'right';

export interface DatumPosition {
  baselineX: number;
  baselineY: number;
  datumX: number;
  datumY: number;
  pointX: number;
  pointY: number;
}

export interface IDataEntry<Datum extends object = object, RenderingDatum extends object = object> {
  get dataKey(): string;
  get colorAccessor(): (datum: Datum, dataKey: string) => string;
  get independentAccessor(): (datum: Datum) => ScaleInput<AxisScale>;
  get dependentAccessor(): (datum: Datum) => ScaleInput<AxisScale>;
  get keyAccessor(): (datum: Datum) => string | number;
  getDomainValuesForIndependentScale(): readonly ScaleInput<AxisScale>[];
  getDomainValuesForDependentScale(): readonly ScaleInput<AxisScale>[];
  getDomainValuesForAlternateDependentScale(): readonly ScaleInput<AxisScale>[];
  getOriginalDataByIndependentValue(value: ScaleInput<AxisScale>): readonly Datum[];
  getMappedData(mapper: (datum: Datum) => ScaleInput<AxisScale>): ScaleInput<AxisScale>[];
  getPositionForOriginalDatum(params: {
    datum: Datum;
    scales: IScaleSet;
    horizontal: boolean;
    renderingOffset: number;
  }): DatumPosition | null;
  findNearestOriginalDatum(args: {
    scales: IScaleSet;
    horizontal: boolean;
    width: number;
    height: number;
    point: Point;
  }): NearestDatumReturnType<Datum> | null;
  getOriginalDatumFromRenderingDatum(datum: RenderingDatum): Datum;
  getOriginalData(): readonly Datum[];
  getRenderingData(): readonly RenderingDatum[];
  getRenderingDataWithLabels(labelFormatter?: (value: ScaleInput<AxisScale>) => string): readonly {
    datum: RenderingDatum;
    label: string;
  }[];
  getAreaAccessorsForRenderingData(
    scales: IScaleSet,
    dependent0Accessor?: (datum: RenderingDatum) => ScaleInput<AxisScale>
  ): {
    independent: (datum: RenderingDatum) => number;
    dependent: (datum: RenderingDatum) => number;
    dependent0: number | ((datum: RenderingDatum) => number);
    defined: (datum: RenderingDatum) => boolean;
  };
  getBarAccessorsForRenderingData(scales: IScaleSet): {
    independent0: (datum: RenderingDatum) => number;
    independent: (datum: RenderingDatum) => number;
    dependent0: (datum: RenderingDatum) => number;
    dependent1: (datum: RenderingDatum) => number;
  };
  getPointAccessorsForRenderingData(scales: IScaleSet): {
    independent: (datum: RenderingDatum) => number;
    dependent: (datum: RenderingDatum) => number;
  };
}

export interface IDataEntryStore<Datum extends object = object, RenderingDatum extends object = object> {
  getByDataKey(dataKey: string): IDataEntry<Datum, RenderingDatum>;
  tryGetByDataKey(dataKey: string): IDataEntry<Datum, RenderingDatum> | null;
  getAllDataKeys(): readonly string[];
}

export interface IScaleSet {
  independent: AxisScale;
  getDependentScale(usesAlternateDependent: boolean): AxisScale;
  group: ScaleBand<string> | null;
  color: ScaleTypeToD3Scale<string, string>['ordinal'];
}

export interface XYChartContextType<Datum extends object = object, RenderingDatum extends object = object> {
  scales: IScaleSet;
  independentRangePadding: [number, number];
  dependentRangePadding: [number, number];
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: Margin;
  outerMargin: Margin;
  dataEntryStore: IDataEntryStore<Datum, RenderingDatum>;
  horizontal: boolean;
  animate: boolean;
  springConfig: SpringConfig;
  renderingOffset: number;
  theme: XYChartTheme;
}

export interface TickDatum {
  value: ScaleInput<AxisScale>;
  index: number;
  label: string;
}

export type GridType = 'row' | 'column';
export type Variable = 'independent' | 'dependent' | 'alternateDependent';
export type LabelAlignment = 'horizontal' | 'vertical';
export type TickLabelAlignment = 'horizontal' | 'angled' | 'vertical';

/** Arguments for findNearestOriginalDatum* functions. */
export type NearestDatumArgs<Datum extends object> = {
  dataKey: string;
  point: { x: number; y: number } | null;
  independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
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
  /** Axis line styles. */
  axisPath?: PathStyles;
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

export interface DivStyles {
  style?: CSSProperties;
  className?: string;
}

export type GlyphStyles = {
  radius?: number;
  className?: string;
} & Pick<SVGProps<SVGCircleElement>, 'stroke' | 'strokeWidth' | 'strokeLinecap' | 'strokeDasharray' | 'fill'>;

export interface XYChartTheme {
  /** Ordinal colors to be used for default coloring by series `key`s. */
  colors: readonly string[];
  svg?: SVGStyles;
  grid?: {
    independent?: LineStyles;
    dependent?: LineStyles;
    alternateDependent?: LineStyles;
  };
  bandStripes?: RectStyles;
  /** Styles to applied to big SVG labels (axis label, annotation title, etc.). */
  bigLabels?: TextStyles;
  /** Styles to applied to small SVG labels (tick label, annotation subtitle, etc.). */
  smallLabels?: TextStyles;

  datumLabels?: TextStyles;

  axis?: {
    top?: AxisStyles;
    bottom?: AxisStyles;
    left?: AxisStyles;
    right?: AxisStyles;
  };

  tooltip?: {
    glyph?: GlyphStyles;
    crosshairs?: LineStyles;
    container?: DivStyles;
  };
}

export type FontProperties = Pick<
  CSSProperties,
  'fontFamily' | 'fontSize' | 'fontStretch' | 'fontStyle' | 'fontVariant' | 'fontWeight' | 'lineHeight'
>;

export interface FontMetrics {
  height: number;
  heightFromBaseline: number;
}

export type FormattedValue = string | undefined;

export type TickFormatter<T> = (
  value: T,
  index: number,
  values: { value: T; index: number }[]
) => FormattedValue;

// TODO think about a better name for this type.
export type StackDataWithSums<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
> = {
  [dataKey: string]: ScaleInput<IndependentScale> | ScaleInput<DependentScale>;
} & {
  stack: ScaleInput<IndependentScale> | ScaleInput<DependentScale>;
  positiveSum: number;
  negativeSum: number;
  __datum__: Datum;
};

export type StackDatum<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
> = SeriesPoint<StackDataWithSums<IndependentScale, DependentScale, Datum>>;

export type StackedData<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
> = Series<StackDataWithSums<IndependentScale, DependentScale, Datum>, string>[];

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
  datumByKey: Map<string, TooltipDatum<Datum>>;
};

export type UseTooltipParams<Datum extends object> = {
  tooltipOpen: boolean;
  tooltipLeft?: number;
  tooltipTop?: number;
  tooltipData?: TooltipData<Datum>;
  updateTooltip: (args: UpdateTooltipArgs<Datum>) => void;
  // hideTooltip: () => void;
};

// export type TooltipContextType<Datum extends object> = UseTooltipParams<Datum> & {
//   showTooltip: (eventParamsList: readonly EventHandlerParams<Datum>[]) => void;
//   hideTooltip: () => void;
// };

export type TooltipStateContextType<Datum extends object> = Pick<
  UseTooltipParams<Datum>,
  'tooltipOpen' | 'tooltipLeft' | 'tooltipTop' | 'tooltipData'
>;

export interface TooltipControlContextType<Datum extends object> {
  showTooltip: (eventParamsList: readonly EventHandlerParams<Datum>[]) => void;
  hideTooltip: () => void;
}

export type UseTooltipState<Datum extends object> = Pick<
  UseTooltipParams<Datum>,
  'tooltipOpen' | 'tooltipLeft' | 'tooltipTop' | 'tooltipData'
>;

type ValueOrFunc<T> = T | ((t: T) => T);
export type ShowTooltipArgs<Datum extends object> = ValueOrFunc<Omit<UseTooltipState<Datum>, 'tooltipOpen'>>;
export type UpdateTooltipArgs<Datum extends object> = ValueOrFunc<UseTooltipState<Datum>>;

// /** Common props for data series. */
// export interface SeriesProps<XScale extends AxisScale, YScale extends AxisScale, Datum extends object> {
//   /** Required data key for the Series, should be unique across all series. */
//   dataKey: string;
//   /** Data for the Series. */
//   data: readonly Datum[];

//   keyAccessor: (datum: Datum, dataKey?: string) => string | number;
//   /** Given a Datum, returns the x-scale value. */
//   xAccessor: (datum: Datum) => ScaleInput<XScale>;
//   /** Given a Datum, returns the y-scale value. */
//   yAccessor: (datum: Datum) => ScaleInput<YScale>;

//   colorAccessor?: (datum: Datum, dataKey: string) => string;
//   /**
//    * Callback invoked for onPointerMove events for the nearest Datum to the PointerEvent.
//    * By default XYChart will capture and emit PointerEvents, invoking this function for
//    * any Series with a defined handler. Alternatively you may set <XYChart captureEvents={false} />
//    * and Series will emit their own events.
//    */
//   onPointerMove?: (
//     eventParamsList: /*{
//     datum,
//     distanceX,
//     distanceY,
//     event,
//     index,
//     key,
//     svgPoint
//   }*/ readonly EventHandlerParams<Datum>[]
//   ) => void;
//   /**
//    * Callback invoked for onPointerOut events. By default XYChart will capture and emit
//    * PointerEvents, invoking this function for any Series with a defined handler.
//    * Alternatively you may set <XYChart captureEvents={false} /> and Series will emit
//    * their own events.
//    */
//   onPointerOut?: (
//     /** The PointerEvent. */
//     eventParamsList: PointerEvent
//   ) => void;
//   /**
//    * Callback invoked for onPointerUp events for the nearest Datum to the PointerEvent.
//    * By default XYChart will capture and emit PointerEvents, invoking this function for
//    * any Series with a defined handler. Alternatively you may set <XYChart captureEvents={false} />
//    * and Series will emit their own events.
//    */
//   onPointerUp?: (
//     eventParamsList: /*{
//     datum,
//     distanceX,
//     distanceY,
//     event,
//     index,
//     key,
//     svgPoint
//   }*/ readonly EventHandlerParams<Datum>[]
//   ) => void;
//   /**
//    * Callback invoked for onFocus events for the nearest Datum to the FocusEvent.
//    * XYChart will NOT capture and emit FocusEvents, they are emitted from individual Series glyph shapes.
//    */
//   onFocus?: (
//     events: /*{ datum, distanceX, distanceY, event, index, key, svgPoint }*/ readonly EventHandlerParams<Datum>[]
//   ) => void;
//   /**
//    * Callback invoked for onBlur events for the nearest Datum to the FocusEvent.
//    * XYChart will NOT capture and emit FocusEvents, they are emitted from individual Series glyph shapes.
//    */
//   onBlur?: (
//     /** The FocusEvent. */
//     event: FocusEvent
//   ) => void;
//   /** Whether the Series emits and subscribes to PointerEvents and FocusEvents (including Tooltip triggering). */
//   enableEvents?: boolean;
// }

export type SVGTextProps = SVGAttributes<SVGTextElement>;
export type LineProps = Omit<SVGProps<SVGLineElement>, 'to' | 'from' | 'ref'>;
export type PathProps = Omit<SVGProps<SVGLineElement>, 'ref'>;
export type RectProps = Omit<SVGProps<SVGRectElement>, 'ref'>;
export type GlyphProps = Omit<SVGProps<SVGCircleElement>, 'ref'>;

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

export interface LabelTransition {
  x: number;
  y: number;
  opacity: number;
}

export interface PolygonTransition {
  points: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

export interface LineTransition {
  d: string;
}

export type RenderAnimatedBarProps<Datum extends object> = {
  springValues: SpringValues<PolygonTransition>;
  datum: Datum;
  index: number;
  dataKey: string;
  horizontal: boolean;
  color: string;
  // colorScale: (dataKey: string) => string;
  // colorAccessor?: (datum: Datum, dataKey: string) => string;
} & Pick<
  React.SVGProps<SVGRectElement | SVGPathElement>,
  'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus'
>;

// export type SVGBarComponent<Datum extends object> = (props: SVGBarProps<Datum>) => JSX.Element;

export type SVGAnimatedPathProps<Datum extends object> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataEntry: IDataEntry<Datum, any>;
  scales: IScaleSet;
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  springConfig: SpringConfig;
  curve: CurveFactory | CurveFactoryLineOnly;
  color: string;
  pathProps?: PathProps | ((dataKey: string) => PathProps);
} & Pick<
  BasicSeriesProps<Datum>,
  'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus' | 'enableEvents'
>;

export type SVGAnimatedPathComponent<Datum extends object> = (
  props: SVGAnimatedPathProps<Datum>
) => JSX.Element;

export interface GlyphTransition {
  cx: number;
  cy: number;
  size: number;
  opacity: number;
}

// export interface SVGGlyphProps<Datum extends object> {
//   springValues: SpringValues<GlyphTransition>;
//   datum: Datum;
//   index: number;
//   dataKey: string;
//   horizontal: boolean;
//   color: string;
//   // colorScale: (dataKey: string) => string;
//   // colorAccessor?: (datum: Datum, dataKey: string) => string;
// }

// export type SVGGlyphComponent<Datum extends object> = (props: SVGGlyphProps<Datum>) => JSX.Element;

export type BarLabelPosition = 'outside' | 'inside' | 'inside-centered';
export type InternalBarLabelPosition = 'outside' | 'inside' | 'inside-centered' | 'stacked';

export interface BasicAxisProps {
  /** Whether the axis is the independent or the dependent axis. */
  variable: Variable;
  /** Which side of the chart the axis is rendered on. */
  position: 'start' | 'end';
}

export type CalculateMargin<Props extends BasicAxisProps = BasicAxisProps> = (
  axisOrientation: AxisOrientation,
  scale: AxisScale<AxisScaleOutput>,
  rangePadding: [number, number],
  theme: XYChartTheme,
  params: Props
) => Margin;

export interface SVGAxisComponent<Props extends BasicAxisProps = BasicAxisProps> {
  (props: Props): JSX.Element;
  calculateMargin: CalculateMargin<Props>;
}

export type AccessorForArrayItem<Datum, Output> = (d: Datum, index: number, data: Datum[]) => Output;

export type AreaPathConfig<Datum> = {
  /** The defined accessor for the shape. The final area shape includes all points for which this function returns true. By default all points are defined. */
  defined?: AccessorForArrayItem<Datum, boolean>;
  /** Sets the curve factory (from @visx/curve or d3-curve) for the area generator. Defaults to curveLinear. */
  curve?: CurveFactory;
  /** Sets the x0 accessor function, and sets x1 to null. */
  x?: number | AccessorForArrayItem<Datum, number>;
  /** Specifies the x0 accessor function which defaults to d => d[0]. */
  x0?: number | AccessorForArrayItem<Datum, number>;
  /** Specifies the x1 accessor function which defaults to null. */
  x1?: number | AccessorForArrayItem<Datum, number>;
  /** Sets the y0 accessor function, and sets y1 to null. */
  y?: number | AccessorForArrayItem<Datum, number>;
  /** Specifies the y0 accessor function which defaults to d => 0. */
  y0?: number | AccessorForArrayItem<Datum, number>;
  /** Specifies the y1 accessor function which defaults to d => d[1]. */
  y1?: number | AccessorForArrayItem<Datum, number>;
};

export type LinePathConfig<Datum> = {
  /** The defined accessor for the shape. The final line shape includes all points for which this function returns true. By default all points are defined. */
  defined?: AccessorForArrayItem<Datum, boolean>;
  /** Sets the curve factory (from @visx/curve or d3-curve) for the line generator. Defaults to curveLinear. */
  curve?: CurveFactory | CurveFactoryLineOnly;
  /** Sets the x0 accessor function, and sets x1 to null. */
  x?: number | AccessorForArrayItem<Datum, number>;
  /** Sets the y0 accessor function, and sets y1 to null. */
  y?: number | AccessorForArrayItem<Datum, number>;
};

export type RenderPathProps<Datum extends object> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataEntry: IDataEntry<Datum, any>;
  scales: IScaleSet;
  theme: XYChartTheme;
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  springConfig: SpringConfig;
  // curve: CurveFactory | CurveFactoryLineOnly;
  color: string;
} & Pick<
  React.SVGProps<SVGPathElement>,
  'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus'
>;

export type RenderAnimatedGlyphProps<Datum extends object> = {
  springValues: SpringValues<GlyphTransition>;
  datum: Datum;
  index: number;
  dataKey: string;
  horizontal: boolean;
  color: string;
  // colorScale: (dataKey: string) => string;
  // colorAccessor?: (datum: Datum, dataKey: string) => string;
};

export interface BasicSeriesProps<Datum extends object> {
  dataKey: string;
  data: readonly Datum[];
  keyAccessor?: (datum: Datum, dataKey?: string) => string | number;
  independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  dependentAccessor?: (datum: Datum) => ScaleInput<AxisScale>;
  alternateDependentAccessor?: (datum: Datum) => ScaleInput<AxisScale>;
  springConfig?: SpringConfig;
  animate?: boolean;
  enableEvents?: boolean;

  /**
   * Callback invoked for onPointerMove events for the nearest Datum to the PointerEvent.
   * By default XYChart will capture and emit PointerEvents, invoking this function for
   * any Series with a defined handler. Alternatively you may set <XYChart captureEvents={false} />
   * and Series will emit their own events.
   */
  onPointerMove?: (
    eventParamsList: /*{
    datum,
    distanceX,
    distanceY,
    event,
    index,
    key,
    svgPoint
  }*/ readonly EventHandlerParams<Datum>[]
  ) => void;
  /**
   * Callback invoked for onPointerOut events. By default XYChart will capture and emit
   * PointerEvents, invoking this function for any Series with a defined handler.
   * Alternatively you may set <XYChart captureEvents={false} /> and Series will emit
   * their own events.
   */
  onPointerOut?: (
    /** The PointerEvent. */
    eventParamsList: PointerEvent
  ) => void;
  /**
   * Callback invoked for onPointerUp events for the nearest Datum to the PointerEvent.
   * By default XYChart will capture and emit PointerEvents, invoking this function for
   * any Series with a defined handler. Alternatively you may set <XYChart captureEvents={false} />
   * and Series will emit their own events.
   */
  onPointerUp?: (
    eventParamsList: /*{
    datum,
    distanceX,
    distanceY,
    event,
    index,
    key,
    svgPoint
  }*/ readonly EventHandlerParams<Datum>[]
  ) => void;
  /**
   * Callback invoked for onFocus events for the nearest Datum to the FocusEvent.
   * XYChart will NOT capture and emit FocusEvents, they are emitted from individual Series glyph shapes.
   */
  onFocus?: (
    events: /*{ datum, distanceX, distanceY, event, index, key, svgPoint }*/ readonly EventHandlerParams<Datum>[]
  ) => void;
  /**
   * Callback invoked for onBlur events for the nearest Datum to the FocusEvent.
   * XYChart will NOT capture and emit FocusEvents, they are emitted from individual Series glyph shapes.
   */
  onBlur?: (
    /** The FocusEvent. */
    event: FocusEvent
  ) => void;
}

export type A11yProps = Partial<
  Pick<SVGProps<Element>, 'role' | 'aria-roledescription' | 'aria-label' | 'aria-labelledby'>
>;
