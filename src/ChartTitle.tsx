import type { FC } from 'react';

export const ChartTitle: FC<{ title: string; subtitle?: string; id: string }> = ({ title, subtitle, id }) => (
  <h3 id={id} className="text-slate-200">
    <span className="tracking-tight uppercase">{title}</span>
    {subtitle && (
      <>
        <span className="text-slate-400"> / </span>
        {subtitle}
      </>
    )}
  </h3>
);
