import { ReactElement } from 'react';
import { animated, SpringConfig, useTransition } from '@react-spring/web';

import { createGroupedBarGenerator } from '@/generators/groupedBarGenerator';
import type {
  AxisScale,
  CategoryValueListDatum,
  ChartArea,
  ChartOrientation,
  DomainValue,
  Rect
} from '@/types';
import { getDefaultRenderingOffset } from '@/utils/renderUtils';

type SeriesBarsProps<CategoryT extends DomainValue> = {
  datum: CategoryValueListDatum<CategoryT, number>;
  seriesKeys: readonly string[];
  generator: (seriesKey: string, value: number) => Rect | null;
  seriesColor: (series: string, index: number) => string;
  datumAriaRoleDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumAriaLabel?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  springConfig: SpringConfig;
  className?: string;
};

function SeriesBars<CategoryT extends DomainValue>({
  datum,
  seriesKeys,
  generator,
  seriesColor,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription,
  springConfig,
  className = ''
}: SeriesBarsProps<CategoryT>) {
  const transitions = useTransition<
    string,
    { opacity: number; x: number; y: number; width: number; height: number }
  >(seriesKeys, {
    initial: (seriesKey) => ({ opacity: 1, ...generator(seriesKey, datum.values[seriesKey]) }),
    from: (seriesKey) => ({ opacity: 0, ...generator(seriesKey, datum.values[seriesKey]) }),
    enter: (seriesKey) => ({ opacity: 1, ...generator(seriesKey, datum.values[seriesKey]) }),
    update: (seriesKey) => ({ opacity: 1, ...generator(seriesKey, datum.values[seriesKey]) }),
    leave: { opacity: 0 },
    config: springConfig
  });

  return transitions(({ x, y, width, height, ...rest }, seriesKey, _, index) => (
    <animated.rect
      data-test-id="bar"
      className={className}
      fill={seriesColor(seriesKey, index)}
      role="graphics-symbol"
      aria-roledescription={datumAriaRoleDescription?.(datum, seriesKey)}
      aria-label={datumAriaLabel?.(datum, seriesKey)}
      style={rest}
      x={x}
      y={y}
      width={width}
      height={height}
    >
      {datumDescription && <desc>{datumDescription(datum, seriesKey)}</desc>}
    </animated.rect>
  ));
}

export type SvgGroupedBarsProps<CategoryT extends DomainValue> = {
  data: readonly CategoryValueListDatum<CategoryT, number>[];
  seriesKeys: readonly string[];
  seriesColor: (series: string, index: number) => string;
  chartArea: ChartArea;
  orientation: ChartOrientation;
  categoryScale: AxisScale<CategoryT>;
  seriesScale: AxisScale<string>;
  valueScale: AxisScale<number>;
  className?: string;
  offset?: number;
  categoryAriaRoleDescription?: (category: CategoryT) => string;
  categoryAriaLabel?: (category: CategoryT) => string;
  categoryDescription?: (category: CategoryT) => string;
  datumAriaRoleDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumAriaLabel?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  springConfig: SpringConfig;
};

export function SvgGroupedBars<CategoryT extends DomainValue>({
  data,
  seriesKeys,
  seriesColor,
  categoryScale,
  seriesScale,
  valueScale,
  orientation,
  chartArea,
  offset,
  className = '',
  categoryAriaRoleDescription,
  categoryAriaLabel,
  categoryDescription,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription,
  springConfig
}: SvgGroupedBarsProps<CategoryT>): ReactElement | null {
  const renderingOffset = offset ?? getDefaultRenderingOffset();
  const generator = createGroupedBarGenerator(
    seriesScale,
    valueScale,
    chartArea,
    orientation,
    renderingOffset
  );
  const translateAxis = orientation === 'vertical' ? 'translateX' : 'translateY';
  const transitions = useTransition<CategoryValueListDatum<CategoryT, number>, {}>(data, {
    initial: (d) => ({ opacity: 1, [translateAxis]: categoryScale(d.category) }),
    from: (d) => ({ opacity: 0, [translateAxis]: categoryScale(d.category) }),
    enter: (d) => ({ opacity: 1, [translateAxis]: categoryScale(d.category) }),
    update: (d) => ({ opacity: 1, [translateAxis]: categoryScale(d.category) }),
    leave: { opacity: 0 },
    keys: (d) => d.category,
    config: springConfig
  });
  return (
    <g data-test-id="grouped-bars-group" className={className} fill="currentColor" stroke="none">
      {transitions((styles, d) => (
        <animated.g
          data-test-id="category-group"
          role="graphics-object"
          style={styles}
          aria-roledescription={categoryAriaRoleDescription?.(d.category)}
          aria-label={categoryAriaLabel?.(d.category)}
        >
          {categoryDescription && <desc>{categoryDescription(d.category)}</desc>}
          <SeriesBars
            datum={d}
            seriesKeys={seriesKeys}
            generator={generator}
            seriesColor={seriesColor}
            datumAriaRoleDescription={datumAriaRoleDescription}
            datumAriaLabel={datumAriaLabel}
            datumDescription={datumDescription}
            className={className}
            springConfig={springConfig}
          />
        </animated.g>
      ))}
    </g>
  );
}
