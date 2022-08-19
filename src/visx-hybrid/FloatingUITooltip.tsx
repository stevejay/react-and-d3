import { CSSProperties, ReactNode, SVGProps, useCallback, useRef } from 'react';
import { animated, useTransition } from 'react-spring';
import { offset, useFloating } from '@floating-ui/react-dom-interactions';
import type { PickD3Scale } from '@visx/scale';
import { easeCubicInOut } from 'd3-ease';
import { isNil } from 'lodash-es';

import { defaultTheme, defaultTooltipGlyphRadius } from './constants';
import { isValidNumber } from './isValidNumber';
import { Portal } from './Portal';
import type { TooltipDatum, TooltipProps as BaseTooltipProps, TooltipStateContextType } from './types';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { useTooltipStateContext } from './useTooltipStateContext';
import { useXYChartContext } from './useXYChartContext';

function addGlyph<Datum extends object>(
  glyphProps: GlyphProps[],
  datum: TooltipDatum<Datum>,
  key: string | number,
  radius: number,
  strokeWidth: number
) {
  const { snapLeft: left, snapTop: top } = datum;
  if (isValidNumber(left) && isValidNumber(top)) {
    glyphProps.push({ key, left, top, radius, strokeWidth });
  }
}

export type RenderTooltipParams<Datum extends object> = TooltipStateContextType<Datum> & {
  colorScale?: PickD3Scale<'ordinal', string, string>;
};

type GlyphProps = {
  key: string | number;
  left?: number;
  top?: number;
  fill?: string;
  stroke?: string;
  strokeWidth: number;
  radius: number;
};

export type FloatingUITooltipProps<Datum extends object> = {
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

const invisibleStyle: CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  opacity: 0,
  width: 0,
  height: 0,
  pointerEvents: 'none'
};

export function FloatingUITooltip<Datum extends object>({
  renderTooltip,
  showDatumGlyph = false,
  showSeriesGlyphs = false,
  showHorizontalCrosshair = false,
  showVerticalCrosshair = false,
  snapTooltipToDatumX = false,
  snapTooltipToDatumY = false
}: FloatingUITooltipProps<Datum>) {
  const { innerHeight, innerWidth, margin, theme } = useXYChartContext();
  const tooltipContext = useTooltipStateContext<Datum>();
  const referenceElement = useRef<HTMLElement | null>(null); // TODO should this be state?
  const updateRef = useRef<ReturnType<typeof useFloating>['update']>();
  const nearestDatum = tooltipContext?.tooltipData?.nearestDatum;
  const showTooltip = tooltipContext?.tooltipOpen;
  let tooltipLeft = tooltipContext?.tooltipLeft;
  let tooltipTop = tooltipContext?.tooltipTop;

  // snap x- or y-coord to the actual data point (not event coordinates)
  if (nearestDatum && (snapTooltipToDatumX || snapTooltipToDatumY)) {
    tooltipLeft =
      snapTooltipToDatumX && isValidNumber(nearestDatum.snapLeft) ? nearestDatum.snapLeft : tooltipLeft;
    tooltipTop =
      snapTooltipToDatumY && isValidNumber(nearestDatum.snapTop) ? nearestDatum.snapTop : tooltipTop;
  }

  const { x, y, reference, floating, update, strategy } = useFloating({
    placement: 'top',
    open: showTooltip,
    middleware: [offset({ mainAxis: 12 })]
  });

  // TODO could call reference in an event handler.
  useIsomorphicLayoutEffect(() => {
    reference({
      // getBoundingClientRect is always relative to the viewport, not a container element.
      getBoundingClientRect() {
        const rect = referenceElement.current?.getBoundingClientRect() ?? { top: 0, left: 0 };
        const top = rect.top + (tooltipTop ?? 0);
        const left = rect.left + (tooltipLeft ?? 0);
        return { top, left, bottom: top, right: left, width: 0, height: 0, x: left, y: top };
      }
    });
  }, [reference, tooltipLeft, tooltipTop]);

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

  if (showDatumGlyph || showSeriesGlyphs) {
    const radius = Number(theme?.tooltip?.glyph?.radius ?? defaultTooltipGlyphRadius);
    const strokeWidth = Number(theme?.tooltip?.glyph?.strokeWidth ?? 0);

    if (showSeriesGlyphs) {
      tooltipContext?.tooltipData?.datumByKey.forEach((datum, key) => {
        addGlyph(glyphProps, datum, key, radius, strokeWidth);
      });
    } else if (nearestDatum) {
      addGlyph(glyphProps, nearestDatum, nearestDatum.key, radius, strokeWidth);
    }
  }

  const transitions = useTransition(showTooltip, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0, delay: 200 },
    config: { duration: 200, easing: easeCubicInOut }
  });

  const { style: crosshairsStyle, ...restCrosshairsStyles } = theme?.tooltip?.crosshairs ?? {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { strokeWidth: _strokeWidth, radius: _radius, ...restGlyphStyles } = theme?.tooltip?.glyph ?? {};
  const { style: containerStyle, ...restContainerStyles } =
    theme?.tooltip?.container ?? defaultTheme.tooltip?.container ?? {};

  return (
    <>
      <svg ref={setContainerRef} style={invisibleStyle} />
      {transitions(
        (springStyles, item) =>
          item && (
            <>
              {showVerticalCrosshair && (
                <animated.line
                  x1={tooltipLeft}
                  x2={tooltipLeft}
                  y1={margin.top ?? 0}
                  y2={(margin.top ?? 0) + (innerHeight ?? 0)}
                  strokeWidth={1}
                  stroke="currentColor"
                  style={{ ...crosshairsStyle, ...springStyles }}
                  {...restCrosshairsStyles}
                />
              )}
              {showHorizontalCrosshair && (
                <animated.line
                  x1={margin.left ?? 0}
                  x2={(margin.left ?? 0) + (innerWidth ?? 0)}
                  y1={tooltipTop}
                  y2={tooltipTop}
                  strokeWidth={1}
                  stroke="currentColor"
                  style={{ ...crosshairsStyle, ...springStyles }}
                  {...restCrosshairsStyles}
                />
              )}
              {glyphProps.map(({ key, left, top, strokeWidth, radius }) =>
                isNil(top) || isNil(left) ? null : (
                  <animated.circle
                    key={key}
                    cx={left}
                    cy={top}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="currentColor"
                    paintOrder="fill"
                    style={{ ...springStyles }}
                    {...restGlyphStyles}
                  />
                )
              )}
              <Portal node={document && document.getElementById('tooltip-portal')}>
                <animated.div
                  ref={floating}
                  style={{
                    ...containerStyle,
                    ...springStyles,
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0
                  }}
                  role="presentation"
                  aria-hidden
                  {...restContainerStyles}
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
