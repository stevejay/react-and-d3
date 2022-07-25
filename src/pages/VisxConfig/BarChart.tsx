// import { ResizableBox } from 'react-resizable';
import { useMemo } from 'react';
import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';

// import { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { ExampleUpdateButton } from '@/components/ExampleUpdateButton';
import { InView } from '@/components/InView';
import { useDataSets } from '@/hooks/useDataSets';
import { SVGXYChart } from '@/visx-config/SVGXYChart';
import { AxisConfig, GridConfig } from '@/visx-config/types';
import { Margin } from '@/visx-next/types';

import 'react-resizable/css/styles.css';

interface Datum {
  category: string;
  value: number;
}

const dataSets: Datum[][] = [
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

const independentScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.9,
  paddingOuter: 0.2,
  round: true
};
const dependentScale: LinearScaleConfig<number> = { type: 'linear', nice: true, round: true, clamp: true };
const margin: Margin = { left: 64, top: 64, right: 64, bottom: 64 };
const independentAxis: AxisConfig = { position: 'start' };
const dependentAxis: AxisConfig = { position: 'start', hideZero: true, animate: true };
const independentGrid: GridConfig = {
  tickLineProps: {
    strokeDasharray: '1,3',
    className: 'text-slate-500'
  },
  tickCount: 5
};
const dependentGrid: GridConfig = {
  tickLineProps: {
    strokeDasharray: '1,3',
    className: 'text-slate-500'
  },
  tickCount: 5
};

export function BarChart() {
  const [data, nextDataSet] = useDataSets(dataSets);
  const series = useMemo(
    () => [
      {
        dataKey: 'data-a',
        data,
        label: 'Series 1',
        independentAccessor: (d: Datum) => d.category,
        dependentAccessor: (d: Datum) => d.value
      }
    ],
    [data]
  );
  return (
    <div className="my-8">
      <div className="relative w-full h-[384px] bg-slate-700">
        <InView>
          <SVGXYChart
            config={{
              series,
              independentScale,
              dependentScale,
              independentAxis,
              dependentAxis,
              independentGrid,
              dependentGrid,
              independentRangePadding: 10,
              dependentRangePadding: 20,
              horizontal: false,
              margin,
              animate: true
            }}
            role="graphics-document"
            aria-label="Some title"
            className="bg-slate-700"
          />
        </InView>
      </div>

      {/* <ResizableBox
        width={200}
        height={200}
        minConstraints={[100, 100]}
        maxConstraints={[600, 400]}
      >
        <SVGXYChart
          config={{
            data,
            independentAxis: xScale,
            dependentAxis: yScale,
            yRangePadding: 30,
            horizontal: false,
            debouncedMeasureWaitMs: 0
          }}
          role="graphics-document"
          aria-label="Some title"
        />
      </ResizableBox> */}

      <ExampleUpdateButton onClick={nextDataSet}>Update bar chart data</ExampleUpdateButton>
    </div>
  );
}
