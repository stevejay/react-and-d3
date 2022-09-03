import type { ReactNode } from 'react';

export function VoiceOverQuote({ children }: { children: ReactNode }) {
  return (
    <figure className="bg-slate-700 rounded-lg relative mt-4 mb-6">
      <blockquote>
        <p className="px-4 py-2 italic font-light leading-relaxed rounded max-w-prose text-slate-300">
          {children}
        </p>
      </blockquote>
      <figcaption className="sr-only">Text spoken by VoiceOver</figcaption>
      <span className="absolute pointer-events-none w-0 h-0 top-full left-[10px] border-[12px] border-transparent ml-[12px] border-t-slate-700" />
    </figure>
  );
}
