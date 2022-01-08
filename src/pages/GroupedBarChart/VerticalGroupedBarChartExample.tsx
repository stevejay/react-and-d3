import { FC, useState } from 'react';
import { schemeSet3 } from 'd3-scale-chromatic';
import { capitalize } from 'lodash-es';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import type { Margins } from '@/types';

import { VerticalGroupedBarChart } from './VerticalGroupedBarChart';

const dataSets = [
  {
    seriesKeys: ['one', 'two', 'three'],
    data: [
      { category: 'A', values: { one: 20, two: 0, three: 0 } },
      { category: 'B', values: { one: 83.56, two: 20, three: 40 } },
      { category: 'C', values: { one: 81.32, two: 50, three: 60 } },
      { category: 'D', values: { one: 102.974, two: 10, three: 20 } },
      { category: 'E', values: { one: 87.247, two: 0, three: 40 } }
    ]
  },
  {
    seriesKeys: ['one'],
    data: [
      { category: 'B', values: { one: 150 } },
      { category: 'C', values: { one: 20 } },
      { category: 'D', values: { one: 63.9 } }
    ]
  },
  {
    seriesKeys: ['one', 'three', 'two'],
    data: [
      { category: 'A', values: { one: 0, two: 90, three: 10 } },
      { category: 'B', values: { one: 10, two: 45, three: 58 } },
      { category: 'D', values: { one: 63, two: 28, three: 4 } },
      { category: 'E', values: { one: 24, two: 16, three: 110 } }
    ]
  }
];

const margins: Margins = { left: 72, right: 40, top: 40, bottom: 64 };

function getCategoryLabel(category: string) {
  return `Category ${category}`;
}

function getSeriesLabel(series: string) {
  return `Series ${capitalize(series)}`;
}

function getSeriesColor(series: string, index: number) {
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

export const VerticalGroupedBarChartExample: FC = () => {
  const [dataIndex, setDataIndex] = useState(0);
  const cycleDataIndex = () => setDataIndex((i) => (i === dataSets.length - 1 ? 0 : i + 1));
  const dataSet = dataSets[dataIndex];
  return (
    <div className="my-8">
      <ExampleChartWrapper title="Example 2: Vertical Grouped Bar Chart" sizerClassName="h-[384px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <VerticalGroupedBarChart
              ariaLabelledby={ariaLabelledby}
              data={dataSet.data}
              seriesKeys={dataSet.seriesKeys}
              seriesColor={getSeriesColor}
              width={width}
              height={height}
              margins={margins}
              ariaRoleDescription="Grouped Bar chart"
              categoryAriaRoleDescription={() => 'Category'}
              categoryAriaLabel={getCategoryLabel}
              categoryDescription={(category) => `This is the description for ${getCategoryLabel(category)}`}
              datumAriaRoleDescription={(d, series) => `${getSeriesLabel(series)} data point`}
              datumAriaLabel={(d, series) => `${d.values[series]}`}
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={cycleDataIndex}>Update bar chart data</ExampleUpdateButton>
    </div>
  );
};
