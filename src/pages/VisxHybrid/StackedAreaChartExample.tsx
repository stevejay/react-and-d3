import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useSeriesDataSets } from '@/hooks/useDataSets';
import { CategoryValueListDatum } from '@/types';
import { InView } from '@/visx-hybrid/InView';

import { StackedAreaChart } from './StackedAreaChart';

const dataSets = [
  {
    seriesKeys: ['one', 'two', 'three'],
    data: [
      { category: new Date(Date.UTC(96, 1, 2, 3, 4, 5)), values: { one: 20, two: 0.0001, three: 0.0001 } },
      { category: new Date(Date.UTC(97, 1, 2, 3, 4, 5)), values: { one: -83.56, two: 20, three: 40 } },
      { category: new Date(Date.UTC(98, 1, 2, 3, 4, 5)), values: undefined }, // { one: 81.32, two: 50, three: 60 } },
      { category: new Date(Date.UTC(99, 1, 2, 3, 4, 5)), values: { one: 102.974, two: 10, three: 20 } },
      { category: new Date(Date.UTC(2000, 1, 2, 3, 4, 5)), values: { one: 87.247, two: 0.0001, three: 40 } }
    ]
  },
  {
    seriesKeys: ['one', 'two', 'three'],
    data: [
      { category: new Date(Date.UTC(96, 1, 2, 3, 4, 5)), values: { one: 30, two: 70, three: 40 } },
      { category: new Date(Date.UTC(97, 1, 2, 3, 4, 5)), values: { one: 3.56, two: 120, three: 80 } },
      { category: new Date(Date.UTC(98, 1, 2, 3, 4, 5)), values: { one: 81.32, two: 50, three: 60 } },
      { category: new Date(Date.UTC(99, 1, 2, 3, 4, 5)), values: { one: 102.974, two: 10, three: 20 } },
      { category: new Date(Date.UTC(2000, 1, 2, 3, 4, 5)), values: { one: 87.247, two: 0, three: 40 } }
    ]
  },
  {
    seriesKeys: ['one', 'two', 'three'],
    data: [
      { category: new Date(Date.UTC(96, 1, 2, 3, 4, 5)), values: { one: 30, two: 70, three: 40 } },
      { category: new Date(Date.UTC(97, 1, 2, 3, 4, 5)), values: { one: -20.56, two: 120, three: 80 } },
      { category: new Date(Date.UTC(98, 1, 2, 3, 4, 5)), values: { one: 81.32, two: 50, three: 60 } },
      { category: new Date(Date.UTC(99, 1, 2, 3, 4, 5)), values: { one: 102.974, two: 10, three: 20 } },
      { category: new Date(Date.UTC(2000, 1, 2, 3, 4, 5)), values: { one: 87.247, two: 40, three: 40 } }
    ]
  },
  {
    seriesKeys: ['one'],
    data: [
      { category: new Date(Date.UTC(97, 1, 2, 3, 4, 5)), values: { one: 150 } },
      { category: new Date(Date.UTC(98, 1, 2, 3, 4, 5)), values: { one: 20 } },
      { category: new Date(Date.UTC(99, 1, 2, 3, 4, 5)), values: { one: 63.9 } }
    ]
  },
  {
    seriesKeys: ['two', 'three'],
    data: [
      { category: new Date(Date.UTC(96, 1, 2, 3, 4, 5)), values: { two: 90, three: 10 } },
      { category: new Date(Date.UTC(97, 1, 2, 3, 4, 5)), values: { two: 45, three: 58 } },
      { category: new Date(Date.UTC(99, 1, 2, 3, 4, 5)), values: { two: 28, three: 4 } },
      { category: new Date(Date.UTC(2000, 1, 2, 3, 4, 5)), values: { two: 16, three: 110 } }
    ]
  }
] as {
  seriesKeys: readonly string[];
  data: readonly CategoryValueListDatum<Date, number>[];
}[];

export function StackedAreaChartExample() {
  const [data, nextDataSet] = useSeriesDataSets(dataSets);
  return (
    <div className="my-8">
      <div className="relative w-full h-[384px]">
        <InView>
          <StackedAreaChart data={data.data} dataKeys={data.seriesKeys} />
        </InView>
      </div>
      <ExampleUpdateButton onClick={nextDataSet}>Update area chart data</ExampleUpdateButton>
    </div>
  );
}
