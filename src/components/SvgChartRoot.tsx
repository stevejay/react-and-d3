import { forwardRef, ReactNode } from 'react';
import { easeCubicInOut } from 'd3-ease';
import { MotionConfig } from 'framer-motion';

import { Svg } from '@/components/Svg';

export type SvgChartRootProps = {
  width: number;
  height: number;
  transitionSeconds?: number;
  className?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRoleDescription?: string;
  description?: string;
  ariaDescribedby?: string;
  children?: ReactNode;
};

export const SvgChartRoot = forwardRef<SVGSVGElement, SvgChartRootProps>(
  (
    {
      width,
      height,
      transitionSeconds = 0.25,
      className = '',
      ariaLabel,
      ariaLabelledby,
      ariaRoleDescription,
      description,
      ariaDescribedby,
      children
    },
    ref
  ) => {
    if (!width || !height) {
      return null;
    }
    return (
      <MotionConfig transition={{ duration: transitionSeconds, ease: easeCubicInOut }}>
        <Svg
          ref={ref}
          width={width}
          height={height}
          className={className}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          aria-roledescription={ariaRoleDescription}
          role="graphics-document"
        >
          {description && <desc>{description}</desc>}
          {children}
        </Svg>
      </MotionConfig>
    );
  }
);
