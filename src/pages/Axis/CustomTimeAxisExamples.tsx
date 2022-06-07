import { SpringConfig } from 'react-spring';

import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';

import { AxisExampleChartWrapper } from './AxisExampleChartWrapper';
import { AxisExamplesWrapper } from './AxisExamplesWrapper';
import { ReactCustomTimeAxisChart } from './ReactCustomTimeAxisChart';

const dataSets = [
  [new Date(Date.UTC(2000, 0, 1)), new Date(Date.UTC(2000, 9, 1))],
  [new Date(Date.UTC(1999, 8, 1)), new Date(Date.UTC(2000, 4, 1))],
  [new Date(Date.UTC(1999, 10, 1)), new Date(Date.UTC(2000, 2, 1))]
];

export interface CustomTimeAxisExamplesProps {
  springConfig: SpringConfig;
}

export function CustomTimeAxisExamples({ springConfig }: CustomTimeAxisExamplesProps) {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <AxisExamplesWrapper>
      <AxisExampleChartWrapper title="Rendered using React" sizerClassName="h-[112px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <ReactCustomTimeAxisChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width ?? 0}
              height={height ?? 0}
              springConfig={springConfig}
            />
          )
        }
      </AxisExampleChartWrapper>
      <ExampleUpdateButton variant="secondary" onClick={nextDataSet}>
        Update axis data
      </ExampleUpdateButton>
    </AxisExamplesWrapper>
  );
}
