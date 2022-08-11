import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';
import { InView } from '@/visx-hybrid/InView';

import { AreaChart } from './AreaChart';

const dataSets = [
  [
    { category: 'A', value: 89.34 },
    { category: 'B', value: -8.56 },
    { category: 'C', value: 81.32 },
    { category: 'D', value: -102.974 },
    { category: 'E', value: 87.247 }
  ],
  [
    { category: 'A', value: -89.34 },
    { category: 'B', value: 83.56 },
    { category: 'C', value: 0 },
    { category: 'D', value: 102.974 },
    { category: 'E', value: -87.247 }
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
  [{ category: 'A', value: 0 }],
  []
];

export function AreaChartExample() {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <div className="my-8">
      <div className="relative w-full h-[384px] bg-slate-700">
        <InView>
          <AreaChart data={data} />
        </InView>
      </div>
      <ExampleUpdateButton onClick={nextDataSet}>Update area chart data</ExampleUpdateButton>
    </div>
  );
}
