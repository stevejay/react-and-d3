import { useMemo, useState } from 'react';
// import useResizeObserver from '@react-hook/resize-observer';
import { debounce } from 'lodash-es';
import useResizeObserver from 'use-resize-observer';

// Hook from the use-resize-observer documentation.
// Preferring use-resize-observer to @react-hook/resize-observer
// because the former seems to handle more edge cases in the source code.
export const useDebouncedResizeObserver = (
  wait: number
): { ref: ReturnType<typeof useResizeObserver>['ref']; width?: number; height?: number } => {
  const [size, setSize] = useState({});
  const onResize = useMemo(() => debounce(setSize, wait, { leading: true }), [wait]);
  const { ref } = useResizeObserver({ onResize });
  return { ref, ...size };
};

//   const onResize = useMemo(() => throttle(setSize, wait), [wait]);

// export const useDebouncedResizeObserver = (
//   wait: number
// ): { ref: (node: HTMLElement | null) => void; size: DOMRect | null } => {
//   const [size, setSize] = useState<DOMRect | null>(null);
//   const onResize = useMemo(() => debounce(setSize, wait, { leading: true }), [wait]);

//   const [node, ref] = useState<HTMLElement | null>(null);
//   useResizeObserver(node, (entry) => onResize(entry.contentRect));

//   useLayoutEffect(() => {
//     console.log('LAYOUT EFFECT');
//     node !== null && setSize(node.getBoundingClientRect());
//   }, [node]);

//   return { ref, size };
// };
