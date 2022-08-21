import { SpringConfig, useTransition } from 'react-spring';

import { Margin } from '@/types';

import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { getRenderingDataWithLabels } from './getRenderingDataWithLabels';
import { isValidNumber } from './isValidNumber';
import { measureTextWithCache } from './measureTextWithCache';
import type { AxisScale, FontProperties, IDataEntry, IScaleSet, LabelTransition, ScaleInput } from './types';

function createLabelPositionerForRenderingData<RenderingDatum extends object = object>({
  dataEntry,
  scales,
  horizontal,
  font,
  padding,
  margin,
  innerHeight
}: {
  dataEntry: IDataEntry;
  scales: IScaleSet;
  horizontal: boolean;
  font: FontProperties | string;
  padding: number;
  margin: Margin;
  innerWidth: number;
  innerHeight: number;
}): (datumWithLabel: { datum: RenderingDatum; label: string }) => LabelTransition | null {
  const independentCenterAccessor = dataEntry.getIndependentCenterAccessor(scales);
  const dependent1Accessor = dataEntry.getDependent1Accessor(scales);

  return ({ datum, label }: { datum: RenderingDatum; label: string }) => {
    const independentCoord = independentCenterAccessor(datum);
    if (!isValidNumber(independentCoord)) {
      return null;
    }
    const dependentCoord = dependent1Accessor(datum);
    if (!isValidNumber(dependentCoord)) {
      return null;
    }

    const textDimension = horizontal
      ? measureTextWithCache(label, font)
      : getFontMetricsWithCache(font).height;
    let dependent = dependentCoord + padding + textDimension * 0.5;
    const maximumAllowedDependent = horizontal ? margin.left + innerWidth : margin.top + innerHeight;
    const isOverflowing = dependent + textDimension * 0.5 > maximumAllowedDependent;
    const opacity = 1;

    if (isOverflowing) {
      dependent = dependentCoord - (padding + textDimension * 0.5);
    }

    return {
      x: horizontal ? dependent : independentCoord,
      y: horizontal ? independentCoord : dependent,
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
  margin: Margin;
  innerWidth: number;
  innerHeight: number;
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
    keys: ({ datum }) => dataEntry.keyAccessor(dataEntry.getOriginalDatumFromRenderingDatum(datum)),
    immediate: !animate
  });
}
