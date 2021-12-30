import { FC, useCallback, useState } from 'react';

import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useBreakpoint } from '@/useBreakpoint';
import { useDataSets } from '@/useDataSets';

import { Datum, RadarChart } from './RadarChart';

const dataSets = [
  [
    { key: 'one', value: 89.34, label: 'Category One' },
    { key: 'two', value: 83.56, label: 'Category Two' },
    { key: 'three', value: 81.32, label: 'Category Three' },
    { key: 'four', value: 102.974, label: 'Category Four' },
    { key: 'five', value: 87.247, label: 'Category Five' }
  ],
  [
    { key: 'one', value: 40, label: 'Category One' },
    { key: 'two', value: 150, label: 'Category Two' },
    { key: 'three', value: 20, label: 'Category Three' },
    { key: 'four', value: 63.9, label: 'Category Four' },
    { key: 'five', value: 0, label: 'Category Five' }
  ],
  [
    { key: 'one', value: 0, label: 'Category One' },
    { key: 'two', value: 0, label: 'Category Two' },
    { key: 'three', value: 0, label: 'Category Three' },
    { key: 'four', value: 0, label: 'Category Four' },
    { key: 'five', value: 0, label: 'Category Five' }
  ]
];

export type RadarChartExamplesProps = {
  transitionSeconds: number;
};

export const RadarChartExamples: FC<RadarChartExamplesProps> = () => {
  const [selectedKey, setSelectedKey] = useState<Datum['key']>('one');
  const onShowTooltip = useCallback(() => console.log('onShowTooltip'), []);
  const onHideTooltip = useCallback(() => console.log('onHideTooltip'), []);
  const [data, nextDataSet] = useDataSets(dataSets);
  const { breakpoint } = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

  return (
    <>
      <div className="flex flex-col items-center w-full py-8 space-y-8 bg-slate-900">
        <RadarChart
          data={data}
          label="Some label"
          compact={isMobile}
          selectedKey={selectedKey}
          diameter={isMobile ? 340 : 420}
          onSelect={setSelectedKey}
          onShowTooltip={onShowTooltip}
          onHideTooltip={onHideTooltip}
        />
        <ExampleUpdateButton onClick={nextDataSet}>Update radar chart data</ExampleUpdateButton>
      </div>
    </>
  );
};
