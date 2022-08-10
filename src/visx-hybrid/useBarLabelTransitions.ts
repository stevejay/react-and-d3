import { SpringConfig, useTransition } from 'react-spring';

import type {
  AxisScale,
  FontProperties,
  IDatumEntry,
  InternalBarLabelPosition,
  LabelTransition,
  ScaleInput,
  ScaleSet
} from './types';

export function useBarLabelTransitions(args: {
  dataEntry: IDatumEntry;
  scales: ScaleSet;
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
  const renderingDataWithLabels = dataEntry.getRenderingDataWithLabels(formatter);
  const position = dataEntry.createLabelPositionerForRenderingData(args);
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

    keys: (datum) => dataEntry.keyAccessor(datum.datum),
    immediate: !animate
  });
}
