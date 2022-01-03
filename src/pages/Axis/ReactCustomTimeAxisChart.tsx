import { FC, memo, useMemo } from 'react';
import { max, min } from 'd3-array';
import { easeCubicInOut } from 'd3-ease';
import { MotionConfig } from 'framer-motion';

import { Svg } from '@/components/Svg';
import { SvgCustomTimeAxis } from '@/components/SvgCustomTimeAxis';
import { useChartArea } from '@/hooks/useChartArea';
import { useTimeScale } from '@/hooks/useTimeScale';
import { lastMomentOfThisMonth, startOfThisMonth } from '@/utils/dateUtils';

const margins = { top: 20, bottom: 60, left: 30, right: 30 };

export type ReactCustomTimeAxisChartProps = {
  data: Date[];
  width: number;
  height: number;
  ariaLabelledby: string;
  transitionSeconds?: number;
};

export const ReactCustomTimeAxisChart: FC<ReactCustomTimeAxisChartProps> = memo(
  ({ data, width, height, ariaLabelledby, transitionSeconds = 0.25 }) => {
    const chartArea = useChartArea(width, height, margins);

    const domain = useMemo(() => {
      const now = new Date();
      const minDate = startOfThisMonth(min(data) ?? now);
      const maxDate = lastMomentOfThisMonth(max(data) ?? now);
      return [minDate, maxDate];
    }, [data]);

    const scale = useTimeScale(domain, chartArea.xRange, { utc: true, rangeRound: true });

    if (!width || !height) {
      return null;
    }

    return (
      <MotionConfig transition={{ duration: transitionSeconds, ease: easeCubicInOut }}>
        <Svg
          width={width}
          height={height}
          className="font-sans select-none bg-slate-800"
          aria-labelledby={ariaLabelledby}
        >
          <SvgCustomTimeAxis
            scale={scale}
            translateX={chartArea.translateX}
            translateY={chartArea.translateY + chartArea.height}
          />
        </Svg>
      </MotionConfig>
    );
  },
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.transitionSeconds === nextProps.transitionSeconds
);
