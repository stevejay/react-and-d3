/**
 * Will be `true` if the code is running in the browser or a browser-like environment.
 */
export const canUseDOM = Boolean(
  typeof globalThis.window !== 'undefined' &&
    globalThis.window.document &&
    globalThis.window.document.createElement
);
