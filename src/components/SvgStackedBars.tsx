import { ReactElement } from 'react';
import { animated, SpringConfig, useTransition } from '@react-spring/web';
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
    initial: (d) => ({ opacity: 1, ...generator(d.seriesPoint) }),
    from: (d) => ({ opacity: 0, ...generator(d.seriesPoint) }),
    enter: (d) => ({ opacity: 1, ...generator(d.seriesPoint) }),
    update: (d) => ({ opacity: 1, ...generator(d.seriesPoint) }),
    leave: { opacity: 0 },
    keys: (d) => d.seriesKey,
    config: springConfig
  });

  return transitions(({ x, y, width, height, ...rest }, d) => (
    <animated.rect
      data-test-id="bar"
      className={className}
      fill={seriesColor(d.seriesKey)}
      role="graphics-symbol"
      aria-roledescription={datumAriaRoleDescription?.(datum.datum, d.seriesKey)}
      aria-label={datumAriaLabel?.(datum.datum, d.seriesKey)}
      style={rest}
      x={x}
      y={y}
      width={width}
      height={height}
    >
      {datumDescription && <desc>{datumDescription(datum.datum, d.seriesKey)}</desc>}
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
    .value((d, key) => d.values[key]);
  const stackSeriesData = stackSeries(data);
  const generator = createStackedBarGenerator(categoryScale, valueScale, orientation, renderingOffset);
  const translateAxis = orientation === 'vertical' ? 'x' : 'y';

  // TODO tidy this up
  const mappedData = data.map(
    (d, categoryIndex) =>
      ({
        category: d.category,
        datum: d,
        stack: seriesKeys.map((seriesKey, seriesIndex) => ({
          seriesKey,
          seriesPoint: stackSeriesData[seriesIndex][categoryIndex]
        }))
      } as MappedDatum<CategoryT>)
  );

  const transitions = useTransition<MappedDatum<CategoryT>, {}>(mappedData, {
    initial: (d) => ({ opacity: 1, [translateAxis]: categoryScale(d.category) }),
    from: (d) => ({ opacity: 0, [translateAxis]: categoryScale(d.category) }),
    enter: (d) => ({ opacity: 1, [translateAxis]: categoryScale(d.category) }),
    update: (d) => ({ opacity: 1, [translateAxis]: categoryScale(d.category) }),
    leave: { opacity: 0 },
    keys: (d) => d.category,
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
