import { useState } from 'react';
import type { SpringConfig } from 'react-spring';
import { schemeSet3 } from 'd3-scale-chromatic';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { Margin } from '@/types';

import { HorizontalGroupedBarChart } from './HorizontalGroupedBarChart';

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

const margins: Margin = { left: 72, right: 40, top: 40, bottom: 64 };

function isCompact(width: number) {
  return Boolean(width) && width < 500;
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

export interface HorizontalGroupedBarChartExampleProps {
  springConfig: SpringConfig;
}

export function HorizontalGroupedBarChartExample({ springConfig }: HorizontalGroupedBarChartExampleProps) {
  const [dataIndex, setDataIndex] = useState(0);
  const cycleDataIndex = () => setDataIndex((i) => (i === dataSets.length - 1 ? 0 : i + 1));
  const dataSet = dataSets[dataIndex];
  return (
    <div className="my-8">
      <ExampleChartWrapper title="Example 1: Horizontal Grouped Bar Chart" sizerClassName="h-[384px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <HorizontalGroupedBarChart
              ariaLabelledby={ariaLabelledby}
              data={dataSet.data}
              seriesKeys={dataSet.seriesKeys}
              seriesColor={getSeriesColor}
              width={width}
              height={height}
              margins={margins}
              compact={isCompact(width)}
              springConfig={springConfig}
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={cycleDataIndex}>Update bar chart data</ExampleUpdateButton>
    </div>
  );
}
