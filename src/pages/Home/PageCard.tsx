import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';

export type PageCardProps = {
  href: string;
  title: string;
  illustration: () => ReactElement;
};

export const PageCard: FC<PageCardProps> = ({ href, title, illustration: Illustration }) => (
  <article className="pb-4 space-y-3">
    <Link to={href}>
      <span className="block py-8 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500">
        <Illustration />
      </span>
    </Link>
    <h2 className="text-xl font-thin leading-none text-slate-200">
      <Link to={href}>{title}</Link>
    </h2>
  </article>
);
