import { ReactNode } from 'react';

export interface SectionHeadingProps {
  children: ReactNode;
}
export function SectionHeading({ children }: SectionHeadingProps) {
  return <h2 className="mb-4 text-2xl md:text-3xl text-slate-200">{children}</h2>;
}
