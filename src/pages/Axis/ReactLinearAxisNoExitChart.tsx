import { FC, memo } from 'react';
import { easeCubicInOut } from 'd3-ease';
import { MotionConfig } from 'framer-motion';
import { identity } from 'lodash-es';

import { Svg } from '@/components/Svg';
import { SvgAxisNoExit } from '@/components/SvgAxisNoExit';
import { useChartArea } from '@/hooks/useChartArea';
import { useDomainContinuous } from '@/hooks/useDomainContinuous';
import { useScaleLinear } from '@/hooks/useScaleLinear';
import type { TickLabelOrientation } from '@/types';

const margins = { top: 20, bottom: 34, left: 30, right: 30 };

export type ReactLinearAxisNoExitChartProps = {
  data: number[];
  width: number;
  height: number;
  ariaLabelledby: string;
  transitionSeconds?: number;
  tickLabelOrientation: TickLabelOrientation;
};

export const ReactLinearAxisNoExitChart: FC<ReactLinearAxisNoExitChartProps> = memo(
  ({ data, width, height, ariaLabelledby, tickLabelOrientation, transitionSeconds = 0.25 }) => {
    const chartArea = useChartArea(width, height, margins);
    const domain = useDomainContinuous(data, identity);
    const scale = useScaleLinear(domain, chartArea.xRange, {
      nice: true,
      rangeRound: true
    });

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
          <SvgAxisNoExit
            scale={scale}
            chartArea={chartArea}
            orientation="bottom"
            tickSizeOuter={-chartArea.height}
            transitionSeconds={transitionSeconds}
            tickLabelOrientation={tickLabelOrientation}
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
