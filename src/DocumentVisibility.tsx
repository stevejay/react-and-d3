import { createContext, FC, useContext, useEffect, useState } from 'react';

// Based on https://github.com/codeshifu/use-page-visibility/blob/a4f9479df0eb3ac1a55895a94635f65868e1967c/lib.js

function getBrowserApi() {
  let hidden = 'hidden';
  let visibilityChange = 'visibilitychange';

  if ('mozHidden' in document) {
    // Firefox up to v17
    hidden = 'mozHidden';
    visibilityChange = 'mozvisibilitychange';
  } else if ('webkitHidden' in document) {
    // Chrome up to v32, Android up to v4.4, Blackberry up to v10
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  }

  return { hidden, visibilityChange };
}

export const DocumentVisibilityContext = createContext(false);

export const DocumentVisibilityRoot: FC = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const { hidden, visibilityChange } = getBrowserApi();

    const listener = () => {
      setIsVisible(!(document as any)[hidden]);
    };

    document.addEventListener(visibilityChange, listener);

    return () => {
      document.removeEventListener(visibilityChange, listener);
    };
  }, []);

  return (
    <DocumentVisibilityContext.Provider value={isVisible}>{children}</DocumentVisibilityContext.Provider>
  );
};

export function useDocumentVisibility(): boolean {
  return useContext(DocumentVisibilityContext);
}

/**
 * Listens for visibilitychange events for the current tab.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event|MDN}
 * @returns `true` if the tab is currently visible, else `false`.
 */
// export default function useDocumentVisible() {
//   const [isVisible, setIsVisible] = useState(true);

//   useEffect(() => {
//     const { hidden, visibilityChange } = getBrowserApi();

//     const listener = () => {
//       setIsVisible(!(document as any)[hidden]);
//     };

//     document.addEventListener(visibilityChange, listener);

//     return () => {
//       document.removeEventListener(visibilityChange, listener);
//     };
//   }, []);

//   return isVisible;
// }
