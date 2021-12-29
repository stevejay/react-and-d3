import { FC, ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

import { useDebouncedMeasure } from '@/useDebouncedMeasure';

import { ChartTitle } from '../ChartTitle';

export type ExampleChartWrapperProps = {
  title: string;
  subtitle?: string;
  children: ({ inView, width, height }: { inView: boolean; width: number; height: number }) => ReactNode;
};

/**
 * Controls the size of the contained chart and only renders it if it
 * is in the viewport.
 */
export const ExampleChartWrapper: FC<ExampleChartWrapperProps> = ({ title, subtitle, children }) => {
  const { ref: inViewRef, inView } = useInView();
  const { ref: sizerRef, width, height } = useDebouncedMeasure();
  return (
    <div ref={inViewRef} className="space-y-3">
      <ChartTitle title={title} subtitle={subtitle} />
      <div ref={sizerRef} className="w-full h-28">
        {children({ inView, width: width ?? 0, height: height ?? 0 })}
      </div>
    </div>
  );
};
