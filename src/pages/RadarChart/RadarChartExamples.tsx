import { FC, useCallback, useState } from 'react';

import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import type { CategoryValueDatum } from '@/types';
import { useBreakpoint } from '@/useBreakpoint';
import { useDataSets } from '@/useDataSets';

import { RadarChart } from './RadarChart';

const dataSets: readonly CategoryValueDatum<string, number>[][] = [
  [
    { category: 'one', value: 89.34 },
    { category: 'two', value: 83.56 },
    { category: 'three', value: 81.32 },
    { category: 'four', value: 102.974 },
    { category: 'five', value: 87.247 }
  ],
  [
    { category: 'one', value: 40 },
    { category: 'two', value: 150 },
    { category: 'three', value: 20 },
    { category: 'four', value: 63.9 },
    { category: 'five', value: 0 }
  ],
  [
    { category: 'one', value: 0 },
    { category: 'two', value: 0 },
    { category: 'three', value: 0 },
    { category: 'four', value: 0 },
    { category: 'five', value: 0 }
  ]
];

function getCategoryLabel(datum: CategoryValueDatum<string, number>) {
  switch (datum.category) {
    case 'one':
      return 'Category One';
    case 'two':
      return 'Category Two';
    case 'three':
      return 'Category Three';
    case 'four':
      return 'Category Four';
    case 'five':
      return 'Category Five';
    default:
      return '';
  }
}

export const RadarChartExamples: FC = () => {
  const onShowTooltip = useCallback(() => console.log('onShowTooltip'), []);
  const onHideTooltip = useCallback(() => console.log('onHideTooltip'), []);
  const [data, nextDataSet] = useDataSets(dataSets);
  const [selectedCategory, setSelectedCategory] = useState(data[0].category);
  const { breakpoint } = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

  return (
    <div className="flex flex-col items-center w-full py-8 space-y-8 bg-slate-900">
      <RadarChart
        data={data}
        title="This is the radar chart label"
        categoryLabel={getCategoryLabel}
        selectedCategory={selectedCategory}
        compact={isMobile}
        diameter={isMobile ? 340 : 420}
        onSelect={(d) => setSelectedCategory(d.category)}
        onShowTooltip={onShowTooltip}
        onHideTooltip={onHideTooltip}
        datumAriaRoleDescription={getCategoryLabel}
        datumAriaLabel={(d) => `${d.value}`}
        datumAriaDescription={(d) => `This is the description for ${getCategoryLabel(d)}`}
      />
      <ExampleUpdateButton onClick={nextDataSet}>Update radar chart data</ExampleUpdateButton>
    </div>
  );
};
