import { FC, useCallback, useState } from 'react';

import { ChartTitle } from './ChartTitle';
import { Datum, RadarChart } from './RadarChart';

const dataA: Datum[] = [
  { key: 'one', value: 89.34, label: 'Category One' },
  { key: 'two', value: 83.56, label: 'Category Two' },
  { key: 'three', value: 81.32, label: 'Category Three' },
  { key: 'four', value: 102.974, label: 'Category Four' },
  { key: 'five', value: 87.247, label: 'Category Five' }
];

const dataB: Datum[] = [
  { key: 'one', value: 40, label: 'Category One' },
  { key: 'two', value: 150, label: 'Category Two' },
  { key: 'three', value: 20, label: 'Category Three' },
  { key: 'four', value: 63.9, label: 'Category Four' },
  { key: 'five', value: 0, label: 'Category Five' }
];

const zeroData: Datum[] = dataA.map((d) => ({ ...d, value: 0 }));

export type RadarChartExamplesProps = {
  transitionSeconds: number;
};

export const RadarChartExamples: FC<RadarChartExamplesProps> = () => {
  const [selectedKey, setSelectedKey] = useState<Datum['key']>('one');
  const [data, setData] = useState<Datum[]>(dataA);
  const onShowTooltip = useCallback(() => console.log('onShowTooltip'), []);
  const onHideTooltip = useCallback(() => console.log('onHideTooltip'), []);

  return (
    <div className="space-y-4">
      <ChartTitle title="Example Radar Chart" />
      <div className="w-full py-8 flex flex-col items-center bg-gray-900">
        <RadarChart
          data={data}
          label="Some label"
          selectedKey={selectedKey}
          diameter={420}
          onSelect={setSelectedKey}
          onShowTooltip={onShowTooltip}
          onHideTooltip={onHideTooltip}
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
