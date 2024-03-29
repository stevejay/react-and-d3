import { useMemo, useState } from 'react';
import { extent } from 'd3-array';
import { scaleQuantize } from 'd3-scale';
import { schemePuBu } from 'd3-scale-chromatic';
import { gql } from 'graphql-tag';

import { EntityBucket, useCountryQuery } from '@/api/stateofjs/generated';

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

export function RespondentsByCountry() {
  const { data } = useCountryQuery({});
  const mapData = useMemo(
    () => data?.survey?.demographics?.country?.year?.facets?.[0]?.buckets ?? [],
    [data]
  );
  return (
    <div className="flex flex-col space-y-8">
      <RespondentsByCountrySVG data={mapData} />
      <RespondentsByCountryCanvas data={mapData} />
    </div>
  );
}

function RespondentsByCountrySVG({ data }: { data: (EntityBucket | undefined)[] }) {
  const [statistic, setStatistic] = useState<Statistic>('percentage_survey');
  const colorScale = useMemo(
    () =>
      scaleQuantize<string>()
        .domain(extent(data, (datum) => datum?.[statistic]) as [number, number])
        .nice()
        .range(schemePuBu[6]),
    [data, statistic]
  );
  return (
    <>
      <LocationStatisticSelect value={statistic} onChange={setStatistic} />
      <div className="space-y-3">
        <h3 className="text-base text-slate-300">SVG implementation (Equal Earth projection)</h3>
        <SVGWorldMapWithTooltip data={data} colorScale={colorScale} statistic={statistic} />
        <WorldMapLegend colorScale={colorScale} statistic={statistic} className="w-64" />
      </div>
    </>
  );
}

function RespondentsByCountryCanvas({ data }: { data: (EntityBucket | undefined)[] }) {
  const [statistic, setStatistic] = useState<Statistic>('percentage_survey');
  const colorScale = useMemo(
    () =>
      scaleQuantize<string>()
        .domain(extent(data, (datum) => datum?.[statistic]) as [number, number])
        .nice()
        .range(schemePuBu[6]),
    [data, statistic]
  );
  return (
    <>
      <LocationStatisticSelect value={statistic} onChange={setStatistic} />
      <div className="space-y-3">
        <h3 className="text-base text-slate-300">Canvas implementation (Mercator projection)</h3>
        <CanvasWorldMapWithTooltip data={data} colorScale={colorScale} statistic={statistic} />
        <WorldMapLegend colorScale={colorScale} statistic={statistic} className="w-64" />
      </div>
    </>
  );
}
