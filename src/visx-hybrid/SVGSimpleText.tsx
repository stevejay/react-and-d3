import type { Anchor, SVGTextProps, TextStyles } from './types';

const SVGStyle = { overflow: 'visible' };

interface SVGSimpleTextOwnProps {
  /** Horizontal text anchor. */
  textAnchor?: Anchor;
  /** Vertical text anchor. */
  verticalAnchor?: Anchor;
  /** Fill color of text. */
  // fill?: string;
  textStyles?: TextStyles; // font, fill, className
  // style?: CSSProperties;
  angle?: number;
  x: number;
  y: number;
  fontHeight: number;
  fontHeightFromBaseline: number;
  /** String (or number coercible to one) to be styled and positioned. */
  children?: string | number;
}

export type TextProps = Partial<Omit<SVGTextProps, keyof SVGSimpleTextOwnProps>>;

export type SVGSimpleTextProps = SVGSimpleTextOwnProps & SVGTextProps;

/** A very simple version of the Text component from Visx. */
export function SVGSimpleText({
  textAnchor,
  verticalAnchor,
  children,
  fill,
  textStyles,
  style,
  angle,
  x,
  y,
  fontHeight,
  fontHeightFromBaseline,
  ...textProps
}: SVGSimpleTextProps) {
  const combinedStyle =
    typeof textStyles?.font === 'string'
      ? { font: textStyles?.font, ...style }
      : textStyles
      ? { ...textStyles.font, ...style }
      : style;
  const textY =
    verticalAnchor === 'middle'
      ? '0.355em' // This is 0.71em * 0.5. The 0.71em value is from d3.
      : verticalAnchor === 'start'
      ? fontHeightFromBaseline
      : -1 * (fontHeight - fontHeightFromBaseline);
  const transform = angle ? `rotate(${angle}, 0, 0)` : undefined;
  return (
    <svg x={x} y={y} style={SVGStyle}>
      <text
        textAnchor={textAnchor}
        y={textY}
        fill={fill ?? 'currentColor'}
        style={combinedStyle}
        transform={transform}
        {...textProps}
      >
        {children}
      </text>
    </svg>
  );
}
