import { ReactNode, useMemo } from 'react';
import { animated, SpringConfig } from 'react-spring';

import { getChildrenAndGrandchildrenWithProps } from './getChildrenAndGrandchildrenWithProps';
import { isDefined } from './isDefined';
import { useSeriesTransitions } from './useSeriesTransitions';
import { useXYChartContext } from './useXYChartContext';

type SVGBarStackLabelsProps = {
  springConfig?: SpringConfig;
  animate?: boolean;
  children?: ReactNode;
};

export function SVGBarStackLabels({ children, springConfig, animate = true }: SVGBarStackLabelsProps) {
  const { springConfig: contextSpringConfig, animate: contextAnimate, dataEntryStore } = useXYChartContext();
  const seriesChildren = useMemo(
    () => getChildrenAndGrandchildrenWithProps<{ dataKeyRef: string }>(children),
    [children]
  );
  const dataKeys = seriesChildren.map((child) => child.props.dataKeyRef).filter(isDefined);
  const transitions = useSeriesTransitions(
    dataKeys.map((dataKey) => dataEntryStore.getByDataKey(dataKey)),
    springConfig ?? contextSpringConfig,
    animate && contextAnimate
  );
  return (
    <>
      {transitions((styles, datum) => {
        const child = seriesChildren.find((child) => child.props.dataKeyRef === datum.dataKey);
        if (!child) {
          return null;
        }
        return (
          <animated.g data-testid={`stack-series-labels-${datum.dataKey}`} style={styles}>
            {child}
          </animated.g>
        );
      })}
    </>
  );
}
