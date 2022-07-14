import { CSSProperties, ReactNode, SVGProps, useCallback, useContext, useEffect, useRef } from 'react';
import { PickD3Scale } from '@visx/scale';
import { defaultStyles, useTooltipInPortal } from '@visx/tooltip';
import { UseTooltipPortalOptions } from '@visx/tooltip/lib/hooks/useTooltipInPortal';
import { TooltipProps as BaseTooltipProps } from '@visx/tooltip/lib/tooltips/Tooltip';

import { isValidNumber } from './types/typeguards/isValidNumber';
import { DataContext } from './DataContext';
// import { getScaleBandwidth } from './scale';
import { TooltipContext } from './TooltipContext';
import { TooltipContextType } from './types';

/** fontSize + lineHeight from default styles break precise location of crosshair, etc. */
const TOOLTIP_NO_STYLE: CSSProperties = {
  position: 'absolute',
  pointerEvents: 'none',
  fontSize: 0,
  lineHeight: 0
};

type GlyphProps = {
  left?: number;
  top?: number;
  fill?: string;
  stroke?: string;
  strokeWidth: number;
  radius: number;
};

export type RenderTooltipParams<Datum extends object> = TooltipContextType<Datum> & {
  colorScale?: PickD3Scale<'ordinal', string, string>;
};

export type TooltipProps<Datum extends object> = {
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
  /**
   * Tooltip depends on ResizeObserver, which may be polyfilled globally
   * or injected into this component.
   */
  resizeObserverPolyfill?: UseTooltipPortalOptions['polyfill'];
} & Omit<BaseTooltipProps, 'left' | 'top' | 'children'> &
  Pick<UseTooltipPortalOptions, 'debounce' | 'detectBounds' | 'scroll'>;

const INVISIBLE_STYLES: CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  opacity: 0,
  width: 0,
  height: 0,
  pointerEvents: 'none'
};

