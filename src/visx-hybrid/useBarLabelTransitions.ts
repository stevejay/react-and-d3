import { SpringConfig, useTransition } from 'react-spring';

import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { getRenderingDataWithLabels } from './getRenderingDataWithLabels';
import { isValidNumber } from './isValidNumber';
import { measureTextWithCache } from './measureTextWithCache';
import type {
  AxisScale,
  FontProperties,
  IDataEntry,
  InternalBarLabelPosition,
  IScaleSet,
  LabelTransition,
  ScaleInput
} from './types';

function createLabelPositionerForRenderingData<RenderingDatum extends object = object>({
  dataEntry,
  scales,
  horizontal,
  font,
  position,
  positionOutsideOnOverflow,
  padding,
  hideOnOverflow
}: {
  dataEntry: IDataEntry;
  scales: IScaleSet;
  horizontal: boolean;
  font: FontProperties | string;
  position: InternalBarLabelPosition;
  positionOutsideOnOverflow: boolean;
  padding: number;
  hideOnOverflow: boolean;
}): (datumWithLabel: { datum: RenderingDatum; label: string }) => LabelTransition | null {
  const startIndependentAccessor = dataEntry.getIndependentAccessor(scales, 'start');
  const endIndependentAccessor = dataEntry.getIndependentAccessor(scales, 'end');
  const baselineDependentAccessor = dataEntry.getBaselineDependentAccessor(scales);
  const dependentAccessor = dataEntry.getDependentAccessor(scales);

  return ({ datum, label }: { datum: RenderingDatum; label: string }) => {
    const startIndependentCoord = startIndependentAccessor(datum);
    if (!isValidNumber(startIndependentCoord)) {
      return null;
    }
    const endIndependentCoord = endIndependentAccessor(datum);
    if (!isValidNumber(endIndependentCoord)) {
      return null;
    }
    const baselineDependentCoord = baselineDependentAccessor(datum);
    if (!isValidNumber(baselineDependentCoord)) {
      return null;
    }
    const dependentCoord = dependentAccessor(datum);
    if (!isValidNumber(dependentCoord)) {
      return null;
    }

    const dependentLengthWithSign = dependentCoord - baselineDependentCoord;
    const isZeroOrNegative = horizontal ? dependentLengthWithSign >= 0 : dependentLengthWithSign > 0;
    const dependentLength = Math.abs(dependentLengthWithSign);

    const textDependentDimension = horizontal
      ? measureTextWithCache(label, font)
      : getFontMetricsWithCache(font).height;
    const isOverflowing = textDependentDimension + padding * 2 > dependentLength;
    const independent = startIndependentCoord + (endIndependentCoord - startIndependentCoord) * 0.5;

    let dependent = 0;
    let opacity = 1;

    if (position === 'outside' || (positionOutsideOnOverflow && isOverflowing)) {
      dependent = dependentCoord + (textDependentDimension * 0.5 + padding) * (isZeroOrNegative ? 1 : -1);
    } else {
      if (position === 'inside') {
        dependent = dependentCoord + (textDependentDimension * 0.5 + padding) * (isZeroOrNegative ? -1 : 1);
      } else {
        dependent = dependentCoord + dependentLength * 0.5 * (isZeroOrNegative ? -1 : 1);
      }
      if (hideOnOverflow && isOverflowing) {
        opacity = 0;
      }
    }

    return { x: horizontal ? dependent : independent, y: horizontal ? independent : dependent, opacity };
  };
}

export function useBarLabelTransitions(args: {
  dataEntry: IDataEntry;
  scales: IScaleSet;
  horizontal: boolean;
  springConfig: Partial<SpringConfig>;
  animate: boolean;
  renderingOffset: number;
  formatter?: (value: ScaleInput<AxisScale>) => string;
  font: FontProperties | string;
  position: InternalBarLabelPosition;
  positionOutsideOnOverflow: boolean;
  padding: number;
  hideOnOverflow: boolean;
  hideZero: boolean;
}) {
  const { dataEntry, hideZero, springConfig, animate, formatter } = args;
  const renderingDataWithLabels = getRenderingDataWithLabels(dataEntry, hideZero, formatter);
  const position = createLabelPositionerForRenderingData(args);
  return useTransition<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any, // TODO fix
    LabelTransition
  >(renderingDataWithLabels, {
    initial: (datum) => ({ ...position(datum) }),
    from: (datum) => ({ ...position(datum), opacity: 0 }), // 'opacity: 0' deliberately overrides the position's opacity.
    enter: (datum) => ({ ...position(datum) }),
    update: (datum) => ({ ...position(datum) }),
    leave: () => ({ opacity: 0 }),
    config: springConfig,
    keys: ({ datum }) => dataEntry.getTransitionKey(datum),
    immediate: !animate
  });
}
