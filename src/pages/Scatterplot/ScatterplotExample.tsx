import { FC, useMemo } from 'react';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import type { Margins } from '@/types';

import irisData from './iris.json';
import { ScatterplotWithD3Zoom } from './ScatterplotWithD3Zoom';
// import { Scatterplot } from './Scatterplot';

const margins: Margins = { left: 56, right: 40, top: 40, bottom: 48 };

function isCompact(width: number) {
  return Boolean(width) && width < 500;
}

export const ScatterplotExample: FC = () => {
  const data = useMemo(() => irisData.map((d) => ({ x: d.sepalLength, y: d.petalLength })), []);
  return (
    <ExampleChartWrapper title="Example 1: React zoomable scatterplot" sizerClassName="h-[384px]">
      {({ inView, width, height, ariaLabelledby }) =>
        inView && (
          <ScatterplotWithD3Zoom
            ariaLabelledby={ariaLabelledby}
            data={data}
            width={width}
            height={height}
            margins={margins}
            compact={isCompact(width)}
          />
        )
      }
    </ExampleChartWrapper>
  );
};
