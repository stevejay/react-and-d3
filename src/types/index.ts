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

export type Margins = { top: number; bottom: number; left: number; right: number };

export type AxisOrientation = 'top' | 'bottom' | 'left' | 'right';

export type AxisLabelAlign = 'start' | 'center' | 'end';

export type TickLabelOrientation = 'horizontal' | 'vertical' | 'angled';

export type ChartOrientation = 'horizontal' | 'vertical';

export type CategoryValueDatum<CategoryT extends DomainValue, ValueT extends DomainValue> = {
  readonly category: CategoryT;
  readonly value: ValueT;
};

// Limitation here: key is always a string.
export type CategoryValueListDatum<CategoryT extends DomainValue, ValueT extends DomainValue> = {
  readonly category: CategoryT;
  readonly values: { [key: string]: ValueT };
};

export type ChartArea = {
  width: number;
  height: number;
  translateLeft: number;
  translateRight: number;
  translateTop: number;
  translateBottom: number;
  xRange: readonly [number, number]; // TODO rename these to rangeWidth,rangeHeight ?
  yRange: readonly [number, number];
  yRangeReversed: readonly [number, number];
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ExpandedAxisScale<DomainT extends DomainValue> = AxisScale<DomainT> & {
  ticks?(...args: any[]): DomainT[];
  tickFormat?(...args: any[]): (d: DomainT) => string;
};

export type BaseAxisProps<DomainT extends DomainValue> = {
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
  tickArguments?: any[];
  /**
   * Sets the formatter function. Pass `null` to explicitly use the scale's
   * default formatter. Defaults to the scale's default formatter.
   */
  tickFormat?: (domainValue: DomainT, index: number) => string | null;
  /**
   * The ticks values to use for ticks instead of those returned by the scale’s
   * automatic tick generator
   */
  tickValues?: DomainT[] | null;
};
