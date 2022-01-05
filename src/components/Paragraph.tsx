import type { FC, HTMLAttributes } from 'react';

export const Paragraph: FC<HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <p className={`my-4 font-light leading-relaxed max-w-prose text-slate-400 ${className}`} {...rest}>
    {children}
  </p>
);
