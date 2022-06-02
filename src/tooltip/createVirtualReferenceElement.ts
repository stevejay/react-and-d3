import { RefObject } from 'react';
import { TippyProps } from '@tippyjs/react/headless';

import { Rect } from '@/types';

/**
 * This function is used to generate a virtual reference element for use with Tippy.js
 * (which uses Popper.js internally).
 * Inspired by: https://github.com/keplergl/kepler.gl/blob/612e18a9988b580f9258eb427e76bbdcfc49072b/src/components/map/map-popover.js#L129
 */
export function createVirtualReferenceElement(
  container: RefObject<SVGSVGElement>,
  r: Rect
): ReturnType<NonNullable<TippyProps['getReferenceClientRect']>> {
  const bounds =
    container.current && container.current.getBoundingClientRect
      ? container.current.getBoundingClientRect()
      : { left: 0, top: 0 };
  const left = (bounds.left ?? 0) + r.x;
  const top = (bounds.top ?? 0) + r.y;
  return {
    left,
    top,
    right: left + r.width,
    bottom: top + r.height,
    width: r.width,
    height: r.height
  } as DOMRect;
}
