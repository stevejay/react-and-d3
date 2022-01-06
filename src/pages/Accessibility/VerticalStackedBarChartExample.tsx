import { FC, Fragment } from 'react';
import { schemeSet3 } from 'd3-scale-chromatic';
import { round } from 'lodash-es';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import type { CategoryValueListDatum, Margins } from '@/types';

import { VerticalStackedBarChartWithTooltip } from './VerticalStackedBarChartWithTooltip';

const data = [
  { category: '1', values: { a: 20, b: 0, c: 0 } },
  { category: '2', values: { a: 83.56, b: 20, c: 40 } },
  { category: '3', values: { a: 81.32, b: 50, c: 60 } },
  { category: '4', values: { a: 102.974, b: 10, c: 0 } },
  { category: '5', values: { a: 87.247, b: 0, c: 40 } }
];

const margins: Margins = { left: 72, right: 32, top: 32, bottom: 48 };
const seriesKeys = ['a', 'b', 'c'];

function getCategoryLabel(datum: CategoryValueListDatum<string, number>) {
  return `Strategy ${datum.category}`;
}

function getSeriesLabel(series: string) {
  return `Product ${series.toUpperCase()}`;
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

export const VerticalStackedBarChartExample: FC = () => (
  <ExampleChartWrapper title="Comparing sales strategies" sizerClassName="h-[384px]">
    {({ inView, width, height, ariaLabelledby }) =>
      inView && (
        <VerticalStackedBarChartWithTooltip
          data={data}
          seriesKeys={seriesKeys}
          colorRange={schemeSet3}
          width={width}
          height={height}
          margins={margins}
          independentAxisTickFormat={(d) => `Strategy ${d}`}
          dependentAxisLabel="Sales (units)"
          ariaRoleDescription="Stacked bar chart"
          ariaLabelledby={ariaLabelledby}
          description="Analysing how different sales strategies affect the sales figures of our three most popular products"
          seriesAriaRoleDescription={() => 'Data series'}
          seriesAriaLabel={getSeriesLabel}
          seriesDescription={(series) => `The description for ${getSeriesLabel(series)} data series`}
          datumAriaRoleDescription={(_d, series) => getSeriesLabel(series)}
          datumAriaLabel={(d, series) => `${round(d.values[series])} units sold using ${getCategoryLabel(d)}`}
          //   datumDescription={(d) => `The description for ${getCategoryLabel(d)}`}
          renderTooltipContent={renderTooltipContent}
          hideOnScroll
        />
      )
    }
  </ExampleChartWrapper>
);