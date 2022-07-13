import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';
import { Margin } from '@/types';
import { InView } from '@/visx-next/InView';

import { GlyphSeriesChart } from './GlyphSeriesChart';

const dataSets = [
  // [
  //   { a: 10, b: 89.34 },
  //   { a: 20, b: 83.56 },
  //   { a: 30, b: 81.32 },
  //   { a: 40, b: 102.974 },
  //   { a: 50, b: 87.247 }
  // ],
  [
    { a: 40, b: 150 },
    { a: 50, b: 20 }
    // { a: 60, b: 63.9 }
  ],
  [
    { a: 10, b: 0 },
    { a: 20, b: 15 },
    { a: 20, b: 10 },
    { a: 40, b: 63 },
    { a: 50, b: 24 }
  ]
];

const margin: Margin = { left: 72, right: 72, top: 64, bottom: 64 };

export function GlyphSeriesChartExample() {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <div className="my-8">
      <div className="relative w-full h-[384px] bg-slate-700">
        <InView>
          <GlyphSeriesChart data={data} margin={margin} />
        </InView>
      </div>
      <ExampleUpdateButton onClick={nextDataSet}>Update bar chart data</ExampleUpdateButton>
    </div>
  );
}
