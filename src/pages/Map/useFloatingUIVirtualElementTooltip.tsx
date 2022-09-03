import { MutableRefObject, useCallback, useRef, useState } from 'react';
import { offset, Strategy, useFloating } from '@floating-ui/react-dom-interactions';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

export interface TooltipState<Datum> {
  // styles: { [key: string]: CSSProperties };
  // attributes: { [key: string]: { [key: string]: string } | undefined };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  referenceElement: MutableRefObject<any>;
  floatingElement: (node: HTMLElement | null) => void;
  // popperElement: Dispatch<SetStateAction<HTMLElement | null>>;
  datum: Datum | null;
  isVisible: boolean;
  show: (x: number, y: number, datum: Datum, isEqual?: (prev: Datum, curr: Datum) => boolean) => void;
  hide: () => void;
  strategy: Strategy;
  top: number;
  left: number;
}

export function useFloatingUIVirtualElementTooltip<Datum>(): // popperOptions?: Partial<PopperOptions>
TooltipState<Datum> {
  const [isVisible, setVisible] = useState<boolean>(false);
  const [datum, setDatum] = useState<Datum | null>(null);
  // const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  const referenceElement = useRef<HTMLElement | null>(null); // TODO should this be state?

  const virtualReferenceCoords = useRef<[number, number]>([0, 0]);
  const updateRef = useRef<ReturnType<typeof useFloating>['update']>();

  const { x, y, strategy, reference, floating, update } = useFloating({
    placement: 'top',
    open: isVisible,
    middleware: [offset({ mainAxis: 12 })]
  });

  // TODO could call reference in an event handler.
  useIsomorphicLayoutEffect(() => {
    reference({
      // getBoundingClientRect is always relative to the viewport, not a container element.
      getBoundingClientRect() {
        const rect = referenceElement.current?.getBoundingClientRect() ?? { top: 0, left: 0 };
        const top = rect.top + (virtualReferenceCoords.current?.[1] ?? 0);
        const left = rect.left + (virtualReferenceCoords.current?.[0] ?? 0);
        return { top, left, bottom: top, right: left, width: 0, height: 0, x: left, y: top };
      }
    });
  }, [reference]);

  // // getBoundingClientRect is always relative to the viewport, not a container element.
  // const virtualReference = useMemo<VirtualElement>(
  //   () =>
  //     ({
  //       getBoundingClientRect() {
  //         const rect = referenceElement.current?.getBoundingClientRect() ?? { top: 0, left: 0 };
  //         const top = rect.top + (virtualReferenceCoords.current?.[1] ?? 0);
  //         const left = rect.left + (virtualReferenceCoords.current?.[0] ?? 0);
  //         return { top, left, bottom: top, right: left, width: 0, height: 0, x: left, y: top };
  //       }
  //     } as VirtualElement),
  //   []
  // );

  // const { styles, attributes, update } = usePopper(virtualReference, popperElement, popperOptions);

  // Create a ref to the update function to enable the show function to not have update
  // in its dependency array.
  useIsomorphicLayoutEffect(() => {
    updateRef.current = update;
  }, [update]);

  const show = useCallback<TooltipState<Datum>['show']>(
    (clientX, clientY, datum, isEqual = (prev, curr) => prev === curr) => {
      if (!referenceElement.current) {
        setVisible(false);
        return;
      }
      const rect = referenceElement.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      virtualReferenceCoords.current = [x, y];
      setVisible(true);
      setDatum((state) => (state && isEqual(state, datum) ? state : datum));
      // Imperatively update the popper so that the tooltip position updates.
      updateRef.current?.();
    },
    []
  );

  const hide = useCallback(() => setVisible(false), []);

  return {
    strategy,
    top: x ?? 0,
    left: y ?? 0,
    referenceElement,
    floatingElement: floating,
    datum,
    isVisible,
    show,
    hide
  };
}
