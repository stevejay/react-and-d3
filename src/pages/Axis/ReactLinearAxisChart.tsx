import { FC, memo } from 'react';
import { identity } from 'lodash-es';

import { Svg } from '@/components/Svg';
import { SvgAxis } from '@/components/SvgAxis';
import { useChartArea } from '@/hooks/useChartArea';
import { useContinuousDomain } from '@/hooks/useContinuousDomain';
import { useLinearScale } from '@/hooks/useLinearScale';
import type { TickLabelOrientation } from '@/types';

const margins = { top: 20, bottom: 34, left: 24, right: 24 };

export type ReactLinearAxisChartProps = {
  data: number[];
  width: number;
  height: number;
  ariaLabelledby: string;
  transitionSeconds?: number;
  tickLabelOrientation: TickLabelOrientation;
};

export const ReactLinearAxisChart: FC<ReactLinearAxisChartProps> = memo(
  ({ data, width, height, ariaLabelledby, tickLabelOrientation, transitionSeconds = 0.25 }) => {
    const chartArea = useChartArea(width, height, margins);
    const domain = useContinuousDomain(data, identity);
    const scale = useLinearScale(domain, chartArea.rangeWidth, {
      nice: true,
      rangeRound: true
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
