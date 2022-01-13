import { FC } from 'react';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';
import type { Margins, PointDatum } from '@/types';

import { D3Scatterplot } from './D3Scatterplot';

const dataSets: PointDatum[][] = [
  [
    { x: 20, y: 89.34 },
    { x: 10, y: 83.56 },
    { x: 13, y: 82 },
    { x: 50, y: 81.32 },
    { x: -10, y: 102.974 },
    { x: 66, y: 87.247 }
  ],
  [
    { x: 10, y: 83.56 },
    { x: 50, y: 81.32 },
    { x: 110, y: 63.9 }
  ],
  [
    { x: 5, y: 0 },
    { x: 2, y: 10 },
    { x: 0, y: 63 },
    { x: 10, y: 24 }
  ],
  [
    { x: -10, y: 10 },
    { x: 0, y: -20 },
    { x: -100, y: -63 },
    { x: -33, y: -24 }
  ]
];

const margins: Margins = { left: 56, right: 40, top: 40, bottom: 48 };

// function isCompact(width: number) {
//   return Boolean(width) && width < 500;
// }

export const D3ScatterplotExample: FC = () => {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <div className="my-8">
      <ExampleChartWrapper title="Example 2: Horizontal Bar Chart" sizerClassName="h-[384px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <D3Scatterplot
              ariaLabelledby={ariaLabelledby}
              data={data}
              width={width}
              height={height}
              margins={margins}
              //   compact={isCompact(width)}
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={nextDataSet}>Update bar chart data</ExampleUpdateButton>
    </div>
  );
};
