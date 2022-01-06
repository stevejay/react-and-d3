import type { FC } from 'react';

export type AxisChartTitleProps = { title: string; subtitle?: string; id: string };

export const AxisChartTitle: FC<AxisChartTitleProps> = ({ title, subtitle, id }) => (
  <h3 id={id} className="mb-2 font-light text-slate-200">
    <span className="uppercase">{title}</span>
    {subtitle && (
      <>
        <span className="text-slate-400"> / </span>
        {subtitle}
      </>
    )}
  </h3>
);
