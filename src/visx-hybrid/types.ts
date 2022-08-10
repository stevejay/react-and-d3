import type { CSSProperties, FocusEvent, PointerEvent, ReactNode, SVGAttributes, SVGProps } from 'react';
import type { SpringConfig, SpringValues } from 'react-spring';
import type { D3Scale, ScaleInput, ScaleTypeToD3Scale } from '@visx/scale';
import type { ScaleBand } from 'd3-scale';
import type { Series, SeriesPoint } from 'd3-shape';

export type { ScaleConfig, ScaleConfigToD3Scale, ScaleInput } from '@visx/scale';

/** A value that has .valueOf() function */
export type NumberLike = { valueOf(): number };

export type AxisScaleOutput = number | NumberLike | undefined;

/** A catch-all type for scales that are compatible with axis */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AxisScale<Output extends AxisScaleOutput = AxisScaleOutput> = D3Scale<Output, any, any>;

// /** A catch-all type for scales that returns number */
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export type PositionScale = D3Scale<number, any, any>;

export type Anchor = 'start' | 'middle' | 'end';

export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

// /** Horizontal text anchor. */
// export type TextAnchor = 'start' | 'middle' | 'end' | 'inherit';

// /** Vertical text anchor. */
// export type VerticalTextAnchor = 'start' | 'middle' | 'end';

// export interface DataEntry<
//   IndependentScale extends AxisScale,
//   DependentScale extends AxisScale,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   Datum = any,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   OriginalDatum = any
// > {
//   dataKey: string;
//   data: readonly Datum[];
//   independentAccessor: (datum: Datum) => ScaleInput<IndependentScale>;
//   dependentAccessor: (datum: Datum) => ScaleInput<DependentScale>;

//   /** Legend shape for the data key. */
//   // legendShape?: LegendShape;

//   transformation: 'none' | 'stacked' | 'grouped';
//   underlyingDatumAccessor: (datum: Datum) => OriginalDatum; // change to underlying.datumAccessor + transformation?
//   underlying: {
//     /** function that returns the key value of a datum. */
//     keyAccessor: (datum: OriginalDatum, dataKey?: string) => string;
//     independentAccessor: (datum: OriginalDatum) => ScaleInput<IndependentScale>;
//     dependentAccessor: (datum: OriginalDatum) => ScaleInput<DependentScale>;
//     /** function that returns the color value of a datum. */
//     colorAccessor?: (datum: OriginalDatum, dataKey: string) => string;
//   };
// }

export interface IDatumEntry {
  get dataKey(): string;
  // TODO fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get data(): readonly any[];
  // TODO fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get keyAccessor(): (datum: any) => string | number;
  // TODO fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get colorAccessor(): (datum: any, dataKey: string) => string;
  // TODO fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get independentAccessor(): (datum: any) => ScaleInput<AxisScale>;
  // TODO fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get dependentAccessor(): (datum: any) => ScaleInput<AxisScale>;
  // TODO fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get nearestDatumIndependentAccessor(): (datum: any) => ScaleInput<AxisScale>;
  // TODO fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get nearestDatumDependentAccessor(): (datum: any) => ScaleInput<AxisScale>;

  getDataWithDatumLabels(labelFormatter?: (value: ScaleInput<AxisScale>) => string): {
    // TODO fix any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    datum: any;
    label: string;
  }[];
  getIndependentDomainValues(): readonly ScaleInput<AxisScale>[];
  getDependentDomainValues(): readonly ScaleInput<AxisScale>[];
  createDatumPositioner(args: {
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
    // TODO fix any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): (datum: any) => {
    baselineX: number;
    baselineY: number;
    datumX: number;
    datumY: number;
  } | null;
  createDatumLabelPositioner(args: {
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
    font: FontProperties | string;
    position: InternalBarLabelPosition;
    positionOutsideOnOverflow: boolean;
    padding: number;
    hideOnOverflow: boolean;
    // TODO fix any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): (datumWithLabel: { datum: any; label: string }) => LabelTransition | null;
  // TODO fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMatchingDataForA11ySeries(independentDomainValue: ScaleInput<AxisScale>): readonly any[];
  // TODO fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findDatumForPositioner(datum: any): any | null;
  findNearestDatum(args: {
    horizontal: boolean;
    width: number;
    height: number;
    point: Point;
    scales: ScaleSet;
    // TODO fix any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): NearestDatumReturnType<any> | null;
}

export interface IDataEntryStore {
  getByDataKey(dataKey: string): IDatumEntry;
  tryGetByDataKey(dataKey: string): IDatumEntry | null;
  getAllDataKeys(): readonly string[];
}

export interface ScaleSet {
  independent: AxisScale;
  dependent: AxisScale;
  group: readonly ScaleBand<string>[];
  color: ScaleTypeToD3Scale<string, string>['ordinal'];
}

export interface XYChartContextType {
  scales: ScaleSet;
  // independentScale: IndependentScale;
  // dependentScale: DependentScale;
  // groupScales: readonly ScaleBand<string>[];
  // colorScale: ScaleTypeToD3Scale<string, string>['ordinal'];
  independentRangePadding: number;
  dependentRangePadding: number;
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: Margin;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // dataEntries: readonly DataEntry<IndependentScale, DependentScale, any, any>[];
  dataEntryStore: IDataEntryStore;
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
export type Variable = 'independent' | 'dependent';
export type LabelAngle = 'horizontal' | 'vertical';
export type TickLabelAngle = 'horizontal' | 'angled' | 'vertical';

/** Arguments for findNearestDatum* functions. */
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

export type AxisOrientation = 'top' | 'bottom' | 'left' | 'right';

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

export type TooltipContextType<Datum extends object> = UseTooltipParams<TooltipData<Datum>> & {
  showTooltip: (eventParamsList: readonly EventHandlerParams<Datum>[]) => void;
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

  keyAccessor: (datum: Datum, dataKey?: string) => string;
  /** Given a Datum, returns the x-scale value. */
  xAccessor: (datum: Datum) => ScaleInput<XScale>;
  /** Given a Datum, returns the y-scale value. */
  yAccessor: (datum: Datum) => ScaleInput<YScale>;

  colorAccessor?: (datum: Datum, dataKey: string) => string;
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
  /** Whether the Series emits and subscribes to PointerEvents and FocusEvents (including Tooltip triggering). */
  enableEvents?: boolean;
}

export type SVGTextProps = SVGAttributes<SVGTextElement>;
export type LineProps = Omit<SVGProps<SVGLineElement>, 'to' | 'from' | 'ref'>;
export type RectProps = Omit<SVGProps<SVGRectElement>, 'ref'>;

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

export interface PolygonTransition {
  points: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

export interface SVGBarProps<Datum extends object> {
  springValues: SpringValues<PolygonTransition>;
  datum: Datum;
  index: number;
  dataKey: string;
  horizontal: boolean;
  colorScale: (dataKey: string) => string;
  colorAccessor?: (datum: Datum, dataKey: string) => string;
}

export type BarLabelPosition = 'outside' | 'inside' | 'inside-centered';
export type InternalBarLabelPosition = 'outside' | 'inside' | 'inside-centered' | 'stacked';

export interface LabelTransition {
  x: number;
  y: number;
  opacity: number;
}