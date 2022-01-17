import type { FC, SVGProps } from 'react';
import { animated, SpringConfig, useSpring } from '@react-spring/web';

import type { AxisScale, ChartArea, ChartOrientation } from '@/types';

export type SvgLineAnnotationProps = Omit<SVGProps<SVGLineElement>, 'ref' | 'scale'> & {
  value: number;
  chartArea: ChartArea;
  orientation: ChartOrientation;
  scale: AxisScale<number>;
  springConfig: SpringConfig;
};

export const SvgLineAnnotation: FC<SvgLineAnnotationProps> = ({
  value,
  chartArea,
  orientation,
  scale,
  className = '',
  springConfig,
  ...rest
}) => {
  const annotateValue = scale(value);
  const horizontal = orientation === 'horizontal';

  const styles = useSpring({
    x1: horizontal ? 0 : annotateValue,
    x2: horizontal ? chartArea.width : annotateValue,
    y1: horizontal ? annotateValue : chartArea.height,
    y2: horizontal ? annotateValue : 0,
    config: springConfig
  });

  return (
    <animated.line
      data-test-id="annotation"
      stroke="currentColor"
      strokeWidth={1}
      role="presentation"
      className={className}
      {...styles}
      {...rest}
    />
  );
};
