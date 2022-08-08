import { useMemo } from 'react';
import { SpringConfig, useTransition } from 'react-spring';
import type { ScaleBand } from 'd3-scale';

import { coerceNumber } from './coerceNumber';
import { defaultDatumLabelPadding, defaultSmallLabelsFont } from './constants';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { getFirstItem, getSecondItem } from './getItem';
import { getScaleBandwidth } from './getScaleBandwidth';
import { getScaleBaseline } from './getScaleBaseline';
import { isValidNumber } from './isValidNumber';
import { measureTextWithCache } from './measureTextWithCache';
import type { AxisScale, FontProperties, InternalBarLabelPosition, ScaleInput } from './types';

export interface LabelTransitionsProps {
  x: number;
  y: number;
  opacity: number;
}

function createBarSeriesLabelPositioning<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>({
  independentScale,
  dependentScale,
  independentAccessor,
  dependentAccessor,
  horizontal,
  renderingOffset,
  position,
  positionOutsideOnOverflow,
  font = defaultSmallLabelsFont,
  groupScale,
  dataKey,
  padding = defaultDatumLabelPadding,
  hideOnOverflow
}: {
  independentScale: IndependentScale;
  dependentScale: DependentScale;
  independentAccessor: (datum: Datum) => ScaleInput<IndependentScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<DependentScale>;
  horizontal: boolean;
  renderingOffset: number;
  font?: FontProperties | string;
  position: InternalBarLabelPosition;
  positionOutsideOnOverflow: boolean;
  groupScale?: ScaleBand<string>;
  dataKey: string;
  padding?: number;
  hideOnOverflow: boolean;
}): (datum: { datum: Datum; label: string }) => LabelTransitionsProps | null {
  const independentScaleCopy = independentScale.copy();
  const dependentScaleCopy = dependentScale.copy();
  const groupScaleCopy = groupScale ? groupScale.copy() : null;
  const dependentZeroCoord = getScaleBaseline(dependentScaleCopy);
  const fontMetrics = getFontMetricsWithCache(font);

  const getIndependentCoord = (datum: Datum) =>
    coerceNumber(independentScaleCopy(independentAccessor(datum)));
  const getFirstDependentCoord = (_datum: Datum) => dependentZeroCoord;
  const getSecondDependentCoord = (datum: Datum) =>
    coerceNumber(dependentScaleCopy(dependentAccessor(datum)));
  const bandwidth = getScaleBandwidth(groupScaleCopy ?? independentScaleCopy);
  const withinGroupPosition = groupScaleCopy ? groupScaleCopy(dataKey) ?? 0 : 0;

  return (datum: { datum: Datum; label: string }) => {
    // Start coord of the bar on the independent axis.
    let independentRangeValue = getIndependentCoord(datum.datum);
    if (!isValidNumber(independentRangeValue)) {
      // console.log('failed independentRangeValue', datum, getIndependentCoord);
      return null;
    }
    independentRangeValue += withinGroupPosition;

    // Coord of the bar's origin value on the dependent axis.
    const firstDependentRangeValue = getFirstDependentCoord(datum.datum);
    if (!isValidNumber(firstDependentRangeValue)) {
      return null;
    }

    // Coord of the bar's value on the dependent axis.
    const secondDependentRangeValue = getSecondDependentCoord(datum.datum);
    if (!isValidNumber(secondDependentRangeValue)) {
      return null;
    }

    // Length of the bar relative to the coord of zero (or equivalent) on the dependent axis.
    const barLengthWithSign = secondDependentRangeValue - firstDependentRangeValue;
    if (!isValidNumber(barLengthWithSign)) {
      return null;
    }

    const independentOrigin = independentRangeValue + renderingOffset;
    // const dependentOrigin = firstDependentRangeValue + Math.min(0, barLengthWithSign);
    const independentSideCentre = bandwidth * 0.5;
    const dependentSideLength = Math.abs(barLengthWithSign);

    let x = 0;
    let y = 0;
    let opacity = 1;

    if (horizontal) {
      const textWidth = measureTextWithCache(datum.label, font);

      if (
        position === 'outside' ||
        ((position === 'inside' || position === 'inside-centered') &&
          positionOutsideOnOverflow &&
          textWidth + padding * 2 > dependentSideLength)
      ) {
        const isNegative = barLengthWithSign > 0;
        x = secondDependentRangeValue + (textWidth * 0.5 + padding) * (isNegative ? 1 : -1);
        y = independentOrigin + independentSideCentre;
      } else if (position === 'inside') {
        const isNegative = barLengthWithSign > 0;
        x = secondDependentRangeValue + (textWidth * 0.5 + padding) * (isNegative ? -1 : 1);
        y = independentOrigin + independentSideCentre;
        if (hideOnOverflow && textWidth + padding * 2 > dependentSideLength) {
          opacity = 0;
        }
      } else if (position === 'inside-centered') {
        const isNegative = barLengthWithSign > 0;
        x = secondDependentRangeValue + dependentSideLength * 0.5 * (isNegative ? -1 : 1);
        y = independentOrigin + independentSideCentre;
        if (hideOnOverflow && textWidth + padding * 2 > dependentSideLength) {
          opacity = 0;
        }
      }
    } else {
      if (
        position === 'outside' ||
        ((position === 'inside' || position === 'inside-centered') &&
          positionOutsideOnOverflow &&
          fontMetrics.height + padding * 2 > dependentSideLength)
      ) {
        const isNegative = barLengthWithSign > 0;
        x = independentOrigin + independentSideCentre;
        const dependentAdjustment = fontMetrics.height * 0.5;
        y = secondDependentRangeValue + (dependentAdjustment + padding) * (isNegative ? 1 : -1);
      } else if (position === 'inside') {
        const isNegative = barLengthWithSign > 0;
        x = independentOrigin + independentSideCentre;
        const dependentAdjustment = fontMetrics.height * 0.5;
        y = secondDependentRangeValue + (dependentAdjustment + padding) * (isNegative ? -1 : 1);
        if (hideOnOverflow && fontMetrics.height + padding * 2 > dependentSideLength) {
          opacity = 0;
        }
      } else if (position === 'inside-centered') {
        const isNegative = barLengthWithSign > 0;
        x = independentOrigin + independentSideCentre;
        const dependentAdjustment = dependentSideLength * 0.5;
        y = secondDependentRangeValue + dependentAdjustment * (isNegative ? -1 : 1);
        if (hideOnOverflow && fontMetrics.height + padding * 2 > dependentSideLength) {
          opacity = 0;
        }
      } else if (position === 'stacked') {
        x = independentOrigin + independentSideCentre;
        y = secondDependentRangeValue;
        if (
          hideOnOverflow &&
          // TODO fix anys
          fontMetrics.height + padding * 2 >
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Math.abs(getSecondItem(datum.datum as any) - getFirstItem(datum.datum as any))
        ) {
          opacity = 0;
        }
      }
    }

    return { x, y, opacity };
  };
}

