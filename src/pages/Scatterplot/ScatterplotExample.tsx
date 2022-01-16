import { FC, useMemo } from 'react';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import type { Margins, PointDatum } from '@/types';

import { irisData, IrisDatum } from './data';
import { Scatterplot } from './Scatterplot';

const margins: Margins = { left: 56, right: 40, top: 40, bottom: 48 };

function isCompact(width: number) {
  return Boolean(width) && width < 500;
}

function getPointClassName(d: PointDatum<IrisDatum>) {
  switch (d.datum.species) {
    case 'setosa':
      return 'fill-sky-500/50';
    case 'versicolor':
      return 'fill-red-500/50';
    case 'virginica':
      return 'fill-orange-500/50';
  }
}

export const ScatterplotExample: FC = () => {
  const data = useMemo(
    () => irisData.map((d) => ({ x: d.sepalLength, y: d.petalLength, datum: d as IrisDatum })),
    []
  );
  return (
    <ExampleChartWrapper title="Example 1: React zoomable scatterplot" sizerClassName="h-[384px]">
      {({ inView, width, height, ariaLabelledby }) =>
        inView && (
          <Scatterplot
            ariaLabelledby={ariaLabelledby}
            data={data}
            width={width}
            height={height}
            margins={margins}
            compact={isCompact(width)}
            // pointsGroupClassName="stroke-0"
            pointClassName={getPointClassName}
            pointRadius={8}
          />
        )
      }
    </ExampleChartWrapper>
  );
};
