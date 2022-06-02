import { ReactNode } from 'react';
import { useId } from '@uifabric/react-hooks';

import { ChartSizer } from '@/components/ChartSizer';
import { AxisChartTitle } from '@/pages/Axis/AxisChartTitle';

interface RenderProps {
  inView: boolean;
  width: number;
  height: number;
  ariaLabelledby: string;
}

export interface AxisExampleChartWrapperProps {
  title: string;
  subtitle?: string;
  sizerClassName: string;
  children: ({ inView, width, height, ariaLabelledby }: RenderProps) => ReactNode;
}

/**
 * Controls the size of the contained chart and only renders it if it
 * is in the viewport.
 */
export function AxisExampleChartWrapper({
  title,
  subtitle,
  sizerClassName,
  children
}: AxisExampleChartWrapperProps) {
  const id = useId();
  return (
    <div>
      <AxisChartTitle title={title} id={id} />
      <ChartSizer className={sizerClassName}>
        {({ inView, width, height }) => <>{children({ inView, width, height, ariaLabelledby: id })}</>}
      </ChartSizer>
    </div>
  );
}
