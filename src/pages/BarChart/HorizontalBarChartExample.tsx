import { FC } from 'react';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExamplesSectionWrapper } from '@/components/ExamplesSectionWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';
import type { CategoryValueDatum, Margins } from '@/types';

import { HorizontalBarChart } from './HorizontalBarChart';

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

const margins: Margins = { left: 64, right: 40, top: 40, bottom: 64 };

function getCategoryLabel(datum: CategoryValueDatum<string, number>) {
  return datum.category;
}

export const HorizontalBarChartExample: FC = () => {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <ExamplesSectionWrapper>
      <ExampleChartWrapper title="Horizontal Bar Chart" sizerClassName="h-96">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <HorizontalBarChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              margins={margins}
              ariaRoleDescription="Bar chart"
              datumAriaRoleDescription={getCategoryLabel}
              datumAriaLabel={(d) => `${d.value}`}
              datumAriaDescription={(d) => `This is the description for ${getCategoryLabel(d)}`}
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={nextDataSet}>Update bar chart data</ExampleUpdateButton>
    </ExamplesSectionWrapper>
  );
};
