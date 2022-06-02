import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

export interface PageCardProps {
  href: string;
  title: string;
  illustration: () => ReactElement;
}

export function PageCard({ href, title, illustration: Illustration }: PageCardProps) {
  return (
    <article className="relative pb-4 space-y-3 transition-transform hover:scale-105">
      {/* <Link
      to={href}
      className="block outline-none ring-offset-slate-900 ring-offset-4 focus-visible:ring-2"
      aria-label={title}
    > */}
      <div
        aria-hidden
        className="flex items-center justify-center py-8 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500"
      >
        <Illustration />
      </div>
      {/* </Link> */}
      <h2 className="text-xl font-thin leading-none text-slate-200">
        <Link
          to={href}
          className="outline-none focus-visible:ring-2 after:content-[''] after:absolute after:inset-0"
        >
          {title}
        </Link>
      </h2>
    </article>
  );
}
