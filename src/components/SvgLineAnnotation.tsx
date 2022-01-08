import type { FC, SVGProps } from 'react';
import { m as motion } from 'framer-motion';

import type { AxisScale, ChartArea, ChartOrientation } from '@/types';

export type SvgLineAnnotationProps = Omit<
  SVGProps<SVGLineElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref' | 'scale'
> & {
  value: number;
  chartArea: ChartArea;
  orientation: ChartOrientation;
  scale: AxisScale<number>;
};

export const SvgLineAnnotation: FC<SvgLineAnnotationProps> = ({
  value,
  chartArea,
  orientation,
  scale,
  className = '',
  ...rest
}) => {
  const annotateValue = scale(value);
  const coords =
    orientation === 'horizontal'
      ? { x1: 0, x2: chartArea.width, y1: annotateValue, y2: annotateValue }
      : { x1: annotateValue, x2: annotateValue, y1: chartArea.height, y2: 0 };
  return (
    <motion.line
      data-test-id="annotation"
      animate={coords}
      stroke="currentColor"
      strokeWidth={1}
      role="presentation"
      className={className}
      {...rest}
    />
  );
};
