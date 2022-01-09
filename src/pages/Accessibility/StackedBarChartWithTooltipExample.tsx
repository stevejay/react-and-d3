import { FC, Fragment } from 'react';
import { schemeSet3 } from 'd3-scale-chromatic';
import { round } from 'lodash-es';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import type { CategoryValueListDatum } from '@/types';

import { StackedBarChartWithTooltip } from './StackedBarChartWithTooltip';

const data = [
  { category: '1', values: { a: 20, b: 0, c: 0 } },
  { category: '2', values: { a: 84, b: 20, c: 40 } },
  { category: '3', values: { a: 81, b: 50, c: 60 } },
  { category: '4', values: { a: 103, b: 10, c: 0 } },
  { category: '5', values: { a: 87, b: 0, c: 40 } }
];

const margins = { left: 72, right: 32, top: 32, bottom: 48 };
const compactMargins = { left: 64, right: 20, top: 24, bottom: 72 };

const seriesKeys = ['a', 'b', 'c'];

function isCompact(width: number) {
  return Boolean(width) && width < 500;
}

function getCategoryLabel(category: string) {
  return `Strategy ${category}`;
}

function getSeriesLabel(series: string) {
  return `Product ${series.toUpperCase()}`;
}

function getSeriesColor(series: string) {
  switch (series) {
    case 'a':
      return schemeSet3[0];
    case 'b':
      return schemeSet3[1];
    case 'c':
      return schemeSet3[2];
    default:
      return 'transparent';
  }
}

function renderTooltipContent(d: CategoryValueListDatum<string, number>) {
  return (
    <>
      {seriesKeys.map((series, index) => (
        <Fragment key={series}>
          <span style={{ color: schemeSet3[index] }}>{getSeriesLabel(series)}:</span>{' '}
          {round(d.values[series], 2)}
          <br />
        </Fragment>
      ))}
    </>
  );
}

export const StackedBarChartWithTooltipExample: FC = () => (
  <ExampleChartWrapper title="Comparing sales strategies" sizerClassName="h-[384px]">
    {({ inView, width, height, ariaLabelledby }) =>
      inView && (
        <StackedBarChartWithTooltip
          data={data}
          seriesKeys={seriesKeys}
          seriesColor={getSeriesColor}
          width={width}
          height={height}
          margins={isCompact(width) ? compactMargins : margins}
          independentAxisTickFormat={(d) => `Strategy ${d}`}
          dependentAxisLabel="Sales (units)"
          ariaRoleDescription="Stacked bar chart"
          ariaLabelledby={ariaLabelledby}
          description="Analysing how different sales strategies affect the sales figures of our three most popular products"
          categoryAriaRoleDescription={() => 'Sales strategy'}
          categoryAriaLabel={getCategoryLabel}
          categoryDescription={(category) => `Sales results for ${getCategoryLabel(category)}`}
          datumAriaRoleDescription={(_d, series) => getSeriesLabel(series)}
          datumAriaLabel={(d, series) => `${round(d.values[series])} units sold`}
          renderTooltipContent={renderTooltipContent}
          hideTooltipOnScroll
          compact={isCompact(width)}
        />
      )
    }
  </ExampleChartWrapper>
);
