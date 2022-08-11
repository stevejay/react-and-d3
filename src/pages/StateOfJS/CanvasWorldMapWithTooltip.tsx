import type { Options as PopperOptions } from '@popperjs/core';
import { ScaleQuantize } from 'd3-scale';

import { EntityBucket } from '@/api/stateofjs/generated';
import { InView } from '@/components/InView';
import { ParentSize } from '@/visx-hybrid/ParentSize';

import { CanvasWorldMap, FeatureWithDatum } from './CanvasWorldMap';
import { formatStatistic } from './formatStatistic';
import { Tooltip } from './Tooltip';
import { Statistic } from './types';
import { useVirtualElementTooltip } from './useVirtualElementTooltip';

const popperOptions: Partial<PopperOptions> = {
  placement: 'top',
  modifiers: [
    { name: 'flip', enabled: false },
    { name: 'offset', options: { offset: [0, 12] } },
    { name: 'hide', enabled: false } // Added as [data-popper-reference-hidden] attribute was getting added.
  ]
};

export interface CanvasWorldMapWithTooltipProps {
  data: (EntityBucket | undefined)[];
  colorScale: ScaleQuantize<string>;
  statistic: Statistic;
  className?: string;
}

export function CanvasWorldMapWithTooltip({
  data,
  colorScale,
  statistic,
  className = ''
}: CanvasWorldMapWithTooltipProps) {
  const tooltip = useVirtualElementTooltip<FeatureWithDatum>(popperOptions);
  return (
    <div>
      <div
        className={`relative w-full aspect-[12/9] overflow-hidden ${className}`}
        ref={tooltip.referenceElement}
      >
        <InView>
          <ParentSize>
            {(dimensions) => (
              <CanvasWorldMap
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
      </div>
      <Tooltip tooltip={tooltip}>
        {tooltip.datum?.properties?.name}:{' '}
        {formatStatistic(tooltip.datum?.datum?.[statistic] ?? 0, statistic)}
      </Tooltip>
    </div>
  );
}
