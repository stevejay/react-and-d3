import { useMemo, useState } from 'react';
import { easeCubicInOut } from 'd3-ease';
import { format } from 'd3-format';
import langmap from 'langmap';
import { sortBy } from 'lodash-es';

import { EntityBucket, useLocaleQuery } from '@/api/stateofjs/generated';
import { InView } from '@/components/InView';
import { SectionHeading } from '@/components/SectionHeading';
import { isDefined } from '@/types/typeguards/isDefined';
import { SVGXYChart } from '@/visx-config/SVGXYChart';
import { AxisConfig, GridConfig } from '@/visx-config/types';
import { BandScaleConfig, LinearScaleConfig } from '@/visx-next/scale';
import { Margin } from '@/visx-next/types';

import { LocationStatisticSelect } from '../StateOfJS/LocationStatisticSelect';
import { Statistic } from '../StateOfJS/types';

const independentScale: BandScaleConfig<string> = {
  type: 'band',
  paddingInner: 0.3,
  paddingOuter: 0.4,
  round: true
} as const;

const dependentScale: LinearScaleConfig<number> = {
  type: 'linear',
  nice: true,
  round: true,
  clamp: true
} as const;

const springConfig = { duration: 350, easing: easeCubicInOut };

const margin: Margin = { left: 120, right: 32, top: 32, bottom: 64 };

// function yAccessor(d: EntityBucket) {
//   return d.id ?? '';
// }

// function colorAccessor() {
//   return schemeCategory10[8];
// }

function getXAxisTickFormatter(statistic: Statistic) {
  switch (statistic) {
    case 'count':
      return format('~s');
    default:
      return format('~%');
  }
}

// function getTooltipFormatter(statistic: Statistic) {
//   switch (statistic) {
//     case 'count':
//       return format(',');
//     default:
//       return format('~%');
//   }
// }

function yAxisTickFormatter(category: string) {
  return langmap[category]?.['englishName'] ?? 'Unknown';
}

export function RespondentsByLanguage() {
  const { data } = useLocaleQuery({});
  const [statistic, setStatistic] = useState<Statistic>('percentage_survey');
  const series = useMemo(() => {
    const mapped = sortBy(
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
    );
    return [
      {
        dataKey: 'data-a',
        data: mapped,
        label: 'The series',
        independentAccessor: (d: EntityBucket) => d.id ?? '',
        dependentAccessor: (d: EntityBucket) => d[statistic] ?? 0
      }
    ];
  }, [data, statistic]);
  // const xAccessor = useCallback((d: EntityBucket) => d[statistic] ?? 0, [statistic]);
  // const xAxisTickFormatter = useMemo(() => getXAxisTickFormatter(statistic), [statistic]);

  const independentAxis: AxisConfig = {
    position: 'start',
    tickFormat: yAxisTickFormatter,
    tickLabelProps: { angle: -45 }
  };
  const dependentAxis: AxisConfig = useMemo<AxisConfig>(
    () => ({
      position: 'start',
      animate: true,
      tickFormat: getXAxisTickFormatter(statistic)
    }),
    [statistic]
  );
  const dependentGrid: GridConfig = {
    tickLineProps: {
      strokeDasharray: '1,3',
      className: 'text-slate-500'
    },
    tickCount: 5
  };

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
              <SVGXYChart
                config={{
                  series,
                  independentScale,
                  dependentScale,
                  independentAxis,
                  dependentAxis,
                  independentGrid: false,
                  dependentGrid,
                  independentRangePadding: 10,
                  dependentRangePadding: 20,
                  horizontal: true,
                  margin,
                  animate: true,
                  springConfig
                }}
                role="graphics-document"
                aria-roledescription="Bar chart"
                aria-label="Some Important Results"
                className="bg-slate-700"
              />
            </InView>
          </div>
        </div>
      </div>
    </div>
  );
}
