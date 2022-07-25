import type { Options as PopperOptions } from '@popperjs/core';
import { ScaleQuantize } from 'd3-scale';

import { EntityBucket } from '@/api/stateofjs/generated';
import { InView } from '@/components/InView';
import { ParentSize } from '@/visx-next/ParentSize';

import { formatStatistic } from './formatStatistic';
import { SVGWorldMap } from './SVGWorldMap';
import { Tooltip } from './Tooltip';
import { Statistic, TooltipDatum } from './types';
import { useVirtualElementTooltip } from './useVirtualElementTooltip';

const popperOptions: Partial<PopperOptions> = {
  placement: 'top',
  modifiers: [
    { name: 'flip', enabled: false },
    { name: 'offset', options: { offset: [0, 12] } }
  ]
};

export interface SVGWorldMapWithTooltipProps {
  data: (EntityBucket | undefined)[];
  colorScale: ScaleQuantize<string>;
  statistic: Statistic;
  className?: string;
}

export function SVGWorldMapWithTooltip({
  data,
  colorScale,
  statistic,
  className = ''
}: SVGWorldMapWithTooltipProps) {
  const tooltip = useVirtualElementTooltip<TooltipDatum>(popperOptions);
  return (
    <div className={`relative w-full aspect-[9/5] ${className}`} ref={tooltip.referenceElement}>
      <InView>
        <ParentSize>
          {(dimensions) => (
            <SVGWorldMap
              width={dimensions.width}
              height={dimensions.height}
              data={data}
              colorScale={colorScale}
              statistic={statistic}
              showTooltip={tooltip.show}
              hideTooltip={tooltip.hide}
            />
          )}
        </ParentSize>
      </InView>
      <Tooltip tooltip={tooltip}>
        {tooltip.datum?.name}: {formatStatistic(tooltip.datum?.datum?.[statistic] ?? 0, statistic)}
      </Tooltip>
    </div>
  );
}
