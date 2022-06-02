import { forwardRef, memo } from 'react';

import { SvgGroup } from '@/components/SvgGroup';
import { ChartArea } from '@/types';

export interface SvgChartAreaInteractionRectProps {
  chartArea: ChartArea;
  className?: string;
}

export const SvgChartAreaInteractionRect = memo(
  forwardRef<SVGRectElement, SvgChartAreaInteractionRectProps>(({ chartArea, className = '' }, ref) => (
    <SvgGroup
      data-test-id="gesture-interaction"
      translateX={chartArea.translateLeft}
      translateY={chartArea.translateTop}
      className={className}
      fill="transparent"
      stroke="none"
    >
      <rect
        ref={ref}
        data-test-id="interaction-area"
        role="presentation"
        className="touch-none"
        x={0}
        y={0}
        width={chartArea.width}
        height={chartArea.height}
      />
    </SvgGroup>
  )),
  (prevProps, nextProps) => prevProps.chartArea === nextProps.chartArea
);
