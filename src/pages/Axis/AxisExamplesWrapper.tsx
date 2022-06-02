import { ReactNode } from 'react';

export function AxisExamplesWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl p-4 my-8 space-y-4 border-0 shadow-xl md:p-5 border-slate-600 bg-slate-700">
      {children}
    </div>
  );
}
