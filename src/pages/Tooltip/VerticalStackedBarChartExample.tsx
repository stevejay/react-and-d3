import { FC, Fragment } from 'react';
import { schemeSet3 } from 'd3-scale-chromatic';
import { capitalize, round } from 'lodash-es';

import { ExampleChartWrapper } from '@/components/ExampleChartWrapper';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';
import type { CategoryValueListDatum, Margins } from '@/types';

import { VerticalStackedBarChartWithTooltip } from './VerticalStackedBarChartWithTooltip';

const dataSets: readonly CategoryValueListDatum<string, number>[][] = [
  [
    { category: 'A', values: { one: 20, two: 0, three: 0 } },
    { category: 'B', values: { one: 83.56, two: 20, three: 40 } },
    { category: 'C', values: { one: 81.32, two: 50, three: 60 } },
    { category: 'D', values: { one: 102.974, two: 10, three: 0 } },
    { category: 'E', values: { one: 87.247, two: 0, three: 40 } }
  ],
  [
    { category: 'B', values: { one: 150, two: 3, three: 80 } },
    { category: 'C', values: { one: 20, two: 40, three: 70 } },
    { category: 'D', values: { one: 63.9, two: 30, three: 30 } }
  ],
  [
    { category: 'A', values: { one: 0, two: 90, three: 10 } },
    { category: 'B', values: { one: 10, two: 45, three: 58 } },
    { category: 'D', values: { one: 63, two: 28, three: 4 } },
    { category: 'E', values: { one: 24, two: 16, three: 110 } }
  ]
];

const margins: Margins = { left: 72, right: 40, top: 40, bottom: 64 };
const seriesKeys = ['one', 'two', 'three'];

function getCategoryLabel(datum: CategoryValueListDatum<string, number>) {
  return datum.category;
}

function renderTooltipContent(d: CategoryValueListDatum<string, number>) {
  return (
    <>
      {seriesKeys.map((series, index) => (
        <Fragment key={series}>
          <span style={{ color: schemeSet3[index] }}>{capitalize(series)}:</span> {round(d.values[series], 2)}
          <br />
        </Fragment>
      ))}
    </>
  );
}

export const VerticalStackedBarChartExample: FC = () => {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <div className="my-8">
      <ExampleChartWrapper title="Example 2: A stacked bar chart with a tooltip" sizerClassName="h-[384px]">
        {({ inView, width, height, ariaLabelledby }) =>
          inView && (
            <VerticalStackedBarChartWithTooltip
              ariaLabelledby={ariaLabelledby}
              data={data}
              seriesKeys={seriesKeys}
              colorRange={schemeSet3}
              width={width}
              height={height}
              margins={margins}
              ariaRoleDescription="Stacked bar chart"
              datumAriaRoleDescription={getCategoryLabel}
              datumAriaLabel={(d, series) => `${d.values[series]}`}
              datumDescription={(d) => `This is the description for ${getCategoryLabel(d)}`}
              renderTooltipContent={renderTooltipContent}
              hideOnScroll
            />
          )
        }
      </ExampleChartWrapper>
      <ExampleUpdateButton onClick={nextDataSet}>Update bar chart data</ExampleUpdateButton>
    </div>
  );
};
