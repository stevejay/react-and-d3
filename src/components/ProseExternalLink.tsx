import { AnchorHTMLAttributes } from 'react';

export function ProseExternalLink({ className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={`underline underline-offset-2 hover:text-slate-100 transition-colors ${className}`}
      {...rest}
      rel="nofollow noreferrer"
      target="_blank"
    />
  );
}
