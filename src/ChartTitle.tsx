import type { FC } from 'react';

export const ChartTitle: FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <h3 className="uppercase text-slate-900">
    {title}
    {subtitle && (
      <>
        <span className="text-slate-400"> / </span>
        <span className="normal-case italic">{subtitle}</span>
      </>
    )}
  </h3>
);
