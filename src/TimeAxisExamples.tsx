import { FC, useState } from 'react';
import { random, range } from 'lodash-es';

import { ChartTitle } from './ChartTitle';
import { D3TimeAxisChart } from './D3TimeAxisChart';
import { ReactTimeAxisChart } from './ReactTimeAxisChart';
import { ReactTimeAxisNoExitChart } from './ReactTimeAxisNoExitChart';
import { useDebouncedMeasure } from './useDebouncedMeasure';

function getRandomDateWithinRange(start: Date, end: Date): Date {
  const timestamp = random(start.getTime(), end.getTime());
  const randomDate = new Date(timestamp);
  return new Date(
    Date.UTC(
      randomDate.getUTCFullYear(),
      randomDate.getUTCMonth(),
      randomDate.getUTCDate(),
      randomDate.getUTCHours(),
      randomDate.getUTCMinutes(),
      randomDate.getUTCSeconds(),
      randomDate.getUTCMilliseconds()
    )
  );
}

function createRandomData(): Date[] {
  const rangeSeed = random(0, 3);
  let dataRange = [new Date(Date.UTC(2020, 0, 1)), new Date(Date.UTC(2021, 8, 30))];
  if (rangeSeed === 1) {
    dataRange = [new Date(Date.UTC(2020, 0, 1)), new Date(Date.UTC(2021, 9, 1))];
  } else if (rangeSeed === 2) {
    dataRange = [new Date(Date.UTC(2020, 10, 1)), new Date(Date.UTC(2021, 1, 15))];
  }
  return range(5, 15).map(() => getRandomDateWithinRange(dataRange[0], dataRange[1]));
}

const dataA = [new Date(Date.UTC(2000, 0, 1)), new Date(Date.UTC(2000, 9, 1))];
const dataB = [new Date(Date.UTC(1999, 8, 1)), new Date(Date.UTC(2000, 4, 1))];

// function getRandomDateWithinRange(start: string, end: string) {
//   const startMs = Date.parse(start);
//   const endMs = Date.parse(end);
//   return new Date(Math.floor(Math.random() * (endMs - startMs + 1) + startMs));
// }

// function createRandomData(): Date[] {
//   const rangeSeed = random(0, 3);
//   let dataRange: [string, string] = ['2021-01-01', '2021-09-30'];
//   if (rangeSeed === 1) {
//     dataRange = ['2020-01-01', '2021-10-01'];
//   } else if (rangeSeed === 2) {
//     dataRange = ['2020-11-01', '2021-02-15'];
//   }
//   return range(5, 15).map(() => getRandomDateWithinRange(...dataRange));
// }

// const dataA = [new Date(2000, 0, 1), new Date(2000, 9, 1)];
// const dataB = [new Date(1999, 8, 1), new Date(2000, 4, 1)];

export type TimeAxisExamplesProps = {
  drawTicksAsGridLines: boolean;
  transitionSeconds: number;
};

export const TimeAxisExamples: FC<TimeAxisExamplesProps> = ({ drawTicksAsGridLines, transitionSeconds }) => {
  const [data, setData] = useState(createRandomData);
  const { ref: sizerRef, width, height } = useDebouncedMeasure();

  return (
    <div className="space-y-4">
      <ChartTitle title="React Rendering" subtitle="Basic Exit Animation" />
      <div ref={sizerRef} className="h-28 w-full">
        <ReactTimeAxisChart
          data={data}
          width={width ?? 0}
          height={height ?? 0}
          drawTicksAsGridLines={drawTicksAsGridLines}
          transitionSeconds={transitionSeconds}
        />
      </div>
      <ChartTitle title="React Rendering" subtitle="Interruptible Exit Animation" />
      <div className="h-28 w-full">
        <ReactTimeAxisNoExitChart
          data={data}
          width={width ?? 0}
          height={height ?? 0}
          drawTicksAsGridLines={drawTicksAsGridLines}
          transitionSeconds={transitionSeconds}
        />
      </div>
      <ChartTitle title="D3 Rendering" />
      <div className="h-28 w-full">
        <D3TimeAxisChart
          data={data}
          width={width ?? 0}
          height={height ?? 0}
          drawTicksAsGridLines={drawTicksAsGridLines}
          transitionSeconds={transitionSeconds}
        />
      </div>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setData(createRandomData)}
          className="bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring outline-none text-white font-light px-4 py-2"
        >
          Random data
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
