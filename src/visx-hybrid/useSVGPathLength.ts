import { RefObject, useRef, useState } from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export function useSVGPathLength(): [number, RefObject<SVGPathElement>] {
  const pathRef = useRef<SVGPathElement>(null);
  const [offset, setOffset] = useState<number>(0);
  useIsomorphicLayoutEffect(() => {
    setOffset(pathRef.current?.getTotalLength() ?? 0);
  });
  return [offset, pathRef];
}
