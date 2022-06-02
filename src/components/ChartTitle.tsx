import { HTMLAttributes } from 'react';

export function ChartTitle({ className, children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`mt-8 -mb-6 text-base text-slate-300 ${className}`} {...rest}>
      {children}
    </h3>
  );
}
