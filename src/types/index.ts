// Same as AxisDomain type from 'd3-axis'.
export type DomainValue = number | string | Date | { valueOf(): number };

// Same as AxisScale from 'd3-axis'.
export interface AxisScale<DomainT> {
  (x: DomainT): number | undefined;
  domain(): DomainT[];
  range(): number[];
  copy(): this;
  bandwidth?(): number;
}

export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export type AxisOrientation = 'top' | 'bottom' | 'left' | 'right';

export type AxisLabelAlign = 'start' | 'center' | 'end';

export type TickLabelOrientation = 'horizontal' | 'vertical' | 'angled';

export type ChartOrientation = 'horizontal' | 'vertical';

export interface CategoryValueDatum<CategoryT extends DomainValue, ValueT extends DomainValue> {
  readonly category: CategoryT;
  readonly value: ValueT;
}

export interface TimeValueDatum<ValueT extends DomainValue> {
  readonly date: Date;
  readonly value: ValueT;
}

export interface CategoryValueListDatum<CategoryT extends DomainValue, ValueT extends DomainValue> {
  readonly category: CategoryT;
  // Limitation here: key is always a string:
  readonly values: { [key: string]: ValueT };
}

export type GetValueListDatumSummaryValue<CategoryT extends DomainValue, ValueT extends DomainValue> = (
  datum: CategoryValueListDatum<CategoryT, ValueT>,
  seriesKeys: readonly string[]
) => number | null | undefined;

export interface PointDatum<DatumT> {
  x: number;
  y: number;
  datum: DatumT;
}

export type Point = [number, number];

/**
 * Defines a chart area within a chart. This is an area that is used to actually
 * display data, e.g., the central area in a bar chart where the bars are rendered.
 */
export interface ChartArea {
  /** The width of the chart area. */
  width: number;
  /** The height of the chart area. */
  height: number;
  /** The x offset from the top left corner of the entire chart to the left edge of the chart area. */
  translateLeft: number;
  /** The x offset from the top left corner of the entire chart to the right edge of the chart area. */
  translateRight: number;
  /** The y offset from the top left corner of the entire chart to the top edge of the chart area. */
  translateTop: number;
  /** The y offset from the top left corner of the entire chart to the bottom edge of the chart area. */
  translateBottom: number;
  /** A range array for the width of the chart area that can be used with a scale. */
  rangeWidth: Point;
  /** A range array for the height of the chart area that can be used with a scale. */
  rangeHeight: Point;
  /**
   * A reversed range array for the height of the chart area that can be used with a scale.
   * This is useful if you need to render a band scale with the categories in reverse order.
   */
  rangeHeightReversed: Point;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ExpandedAxisScale<DomainT extends DomainValue> = AxisScale<DomainT> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ticks?(...args: any[]): DomainT[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tickFormat?(...args: any[]): (datum: DomainT) => string;
};

export interface BaseAxisProps<DomainT extends DomainValue> {
  /**
   * The scale used to render the axis. Required.
   */
  scale: AxisScale<DomainT>;
  /**
   * The position of the axis relative to the chart that it annotates. Required.
   */
  orientation: AxisOrientation;
  /**
   * The chart area around which the axis sits, according to the `orientation` property.
   * Required.
   */
  chartArea: ChartArea;
  /**
   * The offset in pixels. Used to ensure crisp edges on low-resolution devices.
   * Defaults to 0 on devices with a devicePixelRatio greater than 1, and 0.5px otherwise.
   */
  offset?: number | null;
  /**
   * The spacing in pixels between a tick line and its label. Defaults to 3px.
   */
  tickPadding?: number | null;
  /**
   * The length in pixels of the inner tick lines. Defaults to 6px.
   */
  tickSizeInner?: number | null;
  /**
   * The length in pixels of the outer tick lines. Defaults to 6px.
   */
  tickSizeOuter?: number | null;
  /**
   * Sets both `tickSizeInner` and `tickSizeOuter` to the given pixel value.
   */
  tickSize?: number | null;
  /**
   * Sets the arguments that will be passed to scale.ticks and scale.tickFormat
   * when the axis is rendered. If you previously used the `ticks` property on the
   * d3 axis component then use `tickArguments` instead (passing the args as an
   * array).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tickArguments?: any[];
  /**
   * Sets the formatter function. Pass `null` to explicitly use the scale's
   * default formatter. Defaults to the scale's default formatter.
   */
  tickFormat?: (domainValue: DomainT) => string | null;
  /**
   * The ticks values to use for ticks instead of those returned by the scale’s
   * automatic tick generator
   */
  tickValues?: DomainT[] | null;
}
