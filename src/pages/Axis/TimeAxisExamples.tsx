import { SpringConfig } from 'react-spring';

import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';

import { AxisExampleChartWrapper } from './AxisExampleChartWrapper';
import { AxisExamplesWrapper } from './AxisExamplesWrapper';
import { D3TimeAxisChart } from './D3TimeAxisChart';
import { ReactTimeAxisChart } from './ReactTimeAxisChart';

const dataSets = [
  [new Date(Date.UTC(2000, 0, 1)), new Date(Date.UTC(2000, 9, 1))],
  [new Date(Date.UTC(1999, 8, 1)), new Date(Date.UTC(2000, 4, 1))],
  [new Date(Date.UTC(1999, 10, 1)), new Date(Date.UTC(2001, 1, 1))]
];

export interface TimeAxisExamplesProps {
  transitionSeconds: number;
  springConfig: SpringConfig;
}

export function TimeAxisExamples({ transitionSeconds, springConfig }: TimeAxisExamplesProps) {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <AxisExamplesWrapper>
      <AxisExampleChartWrapper title="Rendered using React" sizerClassName="h-[112px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <ReactTimeAxisChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              springConfig={springConfig}
              tickLabelOrientation="angled"
            />
          )
        }
      </AxisExampleChartWrapper>
      <AxisExampleChartWrapper title="Rendered using D3" sizerClassName="h-[112px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <D3TimeAxisChart
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              transitionSeconds={transitionSeconds}
              tickLabelOrientation="horizontal"
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
