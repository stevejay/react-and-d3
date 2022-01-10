import { FC, useState } from 'react';
import { format } from 'd3-format';

import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useDataSets } from '@/hooks/useDataSets';
import type { CategoryValueDatum } from '@/types';

import { RadarChartWithTooltip } from './RadarChartWithTooltip';

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

function renderTooltipContent(datum: CategoryValueDatum<string, number>) {
  return (
    <>
      <span className="text-slate-400">{getCategoryLabel(datum)}:</span> {format('.2f')(datum.value)}
    </>
  );
}

export const RadarChartWithTooltipExample: FC = () => {
  const [data, nextDataSet] = useDataSets(dataSets);
  const [selectedCategory, setSelectedCategory] = useState(data[0].category);
  const { breakpoint } = useBreakpoint();
  const compact = breakpoint === 'mobile';
  return (
    <div className="flex flex-col items-center w-full py-8 space-y-8 bg-slate-900">
      <RadarChartWithTooltip
        data={data}
        title="This is the radar chart label"
        categoryLabel={getCategoryLabel}
        selectedCategory={selectedCategory}
        compact={compact}
        diameter={compact ? 340 : 420}
        onSelect={(d) => setSelectedCategory(d.category)}
        datumAriaRoleDescription={getCategoryLabel}
        datumAriaLabel={(d) => `${d.value}`}
        datumDescription={(d) => `This is the description for ${getCategoryLabel(d)}`}
        hideTooltipOnScroll
        renderTooltipContent={renderTooltipContent}
      />
      <ExampleUpdateButton onClick={nextDataSet}>Update radar chart data</ExampleUpdateButton>
    </div>
  );
};
