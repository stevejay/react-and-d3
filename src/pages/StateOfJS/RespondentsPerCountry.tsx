import { useMemo, useState } from 'react';
import { extent } from 'd3-array';
import { scaleQuantize } from 'd3-scale';
import { schemePuBu } from 'd3-scale-chromatic';
import { gql } from 'graphql-tag';

import { useCountryQuery } from '@/api/stateofjs/generated';
import { SectionHeading } from '@/components/SectionHeading';

import { CanvasWorldMapWithTooltip } from './CanvasWorldMapWithTooltip';
import { LocationStatisticSelect } from './LocationStatisticSelect';
import { SVGWorldMapWithTooltip } from './SVGWorldMapWithTooltip';
import { Statistic } from './types';
import { WorldMapLegend } from './WorldMapLegend';

gql`
  query country {
    survey(survey: state_of_js) {
      demographics {
        country: country(filters: {}, options: {}, facet: null) {
          keys
          year(year: 2021) {
            year
            completion {
              total
              percentage_survey
              count
            }
            facets {
              id
              type
              completion {
                total
                percentage_question
                percentage_survey
                count
              }
              buckets {
                id
                count
                percentage_question
                percentage_survey
              }
            }
          }
        }
      }
    }
  }
`;

export function RespondentsPerCountry() {
  const { data } = useCountryQuery({});
  const mapData = useMemo(
    () => data?.survey?.demographics?.country?.year?.facets?.[0]?.buckets ?? [],
    [data]
  );
  const [statistic, setStatistic] = useState<Statistic>('percentage_survey');
  const colorScale = useMemo(
    () =>
      scaleQuantize<string>()
        .domain(extent(mapData, (datum) => datum?.[statistic]) as [number, number])
        .nice()
        .range(schemePuBu[6]),
    [mapData, statistic]
  );
  return (
    <>
      <SectionHeading>Respondents per country (Choropleth map)</SectionHeading>
      <div className="flex flex-col space-y-8">
        <LocationStatisticSelect value={statistic} onChange={setStatistic} />
        <WorldMapLegend colorScale={colorScale} statistic={statistic} className="w-64" />
        <div>
          <h3 className="mb-2 text-base text-slate-300">SVG implementation (Equal Earth)</h3>
          <SVGWorldMapWithTooltip data={mapData} colorScale={colorScale} statistic={statistic} />
        </div>
        <div>
          <h3 className="mb-2 text-base text-slate-300">Canvas implementation (Mercator)</h3>
          <CanvasWorldMapWithTooltip data={mapData} colorScale={colorScale} statistic={statistic} />
        </div>
      </div>
    </>
  );
}
