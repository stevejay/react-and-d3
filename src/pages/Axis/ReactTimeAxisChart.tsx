import { FC, memo } from 'react';
import { easeCubicInOut } from 'd3';
import { MotionConfig } from 'framer-motion';
import { identity } from 'lodash-es';

import { Svg } from '@/components/Svg';
import { SvgAxis } from '@/components/SvgAxis';
import { useChartArea } from '@/hooks/useChartArea';
import { useTimeDomain } from '@/hooks/useTimeDomain';
import { useTimeScale } from '@/hooks/useTimeScale';
import type { AxisLabelOrientation } from '@/types';

import { yearMonthMultiFormat } from './formatters';

const margins = { top: 20, bottom: 48, left: 48, right: 32 };

export type ReactTimeAxisChartProps = {
  data: Date[];
  width: number;
  height: number;
  ariaLabelledby: string;
  transitionSeconds?: number;
  labelOrientation: AxisLabelOrientation;
};

export const ReactTimeAxisChart: FC<ReactTimeAxisChartProps> = memo(
  ({ data, width, height, ariaLabelledby, labelOrientation, transitionSeconds = 0.25 }) => {
    const chartArea = useChartArea(width, height, margins);
    const domain = useTimeDomain(data, identity);
    const scale = useTimeScale(domain, chartArea.xRange, {
      nice: true,
      rangeRound: true,
      utc: true
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
          <SvgAxis
            scale={scale}
            translateX={chartArea.translateX}
            translateY={chartArea.translateY + chartArea.height}
            orientation="bottom"
            tickSizeOuter={-chartArea.height}
            labelOrientation={labelOrientation}
            tickFormat={yearMonthMultiFormat}
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
    prevProps.labelOrientation === nextProps.labelOrientation
);
