import { useCallback, useMemo, useState } from 'react';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { gql } from 'graphql-tag';
import langmap from 'langmap';
import { sortBy } from 'lodash-es';

import { EntityBucket, useLocaleQuery } from '@/api/stateofjs/generated';
import { InView } from '@/components/InView';
import { SectionHeading } from '@/components/SectionHeading';
import { isDefined } from '@/types/typeguards/isDefined';
import { SvgXYChartAxis } from '@/visx-next/Axis';
import { XYChartBarSeries } from '@/visx-next/BarSeries';
// import { XYChartColumnGrid } from '@/visx-next/ColumnGrid';
import { PopperTooltip } from '@/visx-next/PopperTooltip';
import { BandScaleConfig, LinearScaleConfig } from '@/visx-next/scale';
import { SvgXYChart } from '@/visx-next/SvgXYChart';
import { Margin } from '@/visx-next/types';

import { LocationStatisticSelect } from './LocationStatisticSelect';
import { Statistic } from './types';

gql`
  query locale {
    survey(survey: state_of_js) {
      demographics {
        locale: locale(filters: {}, options: { cutoff: 20 }, facet: null) {
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

const yScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.3,
  paddingOuter: 0.4,
  round: true
} as const;

const xScale: LinearScaleConfig<number> = { type: 'linear', nice: true, round: true, clamp: true } as const;

const springConfig = { duration: 350, easing: easeCubicInOut };

const margin: Margin = { left: 120, right: 32, top: 32, bottom: 64 };

function yAccessor(d: EntityBucket) {
  return d.id ?? '';
}

function colorAccessor() {
  return schemeCategory10[8];
}

function getXAxisTickFormatter(statistic: Statistic) {
  switch (statistic) {
    case 'count':
      return format('~s');
    default:
      return format('~%');
  }
}

function getTooltipFormatter(statistic: Statistic) {
  switch (statistic) {
    case 'count':
      return format(',');
    default:
      return format('~%');
  }
}

// function getXAxisLabel(statistic: Statistic) {
//   switch (statistic) {
//     case 'count':
//       return 'User count';
//     case 'percentage_question':
//       return '% of question respondents';
//     case 'percentage_survey':
//       return '% of survey respondents';
//   }
// }

function yAxisTickFormatter(category: string) {
  return langmap[category]?.['englishName'] ?? 'Unknown';
}

export function RespondentsByLanguage() {
  const { data } = useLocaleQuery({});
  const [statistic, setStatistic] = useState<Statistic>('percentage_survey');
  const mappedData = useMemo(
    () =>
      sortBy(
        (data?.survey?.demographics?.locale?.year?.facets?.[0]?.buckets ?? [])
          .filter(isDefined)
          .map((bucket) => ({
            ...bucket,
            percentage_question: bucket.percentage_question
              ? bucket.percentage_question * 0.01
              : bucket.percentage_question,
            percentage_survey: bucket.percentage_survey
              ? bucket.percentage_survey * 0.01
              : bucket.percentage_survey
          })),
        [statistic],
        ['desc']
      ),
    [data, statistic]
  );
  const xAccessor = useCallback((d: EntityBucket) => d[statistic] ?? 0, [statistic]);
  const xAxisTickFormatter = useMemo(() => getXAxisTickFormatter(statistic), [statistic]);
  return (
    <div>
      <SectionHeading>Respondents by language</SectionHeading>
      <div className="space-y-8">
        <LocationStatisticSelect value={statistic} onChange={setStatistic} />
        {/* <WorldMapLegend colorScale={colorScale} statistic={statistic} className="w-64" /> */}
        <div className="space-y-2">
          <h3 className="mb-2 text-base text-slate-300">SVG implementation</h3>
          {/* <SVGWorldMapWithTooltip data={mapData} colorScale={colorScale} statistic={statistic} /> */}
          {/* </div>
        <div>
          <h3 className="mb-2 text-base text-slate-300">Canvas implementation (Mercator)</h3>
          <CanvasWorldMapWithTooltip data={mapData} colorScale={colorScale} statistic={statistic} />
        </div> */}
          <div className="relative w-full h-[720px]">
            <InView>
              <SvgXYChart
                margin={margin}
                xScale={xScale}
                yScale={yScale}
                springConfig={springConfig}
                role="graphics-document"
                aria-roledescription="Bar chart"
                aria-label="Some Important Results"
                horizontal
              >
                {/* <XYChartColumnGrid
                  className="text-slate-500"
                  shapeRendering="crispEdges"
                  strokeDasharray="1,3"
                  tickCount={5}
                /> */}
                <XYChartBarSeries
                  dataKey="data-a"
                  data={mappedData}
                  keyAccessor={yAccessor}
                  xAccessor={xAccessor}
                  yAccessor={yAccessor}
                  colorAccessor={colorAccessor}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  barProps={(datum) => ({
                    shapeRendering: 'crispEdges',
                    role: 'graphics-symbol',
                    'aria-roledescription': '',
                    'aria-label': `Category ${xAccessor(datum as EntityBucket)}: ${yAccessor(
                      datum as EntityBucket
                    )}`
                  })}
                />
                <SvgXYChartAxis
                  orientation="top"
                  tickFormat={xAxisTickFormatter}
                  hideTicks={false}
                  hideAxisLine
                  tickLabelPadding={6}
                  tickLabelProps={{
                    className: 'fill-slate-400 font-sans',
                    fontSize: 12,
                    textAnchor: 'middle',
                    verticalAnchor: 'end',
                    angle: 0
                  }}
                  labelProps={{
                    className: 'fill-slate-400 font-sans',
                    textAnchor: 'middle',
                    fontSize: 14
                  }}
                  tickLineProps={{ shapeRendering: 'crispEdges' }}
                  domainPathProps={{ shapeRendering: 'crispEdges' }}
                  labelPadding={10}
                  // animate={false}
                />
                {/* <SvgXYChartAxis
                  orientation="bottom"
                  label={getXAxisLabel(statistic)}
                  tickFormat={xAxisTickFormatter}
                  hideTicks={false}
                  hideAxisLine
                  tickLabelPadding={14}
                  tickLabelProps={{
                    className: 'fill-slate-400 font-sans',
                    fontSize: 12,
                    textAnchor: 'middle',
                    verticalAnchor: 'end',
                    angle: 0
                  }}
                  labelProps={{
                    className: 'fill-slate-400 font-sans',
                    textAnchor: 'middle',
                    fontSize: 14
                  }}
                  tickLineProps={{ shapeRendering: 'crispEdges' }}
                  domainPathProps={{ shapeRendering: 'crispEdges' }}
                  labelPadding={20}
                  animate={false}
                /> */}
                {/* <SvgXYChartAxis
                  orientation="left"
                  tickFormat={yAxisTickFormatter}
                  tickLabelPadding={6}
                  tickLabelProps={{
                    className: 'fill-slate-400 font-sans',
                    fontSize: 12,
                    textAnchor: 'end',
                    verticalAnchor: 'middle',
                    angle: -45
                  }}
                  tickLineProps={{ shapeRendering: 'crispEdges' }}
                  domainPathProps={{ shapeRendering: 'crispEdges' }}
                /> */}
                <PopperTooltip<EntityBucket>
                  snapTooltipToDatumY
                  showHorizontalCrosshair
                  showDatumGlyph={false}
                  renderTooltip={({ tooltipData }) => {
                    const datum = tooltipData?.nearestDatum;
                    if (!datum) {
                      return null;
                    }
                    return (
                      <div>
                        <span className="text-slate-600">{yAxisTickFormatter(datum.datum?.id ?? '')}: </span>
                        {getTooltipFormatter(statistic)(datum.datum?.[statistic] ?? 0)}
                      </div>
                    );
                  }}
                />
              </SvgXYChart>
            </InView>
          </div>
        </div>
      </div>
    </div>
  );
}
