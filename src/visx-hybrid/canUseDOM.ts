export const canUseDOM = !!(
  typeof globalThis.window !== 'undefined' &&
  globalThis.window.document &&
  globalThis.window.document.createElement
);
