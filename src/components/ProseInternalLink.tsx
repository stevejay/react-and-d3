import { Link, LinkProps } from 'react-router-dom';

export type ProseInternalLinkProps = LinkProps;

export function ProseInternalLink({ children, className, ...rest }: ProseInternalLinkProps) {
  return (
    <Link
      className={`underline underline-offset-2 hover:text-slate-100 transition-colors ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
