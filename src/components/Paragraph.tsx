import { HTMLAttributes } from 'react';

export function Paragraph({ className = '', children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`my-4 font-light leading-relaxed max-w-prose text-slate-200 ${className}`} {...rest}>
      {children}
    </p>
  );
}
