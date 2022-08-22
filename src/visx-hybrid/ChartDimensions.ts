import type { ChartArea, IChartDimensions, Margin } from './types';

export class ChartDimensions implements IChartDimensions {
  _width: number;
  _height: number;
  _horizontal: boolean;
  _chartAreaExcludingRangePadding: ChartArea;
  _chartAreaIncludingRangePadding: ChartArea;
  _outerMarginArea: ChartArea;

  constructor({
    width,
    height,
    horizontal,
    margin,
    outerMargin,
    independentRangePadding,
    dependentRangePadding
  }: {
    width: number;
    height: number;
    horizontal: boolean;
    margin: Margin;
    outerMargin: Margin;
    independentRangePadding: [number, number];
    dependentRangePadding: [number, number];
  }) {
    this._width = width;
    this._height = height;
    this._horizontal = horizontal;

    this._chartAreaExcludingRangePadding = {
      x: margin.left,
      x1: width - margin.right,
      y: margin.top,
      y1: height - margin.bottom,
      width: Math.max(0, width - margin.left - margin.right),
      height: Math.max(0, width - margin.top - margin.bottom)
    };

    const xRangePadding = horizontal ? dependentRangePadding : independentRangePadding;
    const yRangePadding = horizontal ? independentRangePadding : dependentRangePadding;

    this._chartAreaIncludingRangePadding = {
      x: this._chartAreaExcludingRangePadding.x + xRangePadding[0],
      x1: this._chartAreaExcludingRangePadding.x1 - xRangePadding[1],
      y: this._chartAreaExcludingRangePadding.y + yRangePadding[0],
      y1: this._chartAreaExcludingRangePadding.y1 - yRangePadding[1],
      width: Math.max(this._chartAreaExcludingRangePadding.width - xRangePadding[0] - xRangePadding[1]),
      height: Math.max(this._chartAreaExcludingRangePadding.height - yRangePadding[0] - yRangePadding[1])
    };

    this._outerMarginArea = {
      x: outerMargin.left,
      x1: width - outerMargin.right,
      y: outerMargin.top,
      y1: height - outerMargin.bottom,
      width: Math.max(0, width - outerMargin.left - outerMargin.right),
      height: Math.max(0, height - outerMargin.top - outerMargin.bottom)
    };
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get chartAreaExcludingRangePadding(): ChartArea {
    return this._chartAreaExcludingRangePadding;
  }

  get chartAreaIncludingRangePadding(): ChartArea {
    return this._chartAreaIncludingRangePadding;
  }

  get outerMarginArea(): ChartArea {
    return this._outerMarginArea;
  }
}
