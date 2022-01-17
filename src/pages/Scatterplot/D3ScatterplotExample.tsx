import { FC, useMemo } from 'react';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import type { Margins, PointDatum } from '@/types';

import { D3Scatterplot } from './D3Scatterplot';
import { irisData, IrisDatum } from './scatterplotData';

const margins: Margins = { left: 56, right: 40, top: 40, bottom: 48 };

function isCompact(width: number) {
  return Boolean(width) && width < 500;
}

function renderTooltipContent(datum: PointDatum<IrisDatum>) {
  return (
    <>
      Sepal Length: {datum.datum.sepalLength}
      <br />
      Petal Length: {datum.datum.petalLength}
    </>
  );
}

export const D3ScatterplotExample: FC = () => {
  const data = useMemo(
    () => irisData.map((datum) => ({ x: datum.sepalLength, y: datum.petalLength, datum })),
    []
  );
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
            renderTooltipContent={renderTooltipContent}
          />
        )
      }
    </ExampleChartWrapper>
  );
};
