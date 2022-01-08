import { FC, memo } from 'react';
import { easeCubicInOut } from 'd3-ease';
import { MotionConfig } from 'framer-motion';

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
  transitionSeconds?: number;
  tickLabelOrientation: TickLabelOrientation;
};

export const ReactBandAxisChart: FC<ReactBandAxisChartProps> = memo(
  ({ data, width, height, ariaLabelledby, tickLabelOrientation, transitionSeconds = 0.25 }) => {
    const chartArea = useChartArea(width, height, margins);
    const scale = useBandScale(data, chartArea.rangeWidth, { rangeRound: true });

    if (!width || !height) {
      return null;
    }

    return (
      <MotionConfig transition={{ duration: transitionSeconds, ease: easeCubicInOut }}>
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
          />
        </Svg>
      </MotionConfig>
    );
  },
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.transitionSeconds === nextProps.transitionSeconds &&
    prevProps.tickLabelOrientation === nextProps.tickLabelOrientation
);
