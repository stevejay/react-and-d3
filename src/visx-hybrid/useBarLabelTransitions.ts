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
  const independent0Accessor = dataEntry.getIndependent0Accessor(scales);
  const independent1Accessor = dataEntry.getIndependent1Accessor(scales);
  const dependent0Accessor = dataEntry.getDependent0Accessor(scales);
  const dependent1Accessor = dataEntry.getDependent1Accessor(scales);

  return ({ datum, label }: { datum: RenderingDatum; label: string }) => {
    const independentStartCoord = independent0Accessor(datum);
    if (!isValidNumber(independentStartCoord)) {
      return null;
    }
    const independentEndCoord = independent1Accessor(datum);
    if (!isValidNumber(independentEndCoord)) {
      return null;
    }
    const dependentStartCoord = dependent0Accessor(datum);
    if (!isValidNumber(dependentStartCoord)) {
      return null;
    }
    const dependentEndCoord = dependent1Accessor(datum);
    if (!isValidNumber(dependentEndCoord)) {
      return null;
    }

    const dependentLengthWithSign = dependentEndCoord - dependentStartCoord;
    const isNegative = dependentLengthWithSign > 0;
    const dependentLength = Math.abs(dependentLengthWithSign);
    const textDimension = horizontal
      ? measureTextWithCache(label, font)
      : getFontMetricsWithCache(font).height;
    const isOverflowing = textDimension + padding * 2 > dependentLength;
    const independent = independentStartCoord + (independentEndCoord - independentStartCoord) * 0.5;
    let dependent = 0;
    let opacity = 1;

    if (position === 'outside' || (positionOutsideOnOverflow && isOverflowing)) {
      dependent = dependentEndCoord + (textDimension * 0.5 + padding) * (isNegative ? 1 : -1);
    } else {
      if (position === 'inside') {
        dependent = dependentEndCoord + (textDimension * 0.5 + padding) * (isNegative ? -1 : 1);
      } else {
        dependent = dependentEndCoord + dependentLength * 0.5 * (isNegative ? -1 : 1);
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
}) {
  const { dataEntry, springConfig, animate, formatter } = args;
  const renderingDataWithLabels = getRenderingDataWithLabels(dataEntry, formatter);
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
