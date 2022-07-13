import { RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { zoom, ZoomBehavior, zoomIdentity, ZoomTransform } from 'd3-zoom';

import { Point } from '@/types';

const defaultTranslateExtent = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
];

const defaultScaleExtent = [0, Number.POSITIVE_INFINITY];

export interface OptionsType {
  translateExtent?: [Point, Point];
  scaleExtent?: Point;
}

export type ReturnType<ElementT extends SVGElement> = [RefObject<ElementT>, ZoomTransform, () => void];

// All of the hook parameters do not need to be referentially stable.
export function useD3Zoom<ElementT extends SVGElement>(
  extent: [Point, Point],
  options?: OptionsType
): ReturnType<ElementT> {
  const { translateExtent, scaleExtent } = options ?? {};
  const interactionRef = useRef<ElementT>(null);
  const zoomRef = useRef<ZoomBehavior<ElementT, null> | null>(null);

  // The underlying state.
  const [transform, setTransform] = useState(zoomIdentity);

  // One-time initialisation of the zoom component.

  useLayoutEffect(() => {
    const refElement = interactionRef.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onZoom = (event: any) => setTransform(event.transform);
    // How do I re-initialise the zoom component?
    zoomRef.current = zoom<ElementT, null>();
    zoomRef.current.on('zoom', onZoom);
    return () => {
      zoomRef.current?.on('zoom', null);
      // Unbind the event listeners that D3 applies.
      // NOTE the '.' at the start of '.zoom' below is important!
      select(refElement).on('.zoom', null);
    };
  }, []);

  // Update the zoom params:

  const [[extent00, extent01], [extent10, extent11]] = extent;
  const [scaleExtent0, scaleExtent1] = scaleExtent ?? defaultScaleExtent;
  const [[translate00, translate01], [translate10, translate11]] = translateExtent ?? defaultTranslateExtent;

  useLayoutEffect(() => {
    zoomRef.current?.extent([
      [extent00, extent01],
      [extent10, extent11]
    ]);
    zoomRef.current?.scaleExtent([scaleExtent0, scaleExtent1]);
    zoomRef.current?.translateExtent([
      [translate00, translate01],
      [translate10, translate11]
    ]);
    if (interactionRef.current) {
      zoomRef.current?.(select(interactionRef.current));
    }
  }, [
    scaleExtent0,
    scaleExtent1,
    extent00,
    extent01,
    extent10,
    extent11,
    translate00,
    translate01,
    translate10,
    translate11
  ]);

  // Reset the zoom transform in the case that the chart has been updated.
  // https://stackoverflow.com/a/67976133/604006
  const reset = useCallback(() => {
    if (interactionRef.current) {
      zoomRef.current?.(select(interactionRef.current), zoomRef.current?.transform, zoomIdentity);
    }
  }, []);

  return [interactionRef, transform, reset];
}
