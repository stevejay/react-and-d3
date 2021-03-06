import { Fragment } from 'react';
import { SpringConfig } from 'react-spring';
import { schemeSet3 } from 'd3-scale-chromatic';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { CategoryValueListDatum } from '@/types';

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

function renderTooltipContent(datum: CategoryValueListDatum<string, number>) {
  return (
    <>
      {seriesKeys.map((series, index) => (
        <Fragment key={series}>
          <span style={{ color: schemeSet3[index] }}>{getSeriesLabel(series)}:</span> {datum.values[series]}
          <br />
        </Fragment>
      ))}
    </>
  );
}

export interface StackedBarChartWithTooltipExampleProps {
  springConfig: SpringConfig;
}

export function StackedBarChartWithTooltipExample({ springConfig }: StackedBarChartWithTooltipExampleProps) {
  return (
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
            independentAxisTickFormat={(datum) => `Strategy ${datum}`}
            dependentAxisLabel="Sales (units)"
            ariaRoleDescription="Stacked bar chart"
            ariaLabelledby={ariaLabelledby}
            categoryAriaRoleDescription={() => 'Sales strategy'}
            categoryAriaLabel={getCategoryLabel}
            datumAriaRoleDescription={(_, series) => getSeriesLabel(series)}
            datumAriaLabel={(datum, series) => `${datum.values[series]} units sold`}
            renderTooltipContent={renderTooltipContent}
            hideTooltipOnScroll
            compact={isCompact(width)}
            springConfig={springConfig}
          />
        )
      }
    </ExampleChartWrapper>
  );
}
