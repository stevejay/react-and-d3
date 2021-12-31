import { forwardRef, ReactNode } from 'react';
import * as d3 from 'd3';
import { MotionConfig } from 'framer-motion';

import { Svg } from '@/Svg';

export type SvgChartRootProps = {
  width: number;
  height: number;
  durationSecs?: number;
  className?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescription?: string;
  ariaDescribedby?: string;
  children?: ReactNode;
};

export const SvgChartRoot = forwardRef<SVGSVGElement, SvgChartRootProps>(
  (
    {
      width,
      height,
      durationSecs = 0.25,
      className = '',
      ariaLabel,
      ariaLabelledby,
      ariaDescription,
      ariaDescribedby,
      children
    },
    ref
  ) => {
    if (!width || !height) {
      return null;
    }
    return (
      <MotionConfig transition={{ duration: durationSecs, ease: d3.easeCubicInOut }}>
        <Svg
          ref={ref}
          width={width}
          height={height}
          className={className}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-description={ariaDescription}
          aria-describedby={ariaDescribedby}
        >
          {children}
        </Svg>
      </MotionConfig>
    );
  }
);
