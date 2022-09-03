import { memo, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { ScaleQuantize } from 'd3-scale';

import { EntityBucket } from '@/api/stateofjs/generated';

import geography from './countries-with-antarctica.json';
import { Statistic, TooltipDatum } from './types';
import { TooltipState } from './useVirtualElementTooltip';

export interface SVGWorldMapProps {
  width: number;
  height: number;
  data: (EntityBucket | undefined)[];
  colorScale: ScaleQuantize<string>;
  statistic: Statistic;
  showTooltip: TooltipState<TooltipDatum>['show'];
  hideTooltip: TooltipState<TooltipDatum>['hide'];
}

export const SVGWorldMap = memo(
  ({ width, height, data, colorScale, statistic, showTooltip, hideTooltip }: SVGWorldMapProps) => {
    const yearDataByCountry = useMemo(() => new Map(data.map((datum) => [datum?.id, datum])), [data]);
    return (
      <ComposableMap style={{ width, height }} projectionConfig={{ scale: 230 }}>
        <Geographies geography={geography}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const datum = yearDataByCountry.get(geo.id);
              const fillColor = datum ? colorScale(datum?.[statistic] ?? 0) : '#475569';
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { color: fillColor },
                    hover: { color: fillColor },
                    pressed: { color: fillColor }
                  }}
                  fill="currentColor"
                  className="outline-none"
                  onMouseMove={(event) => {
                    if (datum) {
                      showTooltip(
                        event.clientX,
                        event.clientY,
                        { datum, isoCode: geo.id, name: geo.properties.name },
                        (prev, curr) => prev.datum.id === curr.datum.id
                      );
                    }
                  }}
                  onMouseLeave={hideTooltip}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    );
  }
);
