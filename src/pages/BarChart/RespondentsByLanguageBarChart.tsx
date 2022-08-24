import { useCallback, useMemo, useState } from 'react';
import type { BandScaleConfig, LinearScaleConfig } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
import { schemeCategory10 } from 'd3-scale-chromatic';
import langmap from 'langmap';
import { sortBy } from 'lodash-es';

import { EntityBucket, useLocaleQuery } from '@/api/stateofjs/generated';
import { isDefined } from '@/types/typeguards/isDefined';
import { darkTheme } from '@/utils/chartThemes';
import { InView } from '@/visx-hybrid/InView';
import { SVGAxis } from '@/visx-hybrid/SVGAxis';
import { SVGBandStripes } from '@/visx-hybrid/SVGBandStripes';
import { SVGBarSeries } from '@/visx-hybrid/SVGBarSeries';
import { SVGBarSeriesLabels } from '@/visx-hybrid/SVGBarSeriesLabels';
import { SVGBarWithLine } from '@/visx-hybrid/SVGBarWithLine';
import { SVGGrid } from '@/visx-hybrid/SVGGrid';
import { SVGIndependentScaleA11ySeries } from '@/visx-hybrid/SVGIndependentScaleA11ySeries';
import { SVGTooltip } from '@/visx-hybrid/SVGTooltip';
import { SVGXYChart } from '@/visx-hybrid/SVGXYChart';

import { LocationStatisticSelect } from '../StateOfJS/LocationStatisticSelect';
import { Statistic } from '../StateOfJS/types';

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

function independentAccessor(datum: EntityBucket) {
  return datum.id ?? '';
}

function colorAccessor() {
  return schemeCategory10[4];
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

export function RespondentsByLanguageBarChart() {
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
  const dependentAccessor = useCallback((datum: EntityBucket) => datum[statistic] ?? 0, [statistic]);
  const dependentAxisTickLabelFormatter = useMemo(
    () => getDependentAxisTickFormatter(statistic),
    [statistic]
  );

  return (
    <div>
      {/* <SectionHeading>Respondents by language</SectionHeading> */}
      <div className="space-y-8">
        <LocationStatisticSelect value={statistic} onChange={setStatistic} />
        <div className="space-y-2">
          <div className="relative w-full h-[720px]">
            <InView>
              <SVGXYChart
                independentScale={independentScale}
                dependentScale={dependentScale}
                horizontal
                animate
                springConfig={springConfig}
                independentRangePadding={10}
                role="graphics-document"
                aria-roledescription="Bar chart"
                aria-label="Some Important Results"
                theme={darkTheme}
              >
                <SVGBandStripes variable="independent" even={false} ignoreRangePadding={false} />
                <SVGGrid variable="dependent" tickCount={5} />
                <SVGBarSeries
                  dataKey="data-a"
                  data={sortedEntityBuckets}
                  independentAccessor={independentAccessor}
                  dependentAccessor={dependentAccessor}
                  colorAccessor={colorAccessor}
                  renderBar={SVGBarWithLine}
                />
                <SVGBarSeriesLabels dataKeyRef="data-a" formatter={dependentAxisTickLabelFormatter} />
                <SVGIndependentScaleA11ySeries<EntityBucket>
                  dataKeyOrKeysRef="data-a"
                  categoryA11yProps={(category, data) => ({
                    'aria-label': `${independentAxisTickFormatter(
                      category
                    )}: ${dependentAxisTickLabelFormatter(dependentAccessor(data[0]))}`,
                    'aria-roledescription': 'Language'
                  })}
                />
                <SVGAxis
                  variable="dependent"
                  position="end"
                  tickFormat={dependentAxisTickLabelFormatter}
                  hideTicks={false}
                  hideAxisPath
                  tickLabelPadding={6}
                />
                <SVGAxis
                  variable="dependent"
                  position="start"
                  label={getDependentAxisLabel(statistic)}
                  tickFormat={dependentAxisTickLabelFormatter}
                  hideTicks={false}
                  hideAxisPath
                  tickLabelPadding={6}
                  autoMarginLabelPadding={0}
                />
                <SVGAxis
                  variable="independent"
                  position="start"
                  tickFormat={independentAxisTickFormatter}
                  hideTicks
                  hideAxisPath
                  tickLabelPadding={10}
                />
                <SVGTooltip<EntityBucket>
                  snapTooltipToIndependentScale
                  showIndependentScaleCrosshair
                  showDatumGlyph={false}
                  renderTooltip={({ tooltipData }) => {
                    const datum = tooltipData?.nearestDatum;
                    if (!datum) {
                      return null;
                    }
                    return (
                      <div>
                        <span className="text-slate-200">
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
