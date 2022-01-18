import { FC } from 'react';
import type { SpringConfig } from 'react-spring';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';
import type { Margins } from '@/types';

import { HorizontalBarChart } from './HorizontalBarChart';

const dataSets = [
  [
    { category: 'A', value: 89.34 },
    { category: 'B', value: 83.56 },
    { category: 'C', value: 81.32 },
    { category: 'D', value: 102.974 },
    { category: 'E', value: 87.247 }
  ],
  [
    { category: 'B', value: 150 },
    { category: 'C', value: 20 },
    { category: 'D', value: 63.9 }
  ],
  [
    { category: 'A', value: 0 },
    { category: 'B', value: 10 },
    { category: 'D', value: 63 },
    { category: 'E', value: 24 }
  ],
  [
    { category: 'A', value: 10 },
    { category: 'B', value: -20 },
    { category: 'D', value: -63 },
    { category: 'E', value: -24 }
  ]
];

const margins: Margins = { left: 64, right: 40, top: 40, bottom: 64 };

function isCompact(width: number) {
  return Boolean(width) && width < 500;
}

export type HorizontalBarChartExampleProps = { springConfig: SpringConfig };

export const HorizontalBarChartExample: FC<HorizontalBarChartExampleProps> = ({ springConfig }) => {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <div className="my-8">
      <ExampleChartWrapper title="Example 2: Horizontal Bar Chart" sizerClassName="h-[384px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <HorizontalBarChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              margins={margins}
              compact={isCompact(width)}
              springConfig={springConfig}
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={nextDataSet}>Update bar chart data</ExampleUpdateButton>
    </div>
  );
};
