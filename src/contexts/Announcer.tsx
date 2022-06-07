import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { isNil } from 'lodash-es';

export type AnnouncerContextType = {
  announce: (text: string) => void;
};

export const AnnouncerContext = createContext<AnnouncerContextType>({ announce: () => {} });

export function AnnouncerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ text: string } | null>(null);
  const announce = useCallback((text: string) => {
    if (!isNil(text)) {
      setState({ text });
    }
  }, []);
  return (
    <AnnouncerContext.Provider value={useMemo(() => ({ announce }), [announce])}>
      <div role="alert" aria-atomic aria-live="assertive" className="sr-only">
        {state?.text ?? ''}
      </div>
      {children}
    </AnnouncerContext.Provider>
  );
}

export function useAnnouncer() {
  const context = useContext(AnnouncerContext);
  if (!context) {
    throw new Error('useAnnouncer must be used within an AnnouncerProvider');
  }
  return context.announce;
}
