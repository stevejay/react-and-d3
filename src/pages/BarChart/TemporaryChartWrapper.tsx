import { FC, ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';
import { useId } from '@uifabric/react-hooks';

import { ChartTitle } from '@/components/ChartTitle';
import { useDebouncedMeasure } from '@/hooks/useDebouncedMeasure';

export type TemporaryChartWrapperProps = {
  title: string;
  subtitle?: string;
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
export const TemporaryChartWrapper: FC<TemporaryChartWrapperProps> = ({ title, subtitle, children }) => {
  const { ref: inViewRef, inView } = useInView();
  const { ref: sizerRef, width, height } = useDebouncedMeasure();
  const id = useId();
  return (
    <div ref={inViewRef} className="space-y-3">
      <ChartTitle title={title} subtitle={subtitle} id={id} />
      <div ref={sizerRef} className="w-full h-96">
        {children({ inView, width: width ?? 0, height: height ?? 0, ariaLabelledby: id })}
      </div>
    </div>
  );
};