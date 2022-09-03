import { useEffect, useLayoutEffect } from 'react';

export const useIsomorphicLayoutEffect =
  typeof globalThis.document !== 'undefined' ? useLayoutEffect : useEffect;
