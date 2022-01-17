import { FC, memo } from 'react';
import { SpringConfig } from '@react-spring/web';

import { Svg } from '@/components/Svg';
import { SvgAxis } from '@/components/SvgAxis';
import { useBandScale } from '@/hooks/useBandScale';
import { useChartArea } from '@/hooks/useChartArea';
import type { TickLabelOrientation } from '@/types';

const margins = { top: 20, bottom: 34, left: 30, right: 30 };

export type ReactBandAxisChartProps = {
  data: string[];
  width: number;
  height: number;
  ariaLabelledby: string;
  springConfig: SpringConfig;
  tickLabelOrientation: TickLabelOrientation;
};

export const ReactBandAxisChart: FC<ReactBandAxisChartProps> = memo(
  ({ data, width, height, ariaLabelledby, tickLabelOrientation, springConfig }) => {
    const chartArea = useChartArea(width, height, margins);
    const scale = useBandScale(data, chartArea.rangeWidth, { rangeRound: true });

    if (!width || !height) {
      return null;
    }

    return (
      <Svg
        width={width}
        height={height}
        aria-labelledby={ariaLabelledby}
        className="font-sans select-none bg-slate-800"
      >
        <SvgAxis
          scale={scale}
          chartArea={chartArea}
          orientation="bottom"
          tickSizeOuter={-chartArea.height}
          tickLabelOrientation={tickLabelOrientation}
          className="text-[10px]"
          springConfig={springConfig}
        />
      </Svg>
    );
  },
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.springConfig === nextProps.springConfig &&
    prevProps.tickLabelOrientation === nextProps.tickLabelOrientation
);
