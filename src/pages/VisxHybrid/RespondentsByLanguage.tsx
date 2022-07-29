import { useCallback, useMemo, useState } from 'react';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
// import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';
import langmap from 'langmap';
// import langmap from 'langmap';
import { sortBy } from 'lodash-es';

import { EntityBucket, useLocaleQuery } from '@/api/stateofjs/generated';
import { InView } from '@/components/InView';
import { SectionHeading } from '@/components/SectionHeading';
import { isDefined } from '@/types/typeguards/isDefined';
import { PopperTooltip } from '@/visx-hybrid/PopperTooltip';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGAxisRenderer } from '@/visx-hybrid/SVGAxisRenderer';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
// import { SVGBarSeriesRenderer } from '@/visx-hybrid/SVGBarSeriesRenderer';
import { SVGFancyBarSeriesRenderer } from '@/visx-hybrid/SVGFancyBarSeriesRenderer';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGStripes } from '@/visx-hybrid/SVGStripes';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';
import { BandScaleConfig, LinearScaleConfig } from '@/visx-next/scale';

import { LocationStatisticSelect } from '../StateOfJS/LocationStatisticSelect';
import { Statistic } from '../StateOfJS/types';

import { darkTheme } from './darkTheme';

const independentScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.3,
  paddingOuter: 0,
  round: true
} as const;

const dependentScale: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true
} as const;

const springConfig = { duration: 350, easing: easeCubicInOut };

// const margin: Margin = { left: 120, right: 32, top: 32, bottom: 64 };

function independentAccessor(d: EntityBucket) {
  return d.id ?? '';
}

function colorAccessor() {
  return schemeCategory10[8];
}

function getDependentAxisTickFormatter(statistic: Statistic) {
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

function independentAxisTickFormatter(category: string) {
  return langmap[category]?.['englishName'] ?? 'Unknown';
}

function getDependentAxisLabel(statistic: Statistic) {
  switch (statistic) {
    case 'count':
      return 'User count';
    case 'percentage_question':
      return '% of question respondents';
    case 'percentage_survey':
      return '% of survey respondents';
  }
}

export function RespondentsByLanguage() {
  const { data } = useLocaleQuery({});
  const [statistic, setStatistic] = useState<Statistic>('percentage_survey');
  const sortedEntityBuckets = useMemo(
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
  const dependentAccessor = useCallback((d: EntityBucket) => d[statistic] ?? 0, [statistic]);
  const dependentAxisTickFormatter = useMemo(() => getDependentAxisTickFormatter(statistic), [statistic]);

  // const independentAxis: AxisConfig = {
  //   position: 'start',
  //   tickFormat: yAxisTickFormatter,
  //   tickLabelProps: { angle: -45 }
  // };
  // const dependentAxis: AxisConfig = useMemo<AxisConfig>(
  //   () => ({
  //     position: 'start',
  //     animate: true,
  //     tickFormat: getXAxisTickFormatter(statistic)
  //   }),
  //   [statistic]
  // );
  // const dependentGrid: GridConfig = {
  //   tickLineProps: {
  //     strokeDasharray: '1,3',
  //     className: 'text-slate-500'
  //   },
  //   tickCount: 5
  // };

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
          <div className="relative w-full h-[720px] bg-slate-700">
            <InView>
              <SVGXYChart
                independentScale={independentScale}
                dependentScale={dependentScale}
                horizontal
                animate
                springConfig={springConfig}
                // margin={margin}
                independentRangePadding={10}
                // dependentRangePadding={10}
                role="graphics-document"
                aria-roledescription="Bar chart"
                aria-label="Some Important Results"
                className="bg-slate-700 select-none"
                theme={darkTheme}
              >
                <SVGStripes
                  variableType="independent"
                  // className="text-slate-600"
                  even={false}
                  ignoreRangePadding={false}
                />
                <SVGGrid
                  variableType="dependent"
                  // className="text-slate-500"
                  // strokeDasharray="1,3"
                  tickCount={5}
                />
                <SVGBarSeries
                  renderer={SVGFancyBarSeriesRenderer<EntityBucket>}
                  dataKey="data-a"
                  data={sortedEntityBuckets}
                  keyAccessor={independentAccessor}
                  independentAccessor={independentAccessor}
                  dependentAccessor={dependentAccessor}
                  colorAccessor={colorAccessor}
                  barProps={(datum: EntityBucket) => ({
                    role: 'graphics-symbol',
                    'aria-roledescription': '',
                    'aria-label': `Category ${independentAccessor(datum)}: ${dependentAccessor(datum)}`
                  })}
                  lineProps={{
                    stroke: 'white',
                    strokeWidth: 2
                  }}
                />
                <SVGAxis
                  renderer={SVGAxisRenderer}
                  variableType="dependent"
                  position="end"
                  tickFormat={dependentAxisTickFormatter}
                  hideTicks={false}
                  hideAxisLine
                  tickLabelPadding={6}
                  tickLabelProps={{
                    className: 'fill-slate-400 font-sans',
                    fontSize: 12
                  }}
                  // labelProps={{
                  //   className: 'fill-slate-400 font-sans',
                  //   textAnchor: 'middle',
                  //   fontSize: 14
                  // }}
                  // labelPadding={10}
                />
                <SVGAxis
                  renderer={SVGAxisRenderer}
                  variableType="dependent"
                  position="start"
                  label={getDependentAxisLabel(statistic)}
                  tickFormat={dependentAxisTickFormatter}
                  hideTicks={false}
                  hideAxisLine
                  tickLabelPadding={6} //  TODO move into tickLabelProps?
                  tickLabelProps={{
                    className: 'fill-slate-400 font-sans',
                    fontSize: 12
                  }}
                  labelPadding={0}
                  // labelProps={{
                  //   fill: 'blue'
                  // }}

                  // labelProps={{
                  //   className: 'fill-slate-400 font-sans',
                  //   textAnchor: 'middle',
                  //   fontSize: 14
                  // }}
                  // labelPadding={20}
                />
                <SVGAxis
                  renderer={SVGAxisRenderer}
                  variableType="independent"
                  position="start"
                  tickFormat={independentAxisTickFormatter}
                  // tickLabelPadding={0}
                  hideTicks
                  hideAxisLine
                  // tickLabelAngle="angled"
                  tickLabelProps={{
                    className: 'fill-slate-400 font-sans',
                    fontSize: 12,
                    textAnchor: 'end'
                    // angle: -45
                  }}
                  tickLabelPadding={10}
                />
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
                        <span className="text-slate-600">
                          {independentAxisTickFormatter(datum.datum?.id ?? '')}:{' '}
                        </span>
                        {getTooltipFormatter(statistic)(datum.datum?.[statistic] ?? 0)}
                      </div>
                    );
                  }}
                />
              </SVGXYChart>
            </InView>
          </div>
        </div>
      </div>
    </div>
  );
}