export default function Tooltip<Datum extends object>({
  debounce,
  detectBounds,
  horizontalCrosshairStyle,
  glyphStyle,
  renderTooltip,
  resizeObserverPolyfill,
  scroll = true,
  showDatumGlyph = false,
  showHorizontalCrosshair = false,
  showSeriesGlyphs = false,
  showVerticalCrosshair = false,
  snapTooltipToDatumX = false,
  snapTooltipToDatumY = false,
  verticalCrosshairStyle,
  ...tooltipProps
}: TooltipProps<Datum>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const theme: any = {};
  const {
    colorScale,
    innerHeight,
    innerWidth,
    margin
    // , xScale, yScale, dataRegistry
  } = useContext(DataContext) || {};
  const tooltipContext = useContext(TooltipContext) as TooltipContextType<Datum>;
  const { containerRef, TooltipInPortal, forceRefreshBounds } = useTooltipInPortal({
    debounce,
    detectBounds,
    polyfill: resizeObserverPolyfill,
    scroll
  });

  // To correctly position itself in a Portal, the tooltip must know its container bounds
  // this is done by rendering an invisible node whose ref can be used to find its parentElement
  const setContainerRef = useCallback(
    (ownRef: HTMLElement | SVGElement | null) => {
      containerRef(ownRef?.parentElement ?? null);
    },
    [containerRef]
  );

  const tooltipContent = tooltipContext?.tooltipOpen
    ? renderTooltip({ ...tooltipContext, colorScale })
    : null;

  const showTooltip = tooltipContext?.tooltipOpen && tooltipContent != null;

  // useTooltipInPortal is powered by react-use-measure and will update portal positions upon
  // resize and page scroll. however it **cannot** detect when a chart container moves on a
  // page due to animation or drag-and-drop, etc.
  // therefore we force refresh the bounds any time we transition from a hidden tooltip to
  // one that is visible.
  const lastShowTooltip = useRef(false);
  useEffect(() => {
    if (showTooltip && !lastShowTooltip.current) {
      forceRefreshBounds();
    }
    lastShowTooltip.current = showTooltip;
  }, [showTooltip, forceRefreshBounds]);

  let tooltipLeft = tooltipContext?.tooltipLeft;
  let tooltipTop = tooltipContext?.tooltipTop;

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

  const nearestDatum = tooltipContext?.tooltipData?.nearestDatum;
  const nearestDatumKey = nearestDatum?.key ?? '';

  // console.log('data', showTooltip, nearestDatum, snapTooltipToDatumX || snapTooltipToDatumY);

  // snap x- or y-coord to the actual data point (not event coordinates)
  if (showTooltip && nearestDatum && (snapTooltipToDatumX || snapTooltipToDatumY)) {
    // TODO snapLeft and snapTopare always defined.
    // if (!isNil(nearestDatum.snapLeft) && !isNil(nearestDatum.snapTop)) {

    tooltipLeft =
      snapTooltipToDatumX && isValidNumber(nearestDatum.snapLeft) ? nearestDatum.snapLeft : tooltipLeft;
    tooltipTop =
      snapTooltipToDatumY && isValidNumber(nearestDatum.snapTop) ? nearestDatum.snapTop : tooltipTop;

    // } else {
    //   const { left, top } = getDatumLeftTop(nearestDatumKey, nearestDatum.datum, nearestDatum);
    //   // console.log('left/top', left, top);
    //   tooltipLeft = snapTooltipToDatumX && isValidNumber(left) ? left : tooltipLeft;
    //   tooltipTop = snapTooltipToDatumY && isValidNumber(top) ? top : tooltipTop;
    // }
  }

  // collect positions + styles for glyphs; glyphs always snap to Datum, not event coords
  const glyphProps: GlyphProps[] = [];

  if (showTooltip && (showDatumGlyph || showSeriesGlyphs)) {
    const radius = Number(glyphStyle?.radius ?? 4);
    const strokeWidth = Number(glyphStyle?.strokeWidth ?? 1.5);

    if (showSeriesGlyphs) {
      Object.values(tooltipContext?.tooltipData?.datumByKey ?? {}).forEach((tooltipDatum) => {
        const color = colorScale?.(tooltipDatum.key) ?? theme?.htmlLabel?.color ?? '#222';
        // const { left, top } = getDatumLeftTop(tooltipDatum.key, tooltipDatum.datum, tooltipDatum);

        const { snapLeft: left, snapTop: top } = tooltipDatum;

        // don't show glyphs if coords are unavailable
        if (!isValidNumber(left) || !isValidNumber(top)) return;

        glyphProps.push({
          left: left - radius - strokeWidth,
          top: top - radius - strokeWidth,
          fill: color,
          stroke: theme?.backgroundColor,
          strokeWidth,
          radius
        });
      });
    } else if (nearestDatum) {
      // const { left, top } = getDatumLeftTop(nearestDatumKey, nearestDatum.datum, nearestDatum);
      const { snapLeft: left, snapTop: top } = nearestDatum;

      // don't show glyphs if coords are unavailable
      if (isValidNumber(left) && isValidNumber(top)) {
        glyphProps.push({
          left: left - radius - strokeWidth,
          top: top - radius - strokeWidth,
          fill:
            (nearestDatumKey && colorScale?.(nearestDatumKey)) ??
            null ??
            theme?.gridStyles?.stroke ??
            theme?.htmlLabel?.color ??
            '#222',
          radius,
          strokeWidth
        });
      }
    }
  }

  return (
    // Tooltip can be rendered as a child of SVG or HTML since its output is rendered in a Portal.
    // So use svg element to find container ref because it's a valid child of SVG and HTML parents.
    <>
      <svg ref={setContainerRef} style={INVISIBLE_STYLES} />
      {showTooltip && (
        <>
          {/** To correctly position crosshair / glyphs in a Portal, we leverage the logic in TooltipInPortal */}
          {showVerticalCrosshair && (
            <TooltipInPortal
              className="visx-crosshair visx-crosshair-vertical"
              left={tooltipLeft}
              top={margin?.top}
              offsetLeft={0}
              offsetTop={0}
              detectBounds={false}
              style={TOOLTIP_NO_STYLE}
            >
              <svg width="1" height={innerHeight} overflow="visible">
                <line
                  x1={0}
                  x2={0}
                  y1={0}
                  y2={innerHeight}
                  strokeWidth={1.5}
                  stroke={theme?.gridStyles?.stroke ?? theme?.htmlLabel?.color ?? '#222'}
                  {...verticalCrosshairStyle}
                />
              </svg>
            </TooltipInPortal>
          )}
          {showHorizontalCrosshair && (
            <TooltipInPortal
              className="visx-crosshair visx-crosshair-horizontal"
              left={margin?.left}
              top={tooltipTop}
              offsetLeft={0}
              offsetTop={0}
              detectBounds={false}
              style={TOOLTIP_NO_STYLE}
            >
              <svg width={innerWidth} height="1" overflow="visible">
                <line
                  x1={0}
                  x2={innerWidth}
                  y1={0}
                  y2={0}
                  strokeWidth={1.5}
                  stroke={theme?.gridStyles?.stroke ?? theme?.htmlLabel?.color ?? '#222'}
                  {...horizontalCrosshairStyle}
                />
              </svg>
            </TooltipInPortal>
          )}
          {glyphProps.map(({ left, top, fill, stroke, strokeWidth, radius }, i) =>
            top == null || left == null ? null : (
              <TooltipInPortal
                key={i}
                className="visx-tooltip-glyph"
                left={left}
                top={top}
                offsetLeft={0}
                offsetTop={0}
                detectBounds={false}
                style={TOOLTIP_NO_STYLE}
              >
                <svg width={(radius + strokeWidth) * 2} height={(radius + strokeWidth) * 2}>
                  {/** @TODO expand to support any @visx/glyph glyph */}
                  <circle
                    cx={radius + strokeWidth}
                    cy={radius + strokeWidth}
                    r={radius}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    paintOrder="fill"
                    {...glyphStyle}
                  />
                </svg>
              </TooltipInPortal>
            )
          )}
          <TooltipInPortal
            left={tooltipLeft}
            top={tooltipTop}
            style={{
              ...defaultStyles,
              background: theme?.backgroundColor ?? 'white',
              boxShadow: `0 1px 2px ${
                theme?.htmlLabel?.color ? `${theme?.htmlLabel?.color}55` : '#22222255'
              }`,
              ...theme?.htmlLabel
            }}
            {...tooltipProps}
          >
            {tooltipContent}
          </TooltipInPortal>
          {/* {tooltipTop && <circle cx={tooltipLeft} cy={tooltipTop} r={3} fill="red" />} */}
        </>
      )}
    </>
  );
}
