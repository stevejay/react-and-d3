import type { FC } from 'react';

export const ChartTitle: FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <h3 className="text-slate-900">
    <span className="uppercase tracking-tight">{title}</span>
    {subtitle && (
      <>
        <span className="text-slate-400"> / </span>
        <span className="italic">{subtitle}</span>
      </>
    )}
  </h3>
);
