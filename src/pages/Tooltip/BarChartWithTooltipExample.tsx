import { FC } from 'react';
import { format } from 'd3-format';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';
import type { CategoryValueDatum, Margins } from '@/types';

import { BarChartWithTooltip } from './BarChartWithTooltip';

const dataSets = [
  [
    { category: 'A', value: 89.34 },
    { category: 'B', value: 83.56 },
    { category: 'C', value: 81.32 },
    { category: 'D', value: 102.974 },
    { category: 'E', value: 87.247 }
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
  ]
];

const margins: Margins = { left: 72, right: 40, top: 40, bottom: 64 };

function getCategoryLabel(datum: CategoryValueDatum<string, number>) {
  return datum.category;
}

function renderTooltipContent(d: CategoryValueDatum<string, number>) {
  return (
    <>
      {getCategoryLabel(d)}: {format('.2f')(d.value)}
    </>
  );
}

export const BarChartWithTooltipExample: FC = () => {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <div className="my-8">
      <ExampleChartWrapper
        title="Example 1: The &lsquo;follow on hover&rsquo; tooltip"
        sizerClassName="h-[384px]"
      >
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <BarChartWithTooltip
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              margins={margins}
              renderTooltipContent={renderTooltipContent}
              hideTooltipOnScroll={true}
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={nextDataSet}>Update bar chart data</ExampleUpdateButton>
    </div>
  );
};
