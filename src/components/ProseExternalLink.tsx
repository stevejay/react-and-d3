import { AnchorHTMLAttributes, FC } from 'react';

export const ProseExternalLink: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({ className, ...rest }) => (
  <a
    className={`underline underline-offset-2 hover:text-slate-100 transition-colors ${className}`}
    {...rest}
    rel="nofollow noreferrer"
    target="_blank"
  />
);
