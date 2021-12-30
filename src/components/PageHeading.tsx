import { FC } from 'react';

export const PageHeading: FC = ({ children }) => (
  <header className="px-4 py-8 space-y-4 border-b md:py-12 md:p-8 border-slate-600 bg-gradient-to-r from-slate-900 to-slate-800">
    <h1 className="text-3xl uppercase text-slate-300">{children}</h1>
  </header>
);
