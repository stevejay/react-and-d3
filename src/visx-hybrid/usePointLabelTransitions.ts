import { SpringConfig, useTransition } from 'react-spring';

import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { getRenderingDataWithLabels } from './getRenderingDataWithLabels';
import { isValidNumber } from './isValidNumber';
import { measureTextWithCache } from './measureTextWithCache';
import type {
  AxisScale,
  FontProperties,
  IChartDimensions,
  IDataEntry,
  IScaleSet,
  LabelTransition,
  ScaleInput
} from './types';

function createLabelPositionerForRenderingData<RenderingDatum extends object = object>({
  dataEntry,
  scales,
  horizontal,
  font,
  padding,
  chartDimensions
}: {
  dataEntry: IDataEntry;
  scales: IScaleSet;
  horizontal: boolean;
  font: FontProperties | string;
  padding: number;
  chartDimensions: IChartDimensions;
}): (datumWithLabel: { datum: RenderingDatum; label: string }) => LabelTransition | null {
  const independentAccessor = dataEntry.getIndependentAccessor(scales, 'center');
  const dependentAccessor = dataEntry.getDependentAccessor(scales);

  return ({ datum, label }: { datum: RenderingDatum; label: string }) => {
    const independentCoord = independentAccessor(datum);
    if (!isValidNumber(independentCoord)) {
      return null;
    }

    const dependentCoord = dependentAccessor(datum);
    if (!isValidNumber(dependentCoord)) {
      return null;
    }

    const textDimension = horizontal
      ? measureTextWithCache(label, font)
      : getFontMetricsWithCache(font).height;
    let adjustedDependentCoord = dependentCoord + padding + textDimension * 0.5;
    const maximumAllowedDependent = horizontal
      ? chartDimensions.chartAreaExcludingRangePadding.x1
      : chartDimensions.chartAreaExcludingRangePadding.y1;
    const isOverflowing = adjustedDependentCoord + textDimension * 0.5 > maximumAllowedDependent;
    const opacity = 1;

    if (isOverflowing) {
      adjustedDependentCoord = dependentCoord - (padding + textDimension * 0.5);
    }

    return {
      x: horizontal ? adjustedDependentCoord : independentCoord,
      y: horizontal ? independentCoord : adjustedDependentCoord,
      opacity
    };
  };
}

/** Positions the text according to a text origin of center horizontal and center vertical. */
export function usePointLabelTransitions(args: {
  dataEntry: IDataEntry;
  scales: IScaleSet;
  horizontal: boolean;
  springConfig: Partial<SpringConfig>;
  animate: boolean;
  renderingOffset: number;
  formatter?: (value: ScaleInput<AxisScale>) => string;
  font: FontProperties | string;
  padding: number;
  chartDimensions: IChartDimensions;
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
