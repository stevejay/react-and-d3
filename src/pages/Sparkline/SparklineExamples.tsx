import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';

import { Sparkline } from './Sparkline';

const dataSets = [
  [
    { date: new Date(Date.UTC(2021, 7, 1)), value: 89.34 },
    { date: new Date(Date.UTC(2021, 8, 1)), value: 83.56 },
    { date: new Date(Date.UTC(2021, 9, 1)), value: 81.32 },
    { date: new Date(Date.UTC(2021, 10, 1)), value: 102.974 },
    { date: new Date(Date.UTC(2021, 10, 13)), value: 87.247 }
  ],
  [
    { date: new Date(Date.UTC(2021, 7, 1)), value: 40 },
    { date: new Date(Date.UTC(2021, 8, 1)), value: 150 },
    { date: new Date(Date.UTC(2021, 9, 1)), value: 20 },
    { date: new Date(Date.UTC(2021, 10, 1)), value: 63.9 },
    { date: new Date(Date.UTC(2021, 10, 13)), value: 0 }
  ],
  []
];

export function SparklineExamples() {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <>
      <div className="flex flex-col items-center w-full py-8 space-y-8 bg-slate-900">
        <Sparkline data={data} width={200} height={60} />
        <ExampleUpdateButton onClick={nextDataSet}>Update sparkline data</ExampleUpdateButton>
      </div>
    </>
  );
}
