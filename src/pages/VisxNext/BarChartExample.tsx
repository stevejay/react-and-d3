import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { useDataSets } from '@/hooks/useDataSets';
import { Margin } from '@/types';

import { BarChart } from './BarChart';

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

const margin: Margin = { left: 72, right: 40, top: 40, bottom: 64 };

// function isCompact(width: number) {
//   return Boolean(width) && width < 500;
// }

// function renderTooltipContent(datum: CategoryValueListDatum<string, number>) {
//   return (
//     <>
//       {seriesKeys.map((series, index) => (
//         <Fragment key={series}>
//           <span style={{ color: schemeSet3[index] }}>{capitalize(series)}:</span>{' '}
//           {format('.2f')(datum.values[series])}
//           <br />
//         </Fragment>
//       ))}
//     </>
//   );
// }

export function BarChartExample() {
  const [data, nextDataSet] = useDataSets(dataSets);
  return (
    <div className="my-8">
      <div className="relative overflow-hidden w-full h-[384px]">
        <BarChart data={data} margin={margin} />
      </div>
      <ExampleUpdateButton onClick={nextDataSet}>Update bar chart data</ExampleUpdateButton>
    </div>
  );
}
