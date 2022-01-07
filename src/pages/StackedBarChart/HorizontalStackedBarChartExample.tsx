import { FC, useState } from 'react';
import { schemeSet3 } from 'd3-scale-chromatic';
import { capitalize } from 'lodash-es';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import type { CategoryValueListDatum, Margins } from '@/types';

import { HorizontalStackedBarChart } from './HorizontalStackedBarChart';

const dataSets: {
  data: CategoryValueListDatum<string, number>[];
  seriesKeys: string[];
}[] = [
  {
    data: [
      { category: 'A', values: { one: 20, two: 0, three: 0 } },
      { category: 'B', values: { one: 83.56, two: 20, three: 40 } },
      { category: 'C', values: { one: 81.32, two: 50, three: 60 } },
      { category: 'D', values: { one: 102.974, two: 10, three: 0 } },
      { category: 'E', values: { one: 87.247, two: 0, three: 40 } }
    ],
    seriesKeys: ['one', 'two', 'three']
  },
  {
    data: [
      { category: 'B', values: { one: 150, two: 0, three: 80 } },
      { category: 'C', values: { one: 20, two: 0, three: 70 } },
      { category: 'D', values: { one: 63.9, two: 0, three: 30 } }
    ],
    seriesKeys: ['one', 'two', 'three']
  },
  {
    data: [
      { category: 'A', values: { one: 0, two: 90, three: 10 } },
      { category: 'B', values: { one: 10, two: 45, three: 58 } },
      { category: 'D', values: { one: 63, two: 28, three: 4 } },
      { category: 'E', values: { one: 24, two: 16, three: 110 } }
    ],
    seriesKeys: ['one', 'two', 'three']
  }
];

const margins: Margins = { left: 64, right: 40, top: 40, bottom: 64 };

function isCompact(width: number) {
  return Boolean(width) && width < 450;
}

function getCategoryLabel(datum: CategoryValueListDatum<string, number>) {
  return datum.category;
}

function getSeriesLabel(series: string) {
  return capitalize(series);
}

export const HorizontalStackedBarChartExample: FC = () => {
  const [dataIndex, setDataIndex] = useState(0);
  const cycleDataIndex = () => setDataIndex((i) => (i === dataSets.length - 1 ? 0 : i + 1));
  const dataSet = dataSets[dataIndex];

  return (
    <div className="my-8">
      <ExampleChartWrapper title="Example 2: Horizontal Stacked Bar Chart" sizerClassName="h-[384px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <HorizontalStackedBarChart
              ariaLabelledby={ariaLabelledby}
              data={dataSet.data}
              seriesKeys={dataSet.seriesKeys}
              colorRange={schemeSet3} // TODO should this be a function?
              width={width}
              height={height}
              margins={margins}
              ariaRoleDescription="Stacked bar chart"
              seriesAriaRoleDescription={(series) => `Series ${getSeriesLabel(series)}`}
              seriesAriaLabel={getSeriesLabel}
              seriesDescription={(series) => `This is the description for ${getSeriesLabel(series)}`}
              datumAriaRoleDescription={getCategoryLabel}
              datumAriaLabel={(d, series) => `${d.values[series]}`}
              datumDescription={(d) => `This is the description for ${getCategoryLabel(d)}`}
              compact={isCompact(width)}
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={cycleDataIndex}>Update bar chart data</ExampleUpdateButton>
    </div>
  );
};
