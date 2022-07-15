import {
  CSSProperties,
  ReactNode,
  SVGProps,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { usePopper } from 'react-popper';
import { animated, useTransition } from 'react-spring';
import type { Options as PopperOptions, VirtualElement } from '@popperjs/core';
import { PickD3Scale } from '@visx/scale';
import { TooltipProps as BaseTooltipProps } from '@visx/tooltip/lib/tooltips/Tooltip';
import { easeCubicInOut } from 'd3-ease';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { Portal } from '@/pages/StateOfJS/Portal';

import { isValidNumber } from './types/typeguards/isValidNumber';
import { DataContext } from './DataContext';
import { TooltipContext } from './TooltipContext';
import { TooltipContextType } from './types';

export type RenderTooltipParams<Datum extends object> = TooltipContextType<Datum> & {
  colorScale?: PickD3Scale<'ordinal', string, string>;
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
  showSeriesGlyphs?: boolean;
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
  // showDatumGlyph = false,
  // showHorizontalCrosshair = false,
  // showSeriesGlyphs = false,
  // showVerticalCrosshair = false,
  snapTooltipToDatumX = false,
  snapTooltipToDatumY = false
}: // verticalCrosshairStyle,
// ...tooltipProps
PopperTooltipProps<Datum>) {
  const { colorScale /*,  innerHeight, innerWidth, margin */ } = useContext(DataContext) || {};
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

  // const tooltip = useVirtualElementTooltip<Datum>(popperOptions);

  // const { containerRef, TooltipInPortal, forceRefreshBounds } = useTooltipInPortal({
  //   debounce,
  //   detectBounds,
  //   polyfill: resizeObserverPolyfill,
  //   scroll
  // });

  // To correctly position itself in a Portal, the tooltip must know its container bounds
  // this is done by rendering an invisible node whose ref can be used to find its parentElement
  const setContainerRef = useCallback((ownRef: HTMLElement | SVGElement | null) => {
    referenceElement.current = ownRef ? ownRef.parentElement : null;
    // containerRef(ownRef?.parentElement ?? null);
  }, []);

  useLayoutEffect(() => {
    updateRef.current?.();
  }, [showTooltip, tooltipLeft, tooltipTop]);

  // console.log('tooltip', tooltipLeft, nearestDatum?.snapLeft);

  // const tooltipContent = tooltipContext?.tooltipOpen
  //   ? renderTooltip({ ...tooltipContext, colorScale })
  //   : null;

  // const showTooltip = tooltipContext?.tooltipOpen && tooltipContent != null;

  // useTooltipInPortal is powered by react-use-measure and will update portal positions upon
  // resize and page scroll. however it **cannot** detect when a chart container moves on a
  // page due to animation or drag-and-drop, etc.
  // therefore we force refresh the bounds any time we transition from a hidden tooltip to
  // one that is visible.
  // const lastShowTooltip = useRef(false);
  // useEffect(() => {
  //   if (showTooltip && !lastShowTooltip.current) {
  //     forceRefreshBounds();
  //   }
  //   lastShowTooltip.current = showTooltip;
  // }, [showTooltip, forceRefreshBounds]);

  // let tooltipLeft = tooltipContext?.tooltipLeft;
  // let tooltipTop = tooltipContext?.tooltipTop;

  // const xScaleBandwidth = xScale ? getScaleBandwidth(xScale) : 0;
  // const yScaleBandwidth = yScale ? getScaleBandwidth(yScale) : 0;

  // const getDatumLeftTop = useCallback(
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   (key: string, datum: Datum, tooltipDatum: any) => {
  //     // console.log('tooltipDatum', tooltipDatum);
  //     const entry = dataRegistry?.get(key);
  //     const xAccessor = entry?.xAccessor;
  //     const yAccessor = entry?.yAccessor;

  //     // console.log('datum', datum, xScale && xAccessor && xAccessor(datum));

  //     const left =
  //       xScale && xAccessor
  //         ? Number(xScale(xAccessor(tooltipDatum?.stackDatum || datum))) + xScaleBandwidth / 2 ?? 0
  //         : undefined;

  //     const top =
  //       yScale && yAccessor
  //         ? Number(yScale(yAccessor(tooltipDatum?.stackDatum || datum))) + yScaleBandwidth / 2 ?? 0
  //         : undefined;

  //     // console.log('>>', left, tooltipDatum?.snapLeft, top, tooltipDatum?.snapTop);

  //     return { left, top };
  //   },
  //   [dataRegistry, xScaleBandwidth, yScaleBandwidth, xScale, yScale]
  // );

  // console.log('data', showTooltip, nearestDatum, snapTooltipToDatumX || snapTooltipToDatumY);

  // snap x- or y-coord to the actual data point (not event coordinates)
  // if (showTooltip && nearestDatum && (snapTooltipToDatumX || snapTooltipToDatumY)) {
  //   // TODO snapLeft and snapTopare always defined.
  //   // if (!isNil(nearestDatum.snapLeft) && !isNil(nearestDatum.snapTop)) {

  //   tooltipLeft =
  //     snapTooltipToDatumX && isValidNumber(nearestDatum.snapLeft) ? nearestDatum.snapLeft : tooltipLeft;
  //   tooltipTop =
  //     snapTooltipToDatumY && isValidNumber(nearestDatum.snapTop) ? nearestDatum.snapTop : tooltipTop;

  //   // } else {
  //   //   const { left, top } = getDatumLeftTop(nearestDatumKey, nearestDatum.datum, nearestDatum);
  //   //   // console.log('left/top', left, top);
  //   //   tooltipLeft = snapTooltipToDatumX && isValidNumber(left) ? left : tooltipLeft;
  //   //   tooltipTop = snapTooltipToDatumY && isValidNumber(top) ? top : tooltipTop;
  //   // }
  // }

  // collect positions + styles for glyphs; glyphs always snap to Datum, not event coords
  // const glyphProps: GlyphProps[] = [];

  // if (showTooltip && (showDatumGlyph || showSeriesGlyphs)) {
  //   const radius = Number(glyphStyle?.radius ?? 4);
  //   const strokeWidth = Number(glyphStyle?.strokeWidth ?? 1.5);

  //   if (showSeriesGlyphs) {
  //     Object.values(tooltipContext?.tooltipData?.datumByKey ?? {}).forEach((tooltipDatum) => {
  //       const color = colorScale?.(tooltipDatum.key) ?? theme?.htmlLabel?.color ?? '#222';
  //       // const { left, top } = getDatumLeftTop(tooltipDatum.key, tooltipDatum.datum, tooltipDatum);

  //       const { snapLeft: left, snapTop: top } = tooltipDatum;

  //       // don't show glyphs if coords are unavailable
  //       if (!isValidNumber(left) || !isValidNumber(top)) return;

  //       glyphProps.push({
  //         left: left - radius - strokeWidth,
  //         top: top - radius - strokeWidth,
  //         fill: color,
  //         stroke: theme?.backgroundColor,
  //         strokeWidth,
  //         radius
  //       });
  //     });
  //   } else if (nearestDatum) {
  //     // const { left, top } = getDatumLeftTop(nearestDatumKey, nearestDatum.datum, nearestDatum);
  //     const { snapLeft: left, snapTop: top } = nearestDatum;

  //     // don't show glyphs if coords are unavailable
  //     if (isValidNumber(left) && isValidNumber(top)) {
  //       glyphProps.push({
  //         left: left - radius - strokeWidth,
  //         top: top - radius - strokeWidth,
  //         fill:
  //           (nearestDatumKey && colorScale?.(nearestDatumKey)) ??
  //           null ??
  //           theme?.gridStyles?.stroke ??
  //           theme?.htmlLabel?.color ??
  //           '#222',
  //         radius,
  //         strokeWidth
  //       });
  //     }
  //   }
  // }

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
        (styles, item) =>
          item && (
            <Portal node={document && document.getElementById('portal-tooltip')}>
              <animated.div
                ref={setPopperElement}
                style={{ ...styles, ...popperStyles.popper }}
                className={`text-slate-900 bg-slate-100 pointer-events-none px-3 py-1 shadow-md max-w-[280px] `}
                {...attributes.popper}
                aria-hidden
              >
                {renderTooltip({ ...tooltipContext, colorScale })}
              </animated.div>
            </Portal>
          )
      )}
    </>
  );
}
