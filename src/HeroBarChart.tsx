import { FC, useState } from 'react';
import { random, sampleSize } from 'lodash-es';

// import { Datum, VerticalBarChart } from './VerticalBarChart';
import { Datum, HorizontalBarChart } from './pages/BarChart/HorizontalBarChart';

const domain = ['A', 'B', 'C', 'D', 'E'];

function generateData(): Datum[] {
  const categories = sampleSize(domain, random(3, 5));
  categories.sort();
  return categories.map((category) => ({
    category,
    value: random(0, 150)
  }));
}

const margins = { top: 40, bottom: 48, left: 54, right: 40 };

type HeroChartProps = {
  width: number;
  height: number;
};

export const HeroBarChart: FC<HeroChartProps> = ({ width, height }) => {
  const [data] = useState(generateData);

  //   const colorScale = useMemo(
  //     () =>
  //       d3.scaleOrdinal<AxisDomain, string>(domain, [
  //         'text-slate-100',
  //         'text-slate-200',
  //         'text-slate-300',
  //         'text-slate-400',
  //         'text-slate-500'
  //       ]),
  //     []
  //   );

  return <HorizontalBarChart data={data} width={width} height={height} margins={margins} />;

  //   return (
  //     <VerticalBarChart data={data} width={width} height={height} margins={margins} />
  //   );
};
