import { FC } from 'react';
import { schemeSet3 } from 'd3-scale-chromatic';
import { capitalize } from 'lodash-es';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';
import type { CategoryValueListDatum, Margins } from '@/types';

import { VerticalStackedBarChart } from './VerticalStackedBarChart';

const dataSets: readonly CategoryValueListDatum<string, number>[][] = [
  [
    { category: 'A', values: { one: 20, two: 0, three: 0 } },
    { category: 'B', values: { one: 83.56, two: 20, three: 40 } },
    { category: 'C', values: { one: 81.32, two: 50, three: 60 } },
    { category: 'D', values: { one: 102.974, two: 10, three: 0 } },
    { category: 'E', values: { one: 87.247, two: 0, three: 40 } }
  ],
  [
    { category: 'B', values: { one: 150, two: 3, three: 80 } },
    { category: 'C', values: { one: 20, two: 40, three: 70 } },
    { category: 'D', values: { one: 63.9, two: 30, three: 30 } }
  ],
  [
    { category: 'A', values: { one: 0, two: 90, three: 10 } },
    { category: 'B', values: { one: 10, two: 45, three: 58 } },
    { category: 'D', values: { one: 63, two: 28, three: 4 } },
    { category: 'E', values: { one: 24, two: 16, three: 110 } }
  ]
];

const margins: Margins = { left: 72, right: 40, top: 40, bottom: 64 };

function getCategoryLabel(datum: CategoryValueListDatum<string, number>) {
  return datum.category;
}

function getSeriesLabel(series: string) {
  return capitalize(series);
}

function getSeriesColor(series: string) {
  switch (series) {
    case 'one':
      return schemeSet3[0];
    case 'two':
      return schemeSet3[1];
    case 'three':
      return schemeSet3[2];
    default:
      return 'transparent';
  }
}

const seriesKeys = ['one', 'two', 'three'];

export const VerticalStackedBarChartExample: FC = () => {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <div className="my-8">
      <ExampleChartWrapper title="Example 1: Vertical Stacked Bar Chart" sizerClassName="h-[384px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <VerticalStackedBarChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              seriesKeys={seriesKeys}
              seriesColor={getSeriesColor}
              width={width}
              height={height}
              margins={margins}
              ariaRoleDescription="Bar chart"
              seriesAriaRoleDescription={(series) => `Series ${getSeriesLabel(series)}`}
              seriesAriaLabel={getSeriesLabel}
              seriesDescription={(series) => `This is the description for ${getSeriesLabel(series)}`}
              datumAriaRoleDescription={getCategoryLabel}
              datumAriaLabel={(d, series) => `${d.values[series]}`}
              datumDescription={(d) => `This is the description for ${getCategoryLabel(d)}`}
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={nextDataSet}>Update bar chart data</ExampleUpdateButton>
    </div>
  );
};
