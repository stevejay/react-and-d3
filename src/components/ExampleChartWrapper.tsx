import { FC, ReactNode } from 'react';
import { useId } from '@uifabric/react-hooks';

import { ChartTitle } from '@/components/ChartTitle';

import { ChartSizer } from './ChartSizer';

type RenderProps = {
  inView: boolean;
  width: number;
  height: number;
  ariaLabelledby: string;
};

export type ExampleChartWrapperProps = {
  title: string;
  subtitle?: string;
  sizerClassName: string;
  children: ({ inView, width, height, ariaLabelledby }: RenderProps) => ReactNode;
};

/**
 * Controls the size of the contained chart and only renders it if it
 * is in the viewport.
 */
export const ExampleChartWrapper: FC<ExampleChartWrapperProps> = ({ title, sizerClassName, children }) => {
  const id = useId();
  return (
    <>
      <ChartTitle id={id}>{title}</ChartTitle>
      <ChartSizer className={`${sizerClassName} my-8`}>
        {({ inView, width, height }) => <>{children({ inView, width, height, ariaLabelledby: id })}</>}
      </ChartSizer>
    </>
  );
};
