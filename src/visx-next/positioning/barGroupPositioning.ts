import { ScaleBand } from 'd3-scale';

import { DataRegistry } from '../DataRegistry';
import { getScaleBandwidth, getScaleBaseline } from '../scale';
import { PositionScale } from '../types';
import { isValidNumber } from '../types/typeguards/isValidNumber';

export function createBarGroupPositioning<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>(
  xScale: XScale,
  yScale: YScale,
  groupScale: ScaleBand<string>,
  dataRegistry: Omit<DataRegistry<XScale, YScale, Datum>, 'registry' | 'registryKeys'>,
  horizontal: boolean,
  renderingOffset: number = 0
) {
  const xScaleCopy = xScale.copy();
  const yScaleCopy = yScale.copy();
  const groupScaleCopy = groupScale.copy();

  const xZeroPosition = xScaleCopy ? getScaleBaseline(xScaleCopy) : 0;
  const yZeroPosition = yScaleCopy ? getScaleBaseline(yScaleCopy) : 0;
  const barThickness = getScaleBandwidth(groupScaleCopy);

  return (datum: Datum, dataKey: string) => {
    const registryEntry = dataRegistry.get(dataKey);
    if (!registryEntry) {
      return null;
    }

    const { xAccessor, yAccessor } = registryEntry;

    const getLength = (d: Datum) =>
      horizontal
        ? (xScaleCopy(xAccessor(d)) ?? NaN) - xZeroPosition
        : (yScaleCopy(yAccessor(d)) ?? NaN) - yZeroPosition;

    const getGroupPosition = horizontal
      ? (d: Datum) => yScaleCopy(yAccessor(d)) ?? NaN
      : (d: Datum) => xScaleCopy(xAccessor(d)) ?? NaN;

    const withinGroupPosition = groupScaleCopy(dataKey) ?? 0;

    const getX = horizontal
      ? (d: Datum) => xZeroPosition + Math.min(0, getLength(d))
      : (d: Datum) => getGroupPosition(d) + withinGroupPosition;

    const getY = horizontal
      ? (d: Datum) => getGroupPosition(d) + withinGroupPosition
      : (d: Datum) => yZeroPosition + Math.min(0, getLength(d));

    const getWidth = horizontal ? (d: Datum) => Math.abs(getLength(d)) : () => barThickness;
    const getHeight = horizontal ? () => barThickness : (d: Datum) => Math.abs(getLength(d));

    const barX = getX(datum);
    if (!isValidNumber(barX)) {
      return null;
    }

    const barY = getY(datum);
    if (!isValidNumber(barY)) {
      return null;
    }

    const barWidth = getWidth(datum);
    if (!isValidNumber(barWidth)) {
      return null;
    }

    const barHeight = getHeight(datum);
    if (!isValidNumber(barHeight)) {
      return null;
    }

    return {
      x: barX,
      y: barY,
      width: barWidth,
      height: barHeight
    };
  };
}
