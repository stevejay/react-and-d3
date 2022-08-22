import type { ChartArea } from './types';

/** Calculates the independent range for a scale. */
export function getIndependentRange(chartArea: ChartArea, horizontal: boolean): [number, number] {
  return horizontal ? [chartArea.y1, chartArea.y] : [chartArea.x, chartArea.x1];
}

/** Calculates the dependent range for a scale. */
export function getDependentRange(chartArea: ChartArea, horizontal: boolean): [number, number] {
  return horizontal ? [chartArea.x, chartArea.x1] : [chartArea.y1, chartArea.y];
}
