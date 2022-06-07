import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

export interface PageCardProps {
  href: string;
  title: string;
  illustration: () => ReactElement;
}

export function PageCard({ href, title, illustration: Illustration }: PageCardProps) {
  return (
    <Link
      to={href}
      className="flex flex-col relative space-y-3 transition-transform hover:scale-105 text-xl font-thin leading-none text-slate-200"
    >
      <span
        aria-hidden
        className="flex items-center justify-center py-8 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500"
      >
        <Illustration />
      </span>
      <span className="inline-block">{title}</span>
    </Link>
  );
}
