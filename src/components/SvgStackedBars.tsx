import { ReactElement } from 'react';
import { animated, SpringConfig, useTransition } from 'react-spring';
import { SeriesPoint, stack } from 'd3-shape';

import { createStackedBarGenerator } from '@/generators/stackedBarGenerator';
import type { AxisScale, CategoryValueListDatum, ChartOrientation, DomainValue, Rect } from '@/types';
import { getDefaultRenderingOffset } from '@/utils/renderUtils';

type MappedDatum<CategoryT extends DomainValue> = {
  category: CategoryT;
  datum: CategoryValueListDatum<CategoryT, number>;
  stack: readonly {
    seriesKey: string;
    seriesPoint: SeriesPoint<CategoryValueListDatum<CategoryT, number>>;
  }[];
};

type SeriesBarsProps<CategoryT extends DomainValue> = {
  datum: MappedDatum<CategoryT>;
  generator: (seriesPoint: SeriesPoint<CategoryValueListDatum<CategoryT, number>>) => Rect | null;
  seriesColor: (series: string) => string;
  datumAriaRoleDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumAriaLabel?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  springConfig: SpringConfig;
  className?: string;
};

function SeriesBars<CategoryT extends DomainValue>({
  datum,
  generator,
  seriesColor,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription,
  springConfig,
  className = ''
}: SeriesBarsProps<CategoryT>) {
  const transitions = useTransition<
    { seriesKey: string; seriesPoint: SeriesPoint<CategoryValueListDatum<CategoryT, number>> },
    { opacity: number; x: number; y: number; width: number; height: number }
  >(datum.stack, {
    initial: (datum) => ({ opacity: 1, ...generator(datum.seriesPoint) }),
    from: (datum) => ({ opacity: 0, ...generator(datum.seriesPoint) }),
    enter: (datum) => ({ opacity: 1, ...generator(datum.seriesPoint) }),
    update: (datum) => ({ opacity: 1, ...generator(datum.seriesPoint) }),
    leave: { opacity: 0 },
    keys: (datum) => datum.seriesKey,
    config: springConfig
  });

  return transitions(({ x, y, width, height, ...rest }, { seriesKey }) => (
    <animated.rect
      data-test-id="bar"
      className={className}
      fill={seriesColor(seriesKey)}
      role="graphics-symbol"
      aria-roledescription={datumAriaRoleDescription?.(datum.datum, seriesKey)}
      aria-label={datumAriaLabel?.(datum.datum, seriesKey)}
      style={rest}
      x={x}
      y={y}
      width={width}
      height={height}
    >
      {datumDescription && <desc>{datumDescription(datum.datum, seriesKey)}</desc>}
    </animated.rect>
  ));
}

export type SvgStackedBarsProps<CategoryT extends DomainValue> = {
  data: readonly CategoryValueListDatum<CategoryT, number>[];
  seriesKeys: readonly string[];
  seriesColor: (series: string) => string;
  orientation: ChartOrientation;
  categoryScale: AxisScale<CategoryT>;
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

export function SvgStackedBars<CategoryT extends DomainValue>({
  data,
  seriesKeys,
  seriesColor,
  categoryScale,
  valueScale,
  orientation,
  offset,
  className = '',
  categoryAriaRoleDescription,
  categoryAriaLabel,
  categoryDescription,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription,
  springConfig
}: SvgStackedBarsProps<CategoryT>): ReactElement | null {
  const renderingOffset = offset ?? getDefaultRenderingOffset();
  const stackSeries = stack<CategoryValueListDatum<CategoryT, number>, string>()
    .keys(seriesKeys)
    .value((datum, key) => datum.values[key]);
  const stackSeriesData = stackSeries(data);
  const generator = createStackedBarGenerator(categoryScale, valueScale, orientation, renderingOffset);
  const translateAxis = orientation === 'vertical' ? 'x' : 'y';

  // TODO tidy this up
  const mappedData = data.map(
    (datum, categoryIndex) =>
      ({
        category: datum.category,
        datum: datum,
        stack: seriesKeys.map((seriesKey, seriesIndex) => ({
          seriesKey,
          seriesPoint: stackSeriesData[seriesIndex][categoryIndex]
        }))
      } as MappedDatum<CategoryT>)
  );

  const transitions = useTransition<MappedDatum<CategoryT>, {}>(mappedData, {
    initial: (datum) => ({ opacity: 1, [translateAxis]: categoryScale(datum.category) }),
    from: (datum) => ({ opacity: 0, [translateAxis]: categoryScale(datum.category) }),
    enter: (datum) => ({ opacity: 1, [translateAxis]: categoryScale(datum.category) }),
    update: (datum) => ({ opacity: 1, [translateAxis]: categoryScale(datum.category) }),
    leave: { opacity: 0 },
    keys: (datum) => datum.category,
    config: springConfig
  });

  return (
    <g
      role="presentation"
      data-test-id="stacked-bars-group"
      className={className}
      fill="currentColor"
      stroke="none"
    >
      {transitions((styles, datum) => (
        <animated.g
          data-test-id="category-group"
          role="graphics-object"
          style={styles}
          aria-roledescription={categoryAriaRoleDescription?.(datum.category)}
          aria-label={categoryAriaLabel?.(datum.category)}
        >
          {categoryDescription && <desc>{categoryDescription(datum.category)}</desc>}
          <SeriesBars
            datum={datum}
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
