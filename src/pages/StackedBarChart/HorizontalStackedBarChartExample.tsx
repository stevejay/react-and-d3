import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useSeriesDataSets } from '@/hooks/useDataSets';
import { CategoryValueListDatum } from '@/types';
import { InView } from '@/visx-hybrid/InView';

import { HorizontalStackedBarChart } from './HorizontalStackedBarChart';

const dataSets = [
  {
    seriesKeys: ['one', 'two', 'three'],
    data: [
      { category: 'A', values: { one: 20, two: 0, three: 0 } },
      { category: 'B', values: { one: -83.56, two: 20, three: 40 } },
      { category: 'C', values: { one: 81.32, two: 50, three: 60 } },
      { category: 'D', values: { one: 102.974, two: 10, three: 20 } },
      { category: 'E', values: { one: 87.247, two: 0, three: 40 } }
    ]
  },
  {
    seriesKeys: ['one', 'two', 'three'],
    data: [
      { category: 'A', values: { one: 30, two: 70, three: 40 } },
      { category: 'B', values: { one: 3.56, two: 120, three: 80 } },
      { category: 'C', values: { one: 81.32, two: 50, three: 60 } },
      { category: 'D', values: { one: 102.974, two: 10, three: 20 } },
      { category: 'E', values: { one: 87.247, two: 0, three: 40 } }
    ]
  },
  {
    seriesKeys: ['one', 'two', 'three'],
    data: [
      { category: 'A', values: { one: 30, two: 70, three: 40 } },
      { category: 'B', values: { one: -20.56, two: 120, three: 80 } },
      { category: 'C', values: { one: 81.32, two: 50, three: 60 } },
      { category: 'D', values: { one: 102.974, two: 10, three: 20 } },
      { category: 'E', values: { one: 87.247, two: 40, three: 40 } }
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
    seriesKeys: ['two', 'three'],
    data: [
      { category: 'A', values: { two: 90, three: 10 } },
      { category: 'B', values: { two: 45, three: 58 } },
      { category: 'D', values: { two: 28, three: 4 } },
      { category: 'E', values: { two: 16, three: 110 } }
    ]
  }
] as {
  seriesKeys: readonly string[];
  data: readonly CategoryValueListDatum<string, number>[];
}[];

export function HorizontalStackedBarChartExample() {
  const [data, nextDataSet] = useSeriesDataSets(dataSets);
  return (
    <div className="my-8">
      <div className="relative w-full h-[384px]">
        <InView>
          <HorizontalStackedBarChart data={data.data} dataKeys={data.seriesKeys} />
        </InView>
      </div>
      <ExampleUpdateButton onClick={nextDataSet}>Update bar chart data</ExampleUpdateButton>
    </div>
  );
}
