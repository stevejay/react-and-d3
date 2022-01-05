import type { FC, HTMLAttributes } from 'react';

export const ChartTitle: FC<HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...rest }) => (
  <h3 className={`mt-8 -mb-6 text-base text-slate-300 ${className}`} {...rest}>
    {children}
  </h3>
);