export function useBarLabelTransitions<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object,
  OriginalDatum extends object
>(args: {
  data: readonly Datum[];
  independentScale: IndependentScale;
  dependentScale: DependentScale;
  keyAccessor: (datum: OriginalDatum) => string;
  independentAccessor: (datum: Datum) => ScaleInput<IndependentScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<DependentScale>;
  underlyingDatumAccessor: (datum: Datum) => OriginalDatum;
  underlyingDependentAccessor: (datum: OriginalDatum) => ScaleInput<IndependentScale>;
  dataKey: string;
  horizontal: boolean;
  springConfig: Partial<SpringConfig>;
  animate: boolean;
  renderingOffset: number;
  labelFormatter?: (value: ScaleInput<AxisScale>) => string;
  font?: FontProperties | string;
  position: InternalBarLabelPosition;
  positionOutsideOnOverflow: boolean;
  groupScale?: ScaleBand<string>;
  padding?: number;
  hideOnOverflow: boolean;
}) {
  const {
    data,
    keyAccessor,
    springConfig,
    animate,
    labelFormatter,
    underlyingDatumAccessor,
    underlyingDependentAccessor
  } = args;
  const dataWithLabels = useMemo(
    () =>
      data.map((datum) => ({
        datum,
        label: labelFormatter?.(underlyingDependentAccessor(underlyingDatumAccessor(datum))) ?? `${datum}`
      })),
    [data, labelFormatter, underlyingDependentAccessor, underlyingDatumAccessor]
  );
  const position = createBarSeriesLabelPositioning(args);
  return useTransition<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any, // TODO fix
    LabelTransitionsProps
  >(dataWithLabels, {
    initial: (datum) => ({ ...position(datum) }),
    from: (datum) => ({ ...position(datum), opacity: 0 }),
    enter: (datum) => ({ ...position(datum) }),
    update: (datum) => ({ ...position(datum) }),
    leave: () => ({ opacity: 0 }),
    config: springConfig,
    // keys: (datum) => keyAccessor(datum.datum),
    keys: (datum) => keyAccessor(underlyingDatumAccessor(datum.datum)),
    immediate: !animate
  });
}
