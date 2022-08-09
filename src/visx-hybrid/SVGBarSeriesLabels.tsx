import type { SVGProps } from 'react';
import { SpringConfig } from 'react-spring';

import { defaultDatumLabelPadding, defaultSmallLabelsFont } from './constants';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { SVGAnimatedSimpleText } from './SVGSimpleText';
import type { AxisScale, BarLabelPosition, ScaleInput } from './types';
import { useBarLabelTransitions } from './useBarLabelTransitions';
import { useXYChartContext } from './useXYChartContext';

export type SVGBarSeriesLabelsProps = {
  springConfig?: SpringConfig;
  animate?: boolean;
  dataKeyRef: string;
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  /** Must be a stable function. */
  formatter?: (value: ScaleInput<AxisScale>) => string;
  /** Optional; defaults to `'inside'`. Ignored if `labelFormatter` prop is not given. */
  position?: BarLabelPosition;
  /** Optional; defaults to `true`. Ignored if `labelFormatter` prop is not given. */
  positionOutsideOnOverflow?: boolean;
  hideOnOverflow?: boolean;
  padding?: number;
};

export function SVGBarSeriesLabels({
  groupProps,
  springConfig,
  animate = true,
  dataKeyRef,
  formatter,
  position = 'inside',
  positionOutsideOnOverflow = true,
  hideOnOverflow = false,
  padding = defaultDatumLabelPadding
}: SVGBarSeriesLabelsProps) {
  const {
    scales,
    horizontal,
    renderingOffset,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    dataEntryStore,
    theme
  } = useXYChartContext();
  const dataEntry = dataEntryStore.getByDataKey(dataKeyRef);
  const labelStyles = theme.datumLabels ?? theme.smallLabels;
  const { font = defaultSmallLabelsFont, ...otherLabelStyles } = labelStyles ?? {};
  const fontMetrics = getFontMetricsWithCache(font);
  const transitions = useBarLabelTransitions({
    dataEntry,
    scales,
    horizontal,
    springConfig: springConfig ?? contextSpringConfig,
    animate: animate && contextAnimate,
    renderingOffset,
    formatter,
    font,
    position,
    positionOutsideOnOverflow,
    hideOnOverflow,
    padding
  });
  return (
    <g data-testid={`bar-series-${dataKeyRef}-labels`} {...groupProps}>
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
