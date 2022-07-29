import {
  CSSProperties,
  ReactNode,
  SVGProps,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';
import { usePopper } from 'react-popper';
import { animated, useTransition } from 'react-spring';
import type { Options as PopperOptions, VirtualElement } from '@popperjs/core';
import type { PickD3Scale } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';

import { Portal } from '@/components/Portal';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

import { DataContext } from './DataContext';
import { isValidNumber } from './isValidNumber';
import { TooltipContext } from './TooltipContext';
import type { TooltipContextType, TooltipProps as BaseTooltipProps } from './types';

export type RenderTooltipParams<Datum extends object> = TooltipContextType<Datum> & {
  colorScale?: PickD3Scale<'ordinal', string, string>;
};

type GlyphProps = {
  left?: number;
  top?: number;
  fill?: string;
  stroke?: string;
  strokeWidth: number;
  radius: number;
};

export type PopperTooltipProps<Datum extends object> = {
  /**
   * When TooltipContext.tooltipOpen=true, this function is invoked and if the
   * return value is non-null, its content is rendered inside the tooltip container.
   * Content will be rendered in an HTML parent.
   */
  renderTooltip: (params: RenderTooltipParams<Datum>) => ReactNode;
  /** Whether to snap tooltip + crosshair x-coord to the nearest Datum x-coord instead of the event x-coord. */
  snapTooltipToDatumX?: boolean;
  /** Whether to snap tooltip + crosshair y-coord to the nearest Datum y-coord instead of the event y-coord. */
  snapTooltipToDatumY?: boolean;
  /** Whether to show a vertical line at tooltip position. */
  showVerticalCrosshair?: boolean;
  /** Whether to show a horizontal line at tooltip position. */
  showHorizontalCrosshair?: boolean;
  /** Whether to show a glyph at the tooltip position for the (single) nearest Datum. */
  showDatumGlyph?: boolean;
  /** Whether to show a glyph for the nearest Datum in each series. */
  // showSeriesGlyphs?: boolean;
  /** Optional styles for the vertical crosshair, if visible. */
  verticalCrosshairStyle?: SVGProps<SVGLineElement>;
  /** Optional styles for the vertical crosshair, if visible. */
  horizontalCrosshairStyle?: SVGProps<SVGLineElement>;
  /** Optional styles for the point, if visible. */
  glyphStyle?: SVGProps<SVGCircleElement>;
} & Omit<BaseTooltipProps, 'left' | 'top' | 'children'>;

const INVISIBLE_STYLES: CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  opacity: 0,
  width: 0,
  height: 0,
  pointerEvents: 'none'
};

const popperOptions: Partial<PopperOptions> = {
  placement: 'top',
  modifiers: [
    { name: 'flip', enabled: false },
    { name: 'offset', options: { offset: [0, 12] } }
  ]
};

