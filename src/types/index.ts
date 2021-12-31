import type { AxisDomain, AxisScale } from 'd3';

export type Margins = { top: number; bottom: number; left: number; right: number };

export type AxisOrientation = 'top' | 'bottom' | 'left' | 'right';

export type ChartOrientation = 'vertical' | 'horizontal';

export type AxisLabelOrientation = 'horizontal' | 'vertical' | 'angled';

export type BarChartDatum<CategoryT extends AxisDomain> = {
  category: CategoryT;
  value: number;
};

export type ChartArea = {
  width: number;
  height: number;
  translateX: number;
  translateY: number;
  xRange: readonly [number, number];
  yRange: readonly [number, number];
};

export type ExpandedAxisScale<Domain extends AxisDomain> = AxisScale<Domain> & {
  ticks?(...args: any[]): Domain[];
  tickFormat?(...args: any[]): (d: Domain) => string;
};

export type DefaultAxisProps<Domain extends AxisDomain> = {
  /**
   * The scale used to render the axis. Required.
   */
  scale: AxisScale<Domain>;
  /**
   * The position of the axis relative to the chart that it annotates. Required.
   */
  orientation: AxisOrientation;
  /*
   * The horizontal distance in pixels to translate the axis by, relative to the
   * SVG's origin.  Required.
   */
  translateX: number;
  /*
   * The vertical distance in pixels to translate the axis by, relative to the
   * SVG's origin.  Required.
   */
  translateY: number;
  /**
   * The offset in pixels. Used to ensure crisp edges on low-resolution devices.
   * Defaults to 0 on devices with a devicePixelRatio greater than 1, and 0.5px otherwise.
   */
  offset?: number | null;
  /**
   * The spacing in pixels between a ticks and its label. Defaults to 3px.
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
  tickFormat?: (domainValue: Domain, index: number) => string | null;
  /**
   * The ticks values to use for ticks instead of those returned by the scale’s
   * automatic tick generator
   */
  tickValues?: Domain[] | null;
};
