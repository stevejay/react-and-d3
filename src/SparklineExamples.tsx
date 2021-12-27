import { FC, useState } from 'react';

import { ChartTitle } from './ChartTitle';
import { Datum, Sparkline } from './Sparkline';

const dataA: Datum[] = [
  { date: new Date(Date.UTC(2021, 7, 1)), value: 89.34 },
  { date: new Date(Date.UTC(2021, 8, 1)), value: 83.56 },
  { date: new Date(Date.UTC(2021, 9, 1)), value: 81.32 },
  { date: new Date(Date.UTC(2021, 10, 1)), value: 102.974 },
  { date: new Date(Date.UTC(2021, 10, 13)), value: 87.247 }
];

const dataB: Datum[] = [
  { date: new Date(Date.UTC(2021, 7, 1)), value: 40 },
  { date: new Date(Date.UTC(2021, 8, 1)), value: 150 },
  { date: new Date(Date.UTC(2021, 9, 1)), value: 20 },
  { date: new Date(Date.UTC(2021, 10, 1)), value: 63.9 },
  { date: new Date(Date.UTC(2021, 10, 13)), value: 0 }
];

const zeroData: Datum[] = [];

export type SparklineExamplesProps = {
  transitionSeconds: number;
};

export const SparklineExamples: FC<SparklineExamplesProps> = () => {
  const [data, setData] = useState<Datum[]>(dataA);
  return (
    <div className="space-y-4">
      <ChartTitle title="Simple Sparkline" />
      <div className="w-full py-8 flex flex-col items-center bg-slate-900">
        <Sparkline
          data={data}
          width={100}
          height={30}
          // transitionSeconds={transitionSeconds}
        />
      </div>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setData(zeroData)}
          className="bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring outline-none text-white font-light px-4 py-2"
        >
          Zero data
        </button>
        <button
          type="button"
          onClick={() => setData((state) => (state === dataA ? dataB : dataA))}
          className="bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring outline-none text-white font-light px-4 py-2"
        >
          Data A/B
        </button>
      </div>
    </div>
  );
};
