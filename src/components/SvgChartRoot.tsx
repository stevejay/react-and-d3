import { forwardRef, ReactNode } from 'react';

import { Svg } from '@/components/Svg';

export interface SvgChartRootProps {
  width: number;
  height: number;
  className?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRoleDescription?: string;
  description?: string;
  ariaDescribedby?: string;
  children?: ReactNode;
}

export const SvgChartRoot = forwardRef<SVGSVGElement, SvgChartRootProps>(
  (
    {
      width,
      height,
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
      <Svg
        ref={ref}
        width={width}
        height={height}
        className={`select-none ${className}`}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-roledescription={ariaRoleDescription}
        role="graphics-document"
        // Needed to stop touches at the borders of any interaction areas in the chart
        // triggering mouseover events in them.
        onTouchEnd={(event) => event.preventDefault()}
      >
        {description && <desc>{description}</desc>}
        {children}
      </Svg>
    );
  }
);
