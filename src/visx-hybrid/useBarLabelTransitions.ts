import { useMemo } from 'react';
import { SpringConfig, useTransition } from 'react-spring';

import { coerceNumber } from './coerceNumber';
import { defaultSmallLabelsFont } from './constants';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { getScaleBandwidth } from './getScaleBandwidth';
import { getScaleBaseline } from './getScaleBaseline';
import { isValidNumber } from './isValidNumber';
import { measureTextWithCache } from './measureTextWithCache';
import type { AxisScale, BarLabelPosition, ScaleInput, TextStyles } from './types';

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
  labelStyles,
  position,
  positionOutsideOnOverflow
}: {
  independentScale: IndependentScale;
  dependentScale: DependentScale;
  independentAccessor: (datum: Datum) => ScaleInput<IndependentScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<DependentScale>;
  horizontal: boolean;
  renderingOffset: number;
  labelStyles?: TextStyles;
  position: BarLabelPosition;
  positionOutsideOnOverflow: boolean;
}): (datum: { datum: Datum; label: string }) => LabelTransitionsProps | null {
  const independentScaleCopy = independentScale.copy();
  const dependentScaleCopy = dependentScale.copy();
  const dependentZeroCoord = getScaleBaseline(dependentScaleCopy);
  const font = labelStyles?.font ?? defaultSmallLabelsFont;
  const fontMetrics = getFontMetricsWithCache(font);

  const getIndependentCoord = (datum: Datum) =>
    coerceNumber(independentScaleCopy(independentAccessor(datum)));
  const getFirstDependentCoord = (_datum: Datum) => dependentZeroCoord;
  const getSecondDependentCoord = (datum: Datum) =>
    coerceNumber(dependentScaleCopy(dependentAccessor(datum)));
  const bandwidth = getScaleBandwidth(independentScaleCopy);

  return (datum: { datum: Datum; label: string }) => {
    // Start coord of the bar on the independent axis.
    const independentRangeValue = getIndependentCoord(datum.datum);
    if (!isValidNumber(independentRangeValue)) {
      // console.log('failed independentRangeValue', datum, getIndependentCoord);
      return null;
    }

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

    const padding = 10;

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
        if (textWidth + padding * 2 > dependentSideLength) {
          opacity = 0;
        }
      } else if (position === 'inside-centered') {
        const isNegative = barLengthWithSign > 0;
        x = secondDependentRangeValue + dependentSideLength * 0.5 * (isNegative ? -1 : 1);
        y = independentOrigin + independentSideCentre;
        if (textWidth + padding * 2 > dependentSideLength) {
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
        if (fontMetrics.height + padding * 2 > dependentSideLength) {
          opacity = 0;
        }
      } else if (position === 'inside-centered') {
        const isNegative = barLengthWithSign > 0;
        x = independentOrigin + independentSideCentre;
        const dependentAdjustment = dependentSideLength * 0.5;
        y = secondDependentRangeValue + dependentAdjustment * (isNegative ? -1 : 1);
        if (fontMetrics.height + padding * 2 > dependentSideLength) {
          opacity = 0;
        }
      }
    }

    return { x, y, opacity };

    // let x1 = horizontal ? dependentOrigin : independentOrigin;
    // let y1 = horizontal ? independentOrigin : dependentOrigin;
    // const width = horizontal ? dependentSideLength : independentSideCentre;
    // const height = horizontal ? independentSideCentre : dependentSideLength;
    // let x2 = x1 + width;
    // let y2 = y1 + height;

    // if (horizontal) {
    //   if (barLengthWithSign >= 0) {
    //     [x1, x2] = [x2, x1];
    //   }
    // } else {
    //   if (barLengthWithSign > 0) {
    //     [y1, y2] = [y2, y1];
    //   }
    // }

    // if (horizontal) {
    //   return { x: x1, y: y2 };
    // } else {
    //   return { x: x2, y: y1 };
    // }
  };
}

export function useBarLabelTransitions<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(args: {
  data: readonly Datum[];
  independentScale: IndependentScale;
  dependentScale: DependentScale;
  keyAccessor: (datum: Datum) => string;
  independentAccessor: (datum: Datum) => ScaleInput<IndependentScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<DependentScale>;
  horizontal: boolean;
  springConfig: Partial<SpringConfig>;
  animate: boolean;
  renderingOffset: number;
  labelFormatter?: (value: ScaleInput<AxisScale>) => string;
  labelStyles?: TextStyles;
  position: BarLabelPosition;
  positionOutsideOnOverflow: boolean;
}) {
  const { data, keyAccessor, springConfig, animate, labelFormatter, dependentAccessor } = args;
  const dataWithLabels = useMemo(
    () =>
      data.map((datum) => ({
        datum,
        label: labelFormatter?.(dependentAccessor(datum)) ?? `${datum}`
      })),
    [data, labelFormatter, dependentAccessor]
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
    keys: (datum) => keyAccessor(datum.datum),
    immediate: !animate
  });
}
