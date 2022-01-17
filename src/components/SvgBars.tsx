import { ReactElement } from 'react';
import { animated, SpringConfig, useTransition } from '@react-spring/web';

import { createBarGenerator } from '@/generators/barGenerator';
import type { AxisScale, CategoryValueDatum, ChartOrientation, DomainValue } from '@/types';
import { getAxisDomainAsReactKey } from '@/utils/axisUtils';
import { getDefaultRenderingOffset } from '@/utils/renderUtils';

export type SvgBarsProps<CategoryT extends DomainValue> = {
  data: CategoryValueDatum<CategoryT, number>[];
  orientation: ChartOrientation;
  categoryScale: AxisScale<CategoryT>;
  valueScale: AxisScale<number>;
  className?: string;
  offset?: number;
  datumAriaRoleDescription?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  datumAriaLabel?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  datumDescription?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  animate?: boolean;
  springConfig: SpringConfig;
};

export function SvgBars<CategoryT extends DomainValue>({
  data,
  categoryScale,
  valueScale,
  orientation,
  offset,
  className = '',
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription,
  animate = true,
  springConfig
}: SvgBarsProps<CategoryT>): ReactElement | null {
  const renderingOffset = offset ?? getDefaultRenderingOffset();
  const barGenerator = createBarGenerator(categoryScale, valueScale, orientation, renderingOffset);

  const transitions = useTransition(data, {
    initial: (datum) => ({ opacity: 0, ...barGenerator(datum) }),
    from: (datum) => ({ opacity: 0, ...barGenerator(datum) }),
    enter: (datum) => ({ opacity: 1, ...barGenerator(datum) }),
    update: (datum) => ({ opacity: 1, ...barGenerator(datum) }),
    leave: (datum) => ({ opacity: 0, ...barGenerator(datum) }),
    keys: (d) => getAxisDomainAsReactKey(d.category),
    config: springConfig,
    immediate: !animate
  });

  return (
    <g data-test-id="bars-group" className={className} fill="currentColor" stroke="none">
      {transitions((styles, datum) => (
        <animated.rect
          data-test-id="bar"
          className={className}
          style={styles}
          role="graphics-symbol"
          aria-roledescription={datumAriaRoleDescription?.(datum)}
          aria-label={datumAriaLabel?.(datum)}
        >
          {datumDescription && <desc>{datumDescription(datum)}</desc>}
        </animated.rect>
      ))}
    </g>
  );
}
