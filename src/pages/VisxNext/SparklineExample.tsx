import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';
import { Margin } from '@/types';
import { InView } from '@/visx-next/InView';

import { Sparkline } from './Sparkline';

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
    { date: new Date(Date.UTC(98, 1, 2, 3, 4, 5)), value: 20 },
    { date: new Date(Date.UTC(99, 1, 2, 3, 4, 5)), value: 63.9 }
  ],
  [
    { date: new Date(Date.UTC(96, 1, 2, 3, 4, 5)), value: 0 },
    { date: new Date(Date.UTC(97, 1, 2, 3, 4, 5)), value: 10 },
    { date: new Date(Date.UTC(99, 1, 2, 3, 4, 5)), value: 63 },
    { date: new Date(Date.UTC(2000, 1, 2, 3, 4, 5)), value: 24 }
  ]
];

const margin: Margin = { left: 72, right: 72, top: 64, bottom: 64 };

export function SparklineExample() {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <div className="my-8">
      <div className="relative w-full h-[384px] bg-slate-700">
        <InView>
          <Sparkline data={data} margin={margin} />
        </InView>
      </div>
      <ExampleUpdateButton onClick={nextDataSet}>Update bar chart data</ExampleUpdateButton>
    </div>
  );
}
