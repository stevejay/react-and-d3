import type { SVGProps } from 'react';
import { SpringConfig } from 'react-spring';

import { defaultDatumLabelPadding, defaultSmallLabelsFont } from './constants';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { SVGAnimatedSimpleText } from './SVGSimpleText';
import type { AxisScale, ScaleInput } from './types';
import { usePointLabelTransitions } from './usePointLabelTransitions';
import { useXYChartContext } from './useXYChartContext';

export type SVGPointSeriesLabelsProps = {
  springConfig?: SpringConfig;
  animate?: boolean;
  dataKeyRef: string;
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  /** Must be a stable function. */
  formatter?: (value: ScaleInput<AxisScale>) => string;
  padding?: number;
};

export function SVGPointSeriesLabels({
  groupProps,
  springConfig,
  animate = true,
  dataKeyRef,
  formatter,
  padding = defaultDatumLabelPadding
}: SVGPointSeriesLabelsProps) {
  const {
    scales,
    horizontal,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntryStore,
    theme,
    chartDimensions
  } = useXYChartContext();
  const dataEntry = dataEntryStore.getByDataKey(dataKeyRef);
  const labelStyles = theme.datumLabels ?? theme.smallLabels;
  const { font = defaultSmallLabelsFont, ...otherLabelStyles } = labelStyles ?? {};
  const fontMetrics = getFontMetricsWithCache(font);
  const transitions = usePointLabelTransitions({
    dataEntry,
    scales,
    horizontal,
    springConfig: springConfig ?? contextSpringConfig,
    animate: animate && contextAnimate,
    renderingOffset,
    formatter,
    font,
    padding,
    chartDimensions
  });
  return (
    <g data-testid={`series-labels-${dataKeyRef}`} {...groupProps}>
      {transitions((styles, datum) => (
        <SVGAnimatedSimpleText
          springValues={styles}
          textAnchor="middle"
          verticalAnchor="middle"
          fontHeight={fontMetrics.height}
          fontHeightFromBaseline={fontMetrics.heightFromBaseline}
          textStyles={labelStyles}
          fill="currentColor"
          {...otherLabelStyles}
        >
          {datum.label}
        </SVGAnimatedSimpleText>
      ))}
    </g>
  );
}
