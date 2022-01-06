import { FC } from 'react';
import { Link, LinkProps } from 'react-router-dom';

export type ProseInternalLinkProps = LinkProps;

export const ProseInternalLink: FC<ProseInternalLinkProps> = ({ children, className, ...rest }) => (
  <Link
    className={`underline underline-offset-2 hover:text-slate-100 transition-colors ${className}`}
    {...rest}
  >
    {children}
  </Link>
);
