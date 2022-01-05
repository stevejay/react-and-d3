import { FC, ReactNode } from 'react';
import { useId } from '@uifabric/react-hooks';

import { ChartSizer } from '@/components/ChartSizer';
import { AxisChartTitle } from '@/pages/Axis/AxisChartTitle';

export type AxisExampleChartWrapperProps = {
  title: string;
  subtitle?: string;
  sizerClassName: string;
  children: ({
    inView,
    width,
    height,
    ariaLabelledby
  }: {
    inView: boolean;
    width: number;
    height: number;
    ariaLabelledby: string;
  }) => ReactNode;
};

/**
 * Controls the size of the contained chart and only renders it if it
 * is in the viewport.
 */
export const AxisExampleChartWrapper: FC<AxisExampleChartWrapperProps> = ({
  title,
  subtitle,
  sizerClassName,
  children
}) => {
  const id = useId();
  return (
    <>
      <AxisChartTitle title={title} subtitle={subtitle} id={id} />
      <ChartSizer className={sizerClassName} intersectOptions={{ rootMargin: '200px 0px' }}>
        {({ inView, width, height }) => <>{children({ inView, width, height, ariaLabelledby: id })}</>}
      </ChartSizer>
    </>
  );
};