export function PopperTooltip<Datum extends object>({
  renderTooltip,
  // scroll = true,
  showDatumGlyph = false,
  showHorizontalCrosshair = false,
  // showSeriesGlyphs = false,
  showVerticalCrosshair = false,
  snapTooltipToDatumX = false,
  snapTooltipToDatumY = false
}: // verticalCrosshairStyle,
// ...tooltipProps
PopperTooltipProps<Datum>) {
  const { /*colorScale, */ innerHeight, innerWidth, margin } = useContext(DataContext) || {};
  const tooltipContext = useContext(TooltipContext) as TooltipContextType<Datum>;
  const referenceElement = useRef<HTMLElement | null>(null); // TODO should this be state?
  const updateRef = useRef<ReturnType<typeof usePopper>['update']>();
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const nearestDatum = tooltipContext?.tooltipData?.nearestDatum;
  // const nearestDatumKey = nearestDatum?.key ?? '';
  const showTooltip = tooltipContext?.tooltipOpen; // && tooltipContent != null;
  let tooltipLeft = tooltipContext?.tooltipLeft;
  let tooltipTop = tooltipContext?.tooltipTop;

  // snap x- or y-coord to the actual data point (not event coordinates)
  if (nearestDatum && (snapTooltipToDatumX || snapTooltipToDatumY)) {
    tooltipLeft =
      snapTooltipToDatumX && isValidNumber(nearestDatum.snapLeft) ? nearestDatum.snapLeft : tooltipLeft;
    tooltipTop =
      snapTooltipToDatumY && isValidNumber(nearestDatum.snapTop) ? nearestDatum.snapTop : tooltipTop;
  }

  // getBoundingClientRect is always relative to the viewport, not a container element.
  const virtualReference = useMemo<VirtualElement>(
    () =>
      ({
        getBoundingClientRect() {
          const rect = referenceElement.current?.getBoundingClientRect() ?? { top: 0, left: 0 };
          const top = rect.top + (tooltipTop ?? 0);
          const left = rect.left + (tooltipLeft ?? 0);
          return { top, left, bottom: top, right: left, width: 0, height: 0, x: left, y: top };
        }
      } as VirtualElement),
    [tooltipLeft, tooltipTop]
  );

  const {
    styles: popperStyles,
    attributes,
    update
  } = usePopper(virtualReference, popperElement, popperOptions);

  // Create a ref to the update function to enable the show function to not have update
  // in its dependency array.
  useIsomorphicLayoutEffect(() => {
    updateRef.current = update;
  }, [update]);

  // To correctly position itself in a Portal, the tooltip must know its container bounds
  // this is done by rendering an invisible node whose ref can be used to find its parentElement
  const setContainerRef = useCallback((ownRef: HTMLElement | SVGElement | null) => {
    referenceElement.current = ownRef ? ownRef.parentElement : null;
  }, []);

  useIsomorphicLayoutEffect(() => {
    updateRef.current?.();
  }, [showTooltip, tooltipLeft, tooltipTop]);

  // collect positions + styles for glyphs; glyphs always snap to Datum, not event coords
  const glyphProps: GlyphProps[] = [];

  if (showDatumGlyph) {
    const radius = 4; // Number(glyphStyle?.radius ?? 4);
    const strokeWidth = 1.5; // Number(glyphStyle?.strokeWidth ?? 1.5);

    if (nearestDatum) {
      const { snapLeft: left, snapTop: top } = nearestDatum;

      // don't show glyphs if coords are unavailable
      if (isValidNumber(left) && isValidNumber(top)) {
        glyphProps.push({
          left: left - radius - strokeWidth,
          top: top - radius - strokeWidth,
          fill: 'red',
          radius,
          strokeWidth
        });
      }
    }
  }

  const transitions = useTransition(showTooltip, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0, delay: 200 },
    config: { duration: 200, easing: easeCubicInOut }
  });

  return (
    <>
      <svg ref={setContainerRef} style={INVISIBLE_STYLES} />
      {transitions(
        (springStyles, item) =>
          item && (
            <>
              {showVerticalCrosshair && (
                <animated.line
                  x1={tooltipLeft}
                  x2={tooltipLeft}
                  y1={margin?.top ?? 0}
                  y2={(margin?.top ?? 0) + (innerHeight ?? 0)}
                  strokeWidth={1.5}
                  stroke="#aaa"
                  style={{ ...springStyles }}
                  // {...verticalCrosshairStyle}
                />
              )}
              {showHorizontalCrosshair && (
                <animated.line
                  x1={margin?.left ?? 0}
                  x2={(margin?.left ?? 0) + (innerWidth ?? 0)}
                  y1={tooltipTop}
                  y2={tooltipTop}
                  strokeWidth={1.5}
                  stroke="#aaa"
                  style={{ ...springStyles }}
                />
              )}
              {glyphProps.map(({ left, top, fill, stroke, strokeWidth, radius }, i) =>
                top == null || left == null ? null : (
                  <animated.circle
                    key={i}
                    cx={left + radius + strokeWidth}
                    cy={top + radius + strokeWidth}
                    r={radius}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    paintOrder="fill"
                    style={{ ...springStyles }}
                    // {...glyphStyle}
                  />
                )
              )}
              <Portal node={document && document.getElementById('portal-tooltip')}>
                <animated.div
                  ref={setPopperElement}
                  style={{ ...springStyles, ...popperStyles.popper }}
                  className={`text-slate-900 bg-slate-100 pointer-events-none px-2 py-1 shadow-md max-w-[280px] text-sm leading-none rounded-sm`}
                  {...attributes.popper}
                  aria-hidden
                >
                  {renderTooltip({ ...tooltipContext /*, colorScale */ })}
                </animated.div>
              </Portal>
            </>
          )
      )}
    </>
  );
}
