import type { SpringConfig } from 'react-spring';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';
import { Margin } from '@/types';

import { VerticalBarChart } from './VerticalBarChart';

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
  ],
  [
    { category: 'A', value: 50 },
    { category: 'B', value: -20 },
    { category: 'D', value: -3 },
    { category: 'E', value: 30 }
  ]
];

const margins: Margin = { left: 72, right: 40, top: 40, bottom: 64 };

export interface VerticalBarChartExampleProps {
  springConfig: SpringConfig;
}

export function VerticalBarChartExample({ springConfig }: VerticalBarChartExampleProps) {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <div className="my-8">
      <ExampleChartWrapper title="Example 1: Vertical Bar Chart" sizerClassName="h-[384px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <VerticalBarChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              margins={margins}
              springConfig={springConfig}
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={nextDataSet}>Update bar chart data</ExampleUpdateButton>
    </div>
  );
}
