import { isNil } from './isNil';
import type { LegendDatum } from './types';

export interface LegendProps {
  legendData: Record<string, LegendDatum>;
  colorAccessor?: (dataKey: string) => string;
}

export function Legend({ legendData, colorAccessor }: LegendProps) {
  const dataKeys = Object.keys(legendData);
  return (
    <ul className="flex gap-4 justify-center mb-4" role="presentation">
      {dataKeys.map((dataKey) => {
        const legendDatum = legendData[dataKey];
        return legendDatum ? (
          <li key={dataKey} className="flex items-center gap-2" role="presentation" aria-hidden>
            {(isNil(legendDatum.glyph) || legendDatum.glyph === 'square') && (
              <span
                className="block w-4 h-4"
                style={{ backgroundColor: legendDatum.color ?? colorAccessor?.(dataKey) }}
              />
            )}
            {legendDatum.label}
          </li>
        ) : null;
      })}
    </ul>
  );
}
