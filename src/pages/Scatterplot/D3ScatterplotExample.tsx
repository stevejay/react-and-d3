import { FC, useMemo } from 'react';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import type { Margins } from '@/types';

import { D3Scatterplot } from './D3Scatterplot';
import irisData from './iris.json';

const margins: Margins = { left: 56, right: 40, top: 40, bottom: 48 };

function isCompact(width: number) {
  return Boolean(width) && width < 500;
}

export const D3ScatterplotExample: FC = () => {
  const data = useMemo(() => irisData.map((d) => ({ x: d.sepalLength, y: d.petalLength })), []);
  return (
    <ExampleChartWrapper title="Example 2: D3 zoomable scatterplot" sizerClassName="h-[384px]">
      {({ inView, width, height, ariaLabelledby }) =>
        inView && (
          <D3Scatterplot
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
