import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useSeriesDataSets } from '@/hooks/useDataSets';
import { Margin } from '@/types';
import { InView } from '@/visx-next/InView';

import { StackedBarChart } from './StackedBarChart';

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
    seriesKeys: ['one', 'two', 'three'],
    data: [
      { category: 'A', values: { one: 0, two: 0, three: 0 } },
      { category: 'B', values: { one: 150, two: 0, three: 0 } },
      { category: 'C', values: { one: 20, two: 0, three: 0 } },
      { category: 'D', values: { one: 63.9, two: 0, three: 0 } },
      { category: 'E', values: { one: 0, two: 0, three: 0 } }
    ]
  },
  {
    seriesKeys: ['one', 'two', 'three'],
    data: [
      { category: 'A', values: { one: 0, two: 90, three: 10 } },
      { category: 'B', values: { one: 10, two: 45, three: 58 } },
      { category: 'C', values: { one: 0, two: 0, three: 0 } },
      { category: 'D', values: { one: 63, two: 28, three: 4 } },
      { category: 'E', values: { one: 24, two: 16, three: 110 } }
    ]
  }
];

const margin: Margin = { left: 72, right: 40, top: 40, bottom: 64 };

export function StackedBarChartExample() {
  const [data, nextDataSet] = useSeriesDataSets(dataSets);
  return (
    <div className="my-8">
      <div className="relative w-full h-[384px] bg-slate-700">
        <InView>
          <StackedBarChart margin={margin} data={data.data} dataKeys={data.seriesKeys} />
        </InView>
      </div>
      <ExampleUpdateButton onClick={nextDataSet}>Update bar chart data</ExampleUpdateButton>
    </div>
  );
}
