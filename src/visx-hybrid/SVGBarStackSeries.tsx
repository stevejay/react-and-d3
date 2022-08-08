import { SpringConfig } from 'react-spring';
import type { ScaleOrdinal } from 'd3-scale';

import { defaultSmallLabelsFont } from './constants';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { SVGSimpleBar } from './SVGSimpleBar';
import { SVGAnimatedSimpleText } from './SVGSimpleText';
import type { AxisScale, ScaleInput, SeriesProps, StackDatum, SVGBarProps, XYChartTheme } from './types';
import { useBarLabelTransitions } from './useBarLabelTransitions';
import { useBarStackTransitions } from './useBarStackTransitions';

export type SVGBarStackSeriesProps<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
> = {
  dataKey: string;
  data: readonly StackDatum<IndependentScale, DependentScale, Datum>[];
  independentScale: IndependentScale;
  dependentScale: DependentScale;
  keyAccessor: (datum: Datum) => string;
  underlyingDatumAccessor: (datum: StackDatum<IndependentScale, DependentScale, Datum>) => Datum;
  underlyingDependentAccessor: (datum: Datum) => ScaleInput<IndependentScale>;
  independentAccessor: (datum: Datum) => ScaleInput<IndependentScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<DependentScale>;
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  /* A react-spring configuration object */
  springConfig: SpringConfig;
  colorAccessor?: (datum: Datum, key: string) => string;
  colorScale: ScaleOrdinal<string, string, never>;
  enableEvents?: boolean;
  component?: (props: SVGBarProps<Datum>) => JSX.Element;
  /** Must be a stable function. */
  labelFormatter?: (value: ScaleInput<AxisScale>) => string;
  theme: XYChartTheme;
} & Pick<
  SeriesProps<IndependentScale, DependentScale, Datum>,
  'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus' | 'enableEvents'
>;

export function SVGBarStackSeries<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>({
  dataKey,
  data,
  independentScale,
  dependentScale,
  underlyingDatumAccessor,
  underlyingDependentAccessor,
  keyAccessor,
  independentAccessor,
  dependentAccessor,
  horizontal,
  renderingOffset,
  springConfig,
  animate,
  colorAccessor,
  colorScale,
  // barProps = {},
  //   onBlur,
  //   onFocus,
  //   onPointerMove,
  //   onPointerOut,
  //   onPointerUp,
  // enableEvents = true,
  component: BarComponent = SVGSimpleBar,
  theme,
  labelFormatter
}: SVGBarStackSeriesProps<IndependentScale, DependentScale, Datum>) {
  const transitions = useBarStackTransitions({
    data,
    independentScale,
    dependentScale,
    keyAccessor,
    horizontal,
    springConfig,
    animate,
    renderingOffset,
    underlyingDatumAccessor
  });

  const labelStyles = theme.datumLabels ?? theme.smallLabels;
  const labelFont = labelStyles?.font ?? defaultSmallLabelsFont;
  const fontMetrics = getFontMetricsWithCache(labelStyles?.font ?? defaultSmallLabelsFont);
  const labelTransitions = useBarLabelTransitions<
    IndependentScale,
    DependentScale,
    StackDatum<IndependentScale, DependentScale, Datum>,
    Datum
  >({
    data,
    independentScale,
    dependentScale,
    keyAccessor,
    independentAccessor,
    dependentAccessor,
    underlyingDatumAccessor,
    underlyingDependentAccessor,
    dataKey,
    horizontal,
    springConfig,
    animate,
    renderingOffset,
    labelFormatter,
    font: labelFont,
    position: 'stacked',
    positionOutsideOnOverflow: false,
    hideOnOverflow: false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any); // TODO fix any.

  return (
    <>
      {transitions((springValues, datum, _, index) => (
        <BarComponent
          springValues={springValues}
          datum={underlyingDatumAccessor(datum)}
          index={index}
          dataKey={dataKey}
          horizontal={horizontal}
          colorScale={colorScale}
          colorAccessor={colorAccessor}
        />
      ))}
      {labelTransitions((styles, datum) => (
        <SVGAnimatedSimpleText
          springValues={styles}
          textAnchor="middle"
          verticalAnchor="middle"
          fontHeight={fontMetrics.height}
          fontHeightFromBaseline={fontMetrics.heightFromBaseline}
          textStyles={labelStyles}
          fill="white"
        >
          {datum.label}
        </SVGAnimatedSimpleText>
      ))}
    </>
  );
}
