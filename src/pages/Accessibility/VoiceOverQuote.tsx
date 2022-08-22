import type { ReactNode } from 'react';

export function VoiceOverQuote({ children }: { children: ReactNode }) {
  return (
    <figure className="bg-slate-700 rounded-lg">
      <blockquote>
        <p className="px-4 py-2 my-4 italic font-light leading-relaxed rounded max-w-prose text-slate-300">
          {children}
        </p>
      </blockquote>
      <figcaption className="sr-only">Text spoken by VoiceOver</figcaption>
    </figure>
  );
}
