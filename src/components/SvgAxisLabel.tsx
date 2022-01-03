import { FC } from 'react';

import type { AxisOrientation, ChartArea } from '@/types';

// TODO the rest of the orientations and label orientations.
function getAxisLabelOrientationProps(
  orientation: AxisOrientation,
  labelOrientation: SvgAxisLabelProps['align'],
  chartArea: ChartArea,
  offset: number
) {
  switch (orientation) {
    case 'bottom':
      switch (labelOrientation) {
        case 'center':
          return {
            transform: `translate(${chartArea.translateX + chartArea.width * 0.5},${
              chartArea.translateY + chartArea.height + offset
            })`,
            textAnchor: 'middle',
            dy: '0.71em'
          };
        default:
          throw new Error('not implemented');
      }
    case 'left':
      switch (labelOrientation) {
        case 'center':
          return {
            transform: `translate(${chartArea.translateX - offset},${
              chartArea.translateY + chartArea.height * 0.5
            }) rotate(-90)`,
            textAnchor: 'middle',
            dy: '0.32em'
          };
        default:
          throw new Error('not implemented');
      }
    default:
      throw new Error('not implemented');
  }
}

type SvgAxisLabelProps = {
  label: string;
  chartArea: ChartArea;
  offset: number;
  orientation: AxisOrientation;
  align: 'start' | 'center' | 'end';
  className?: string;
};

export const SvgAxisLabel: FC<SvgAxisLabelProps> = ({
  label,
  chartArea,
  offset,
  orientation,
  align,
  className = ''
}) => {
  const orientationProps = getAxisLabelOrientationProps(orientation, align, chartArea, offset);
  return (
    <g transform={orientationProps.transform}>
      <text
        stroke="none"
        fill="currentColor"
        className={className}
        textAnchor={orientationProps.textAnchor}
        dy={orientationProps.dy}
        role="presentation"
        aria-hidden
      >
        {label}
      </text>
    </g>
  );
};
