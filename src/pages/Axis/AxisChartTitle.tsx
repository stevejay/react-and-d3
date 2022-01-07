import type { FC } from 'react';

export type AxisChartTitleProps = { title: string; id: string };

export const AxisChartTitle: FC<AxisChartTitleProps> = ({ title, id }) => (
  <h3 id={id} className="mb-2 font-light leading-none text-slate-200">
    {title}
  </h3>
);
