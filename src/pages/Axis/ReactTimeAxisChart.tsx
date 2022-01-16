import { FC, memo } from 'react';

import { Svg } from '@/components/Svg';
import { SvgAxis } from '@/components/SvgAxis';
import { useChartArea } from '@/hooks/useChartArea';
import { useTimeDomain } from '@/hooks/useTimeDomain';
import { useTimeScale } from '@/hooks/useTimeScale';
import type { TickLabelOrientation } from '@/types';

import { yearMonthMultiFormat } from './format';

const margins = { top: 20, bottom: 48, left: 32, right: 24 };

export type ReactTimeAxisChartProps = {
  data: Date[];
  width: number;
  height: number;
  ariaLabelledby: string;
  transitionSeconds?: number;
  tickLabelOrientation: TickLabelOrientation;
};

export const ReactTimeAxisChart: FC<ReactTimeAxisChartProps> = memo(
  ({ data, width, height, ariaLabelledby, tickLabelOrientation, transitionSeconds = 0.25 }) => {
    const chartArea = useChartArea(width, height, margins);
    const domain = useTimeDomain(data);
    const scale = useTimeScale(domain, chartArea.rangeWidth, {
      nice: true,
      rangeRound: true,
      utc: true
    });

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
          tickFormat={yearMonthMultiFormat}
          className="text-[10px]"
          transitionSeconds={transitionSeconds}
        />
      </Svg>
    );
  },
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.transitionSeconds === nextProps.transitionSeconds &&
    prevProps.tickLabelOrientation === nextProps.tickLabelOrientation
);
