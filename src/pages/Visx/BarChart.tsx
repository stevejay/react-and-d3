import { FC } from 'react';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { AnimatedAxis } from '@visx/react-spring';
import { scaleBand, scaleLinear } from '@visx/scale';

import { CategoryValueDatum, Margins } from '@/types';

export type BarChartProps = {
  data: CategoryValueDatum<string, number>[];
  margins: Margins;
  width: number;
  height: number;
};

export const BarChart: FC<BarChartProps> = ({ data, margins, width, height }) => {
  const categoryScale = scaleBand<string>({
    domain: data.map((datum) => datum.category),
    paddingInner: 0.3,
    paddingOuter: 0.2
  });

  const valueScale = scaleLinear<number>({
    domain: [0, Math.max(...data.map((datum) => datum.value))],
    nice: true,
    clamp: true
  });

  const xMax = width - margins.left - margins.right;
  const yMax = height - margins.top - margins.bottom;

  categoryScale.rangeRound([0, xMax]);
  valueScale.range([yMax, 0]);

  return (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} className="fill-slate-800" rx={14} />
      <AnimatedAxis
        orientation="left"
        top={margins.top}
        left={margins.left}
        scale={valueScale}
        // axisLineClassName="stroke-slate-300"
        hideAxisLine
        // tickLineProps={{
        //   width: -xMax,
        //   className: 'stroke-slate-300'
        // }}
        // tickLength={-xMax}
        tickLabelProps={() => ({
          className: 'fill-slate-200 text-xs',
          textAnchor: 'end',
          verticalAnchor: 'middle'
        })}
      />
      <Group top={margins.top} left={margins.left}>
        <GridRows
          scale={valueScale}
          width={xMax}
          height={yMax}
          stroke="currentColor"
          className="text-slate-600"
        />
      </Group>
      <AnimatedAxis
        orientation="bottom"
        top={yMax + margins.top}
        left={margins.left}
        scale={categoryScale}
        hideTicks
        axisLineClassName="stroke-slate-300"
        tickLength={10}
        tickLabelProps={() => ({
          className: 'fill-slate-200 text-sm',
          textAnchor: 'middle',
          verticalAnchor: 'start'
        })}
      />
    </svg>
  );
};
