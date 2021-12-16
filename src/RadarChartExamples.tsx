import { FC, useCallback, useMemo } from 'react';

import { ChartTitle } from './ChartTitle';
import { Datum, DatumWithLegend, Key, Legend, RadarChart, ShotCategory, TOTAL } from './RadarChart';
// import { useDebouncedMeasure } from './useDebouncedMeasure';

const REALISTIC_DATA: Datum[] = [
  { key: TOTAL, value: 89.34 },
  { key: ShotCategory.Tee, value: 83.56 },
  { key: ShotCategory.App, value: 81.32 },
  { key: ShotCategory.Arg, value: 102.974 },
  { key: ShotCategory.Putt, value: 87.247 }
];

// type DatumDD = {
//     key: string;
//     value: number;
//     label: string;
// }

export function createRadarChartData(data: readonly Datum[]): readonly DatumWithLegend[] {
  const legends: Legend[] = [
    { key: TOTAL, label: 'Total Player Quality' },
    { key: ShotCategory.Tee, label: 'Off the Tee' },
    { key: ShotCategory.App, label: 'Approach' },
    { key: ShotCategory.Arg, label: 'Around the Green' },
    { key: ShotCategory.Putt, label: 'Putting' }
  ];
  return legends.map((element, index) => {
    const d = data.find((d) => d.key === element.key);
    return { ...element, value: d?.value || 0, degree: (360 / legends.length) * index };
  });
}

export type RadarChartExamplesProps = {
  transitionSeconds: number;
};

export const RadarChartExamples: FC<RadarChartExamplesProps> = () => {
  //   const [data, setData] = useState(createRandomData);
  //   const { ref: sizerRef, width, height } = useDebouncedMeasure();
  const radarChartData = useMemo(() => createRadarChartData(REALISTIC_DATA), []);
  const onSelected = useCallback((key: Key) => console.log('onSelected', key), []);
  const onShowTooltip = useCallback(() => console.log('onShowTooltip'), []);
  const onHideTooltip = useCallback(() => console.log('onHideTooltip'), []);

  return (
    <div className="space-y-4">
      <ChartTitle title="Example Radar Chart" />
      <div className="w-full py-8 flex flex-col items-center bg-gray-900">
        <RadarChart
          data={radarChartData}
          size="lg"
          label="Some label"
          selectedKey={ShotCategory.App}
          onSelected={onSelected}
          onShowTooltip={onShowTooltip}
          onHideTooltip={onHideTooltip}
          // transitionSeconds={transitionSeconds}
        />
      </div>
      {/* <div className="flex items-center space-x-2">
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
        <button
          type="button"
          onClick={() =>
            setData((state) =>
              state === dataInterruptOne
                ? dataInterruptTwo
                : state == dataInterruptTwo
                ? dataInterruptThree
                : dataInterruptOne
            )
          }
          className="bg-emerald-800 active:bg-emerald-900 hover:bg-emerald-900 focus-visible:ring outline-none text-white font-light px-4 py-2"
        >
          Interrupt 1 (200) / 2 (50, in) / 3
        </button>
      </div> */}
    </div>
  );
};
