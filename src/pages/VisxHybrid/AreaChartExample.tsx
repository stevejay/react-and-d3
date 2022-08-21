import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';
import { TimeValueDatum } from '@/types';
import { InView } from '@/visx-hybrid/InView';

import { AreaChart } from './AreaChart';

const dataSets = [
  [
    { date: new Date(Date.UTC(96, 1, 2, 3, 4, 5)), value: 89.34 },
    { date: new Date(Date.UTC(97, 1, 2, 3, 4, 5)), value: 83.56 },
    { date: new Date(Date.UTC(98, 1, 2, 3, 4, 5)), value: 81.32 },
    { date: new Date(Date.UTC(99, 1, 2, 3, 4, 5)), value: 102.974 },
    { date: new Date(Date.UTC(2000, 1, 2, 3, 4, 5)), value: 87.247 }
  ],
  [
    { date: new Date(Date.UTC(97, 1, 2, 3, 4, 5)), value: 150 },
    { date: new Date(Date.UTC(98, 1, 2, 3, 4, 5)), value: -20 },
    { date: new Date(Date.UTC(99, 1, 2, 3, 4, 5)), value: 63.9 }
  ],
  [
    { date: new Date(Date.UTC(96, 1, 2, 3, 4, 5)), value: 0 },
    { date: new Date(Date.UTC(97, 1, 2, 3, 4, 5)), value: 10 },
    { date: new Date(Date.UTC(99, 1, 2, 3, 4, 5)), value: 63 },
    { date: new Date(Date.UTC(2000, 1, 2, 3, 4, 5)), value: 24 }
  ],
  []
  // [
  //   { date: new Date(Date.UTC(96, 1, 2, 3, 4, 5)), value: 89.34 },
  //   { date: new Date(Date.UTC(97, 1, 2, 3, 4, 5)), value: 83.56 },
  //   { date: new Date(Date.UTC(98, 1, 2, 3, 4, 5)), value: 81.32 },
  //   { date: new Date(Date.UTC(99, 1, 2, 3, 4, 5)), value: undefined },
  //   { date: new Date(Date.UTC(2000, 1, 2, 3, 4, 5)), value: 87.247 }
  // ]
] as TimeValueDatum<number>[][];

export function AreaChartExample() {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <div className="my-8">
      <div className="relative w-full h-[384px]">
        <InView>
          <AreaChart data={data} />
        </InView>
      </div>
      <ExampleUpdateButton onClick={nextDataSet}>Update area chart data</ExampleUpdateButton>
    </div>
  );
}
