import { memo, useMemo } from 'react';
import { SpringConfig } from 'react-spring';
import { max, min } from 'd3-array';

import { Svg } from '@/components/Svg';
import { SvgCustomTimeAxis } from '@/components/SvgCustomTimeAxis';
import { useChartArea } from '@/hooks/useChartArea';
import { useTimeScale } from '@/hooks/useTimeScale';
import { lastMomentOfThisMonth, startOfThisMonth } from '@/utils/dateUtils';

const margins = { top: 20, bottom: 70, left: 20, right: 20 };

export interface ReactCustomTimeAxisChartProps {
  data: Date[];
  width: number;
  height: number;
  ariaLabelledby: string;
  springConfig: SpringConfig;
}

export const ReactCustomTimeAxisChart = memo<ReactCustomTimeAxisChartProps>(
  ({ data, width, height, ariaLabelledby, springConfig }) => {
    const chartArea = useChartArea(width, height, margins);

    const domain = useMemo(() => {
      const now = new Date();
      const minDate = startOfThisMonth(min(data) ?? now);
      const maxDate = lastMomentOfThisMonth(max(data) ?? now);
      return [minDate, maxDate];
    }, [data]);

    const scale = useTimeScale(domain, chartArea.rangeWidth, { utc: true, rangeRound: true });

    if (!width || !height) {
      return null;
    }

    return (
      <Svg
        width={width}
        height={height}
        className="font-sans select-none bg-slate-800"
        aria-labelledby={ariaLabelledby}
      >
        <SvgCustomTimeAxis scale={scale} chartArea={chartArea} springConfig={springConfig} />
      </Svg>
    );
  },
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.springConfig === nextProps.springConfig
);
