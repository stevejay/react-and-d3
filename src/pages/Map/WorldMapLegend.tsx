import { ScaleQuantize } from 'd3-scale';

import { formatStatistic } from './formatStatistic';
import { Statistic } from './types';

export interface WorldMapLegendProps {
  colorScale: ScaleQuantize<string>;
  statistic: Statistic;
  className?: string;
}

export function WorldMapLegend({ colorScale, statistic, className = '' }: WorldMapLegendProps) {
  const domain = colorScale.domain();
  if (!domain || !isFinite(domain[0]) || !isFinite(domain[1])) {
    return null;
  }

  return (
    <div className={`w-full flex pb-4 ${className}`}>
      {colorScale.range().map((value, index) => {
        const [low] = colorScale.invertExtent(value);
        return (
          <div
            key={low}
            style={{ width: `${100 / colorScale.range().length}%`, backgroundColor: colorScale(low) }}
            className="h-2 relative"
          >
            {index > 0 && (
              <div className="absolute left-0 top-4 translate-x-[-50%] font-light text-xs">
                {formatStatistic(low, statistic)}
              </div>
            )}
            {index > 0 && <div className="absolute left-0 top-0 h-3 w-[1px] bg-slate-300" />}
          </div>
        );
      })}
    </div>
  );
}
