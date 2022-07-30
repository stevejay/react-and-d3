import { Text } from '@visx/text';

import { TextProps } from './SVGSimpleText';
import type {
  AxisOrientation,
  TextAnchor,
  ThemeLabelStyles,
  TickLabelAngle,
  VerticalTextAnchor
} from './types';

function getTextAnchor(orientation: AxisOrientation, tickLabelAngle: TickLabelAngle): TextAnchor {
  let textAnchor: TextAnchor = 'middle';
  if (orientation === 'left') {
    if (tickLabelAngle !== 'vertical') {
      textAnchor = 'end';
    }
  } else if (orientation === 'right') {
    if (tickLabelAngle !== 'vertical') {
      textAnchor = 'start';
    }
  } else if (orientation === 'top') {
    if (tickLabelAngle === 'vertical') {
      textAnchor = 'start';
    }
  } else if (orientation === 'bottom') {
    if (tickLabelAngle === 'vertical') {
      textAnchor = 'end';
    }
  }
  return textAnchor;
}

function getVerticalTextAnchor(
  orientation: AxisOrientation,
  tickLabelAngle: TickLabelAngle
): VerticalTextAnchor {
  let verticalAnchor: VerticalTextAnchor = 'middle';
  if (orientation === 'left' || orientation === 'right') {
    if (tickLabelAngle === 'vertical') {
      verticalAnchor = 'end';
    }
  } else if (orientation === 'top') {
    verticalAnchor = 'end';
  } else if (orientation === 'bottom') {
    verticalAnchor = 'start';
  }
  return verticalAnchor;
}

function getTextAngle(orientation: AxisOrientation, tickLabelAngle: TickLabelAngle): number {
  let angle = 0;
  if (tickLabelAngle === 'vertical') {
    if (orientation === 'right') {
      angle = 90;
    } else {
      angle = -90;
    }
  } else if (tickLabelAngle === 'angled') {
    angle = -45;
  }
  return angle;
}

function getDelta(orientation: AxisOrientation, tickLabelAngle: TickLabelAngle): { dx: string; dy: string } {
  const delta = { dx: '0em', dy: '0em' };
  if (tickLabelAngle === 'vertical') {
    if (orientation === 'top' || orientation === 'right') {
      delta.dx = '0.31em';
    } else {
      delta.dx = '-0.31em';
    }
  } else if (tickLabelAngle === 'horizontal') {
    if (orientation === 'top') {
      delta.dy = '-0.31em';
    } else if (orientation === 'bottom') {
      delta.dy = '0.31em';
    }
  } else {
    // Angled.
    if (orientation === 'top') {
      delta.dx = '0.31em';
    } else if (orientation === 'bottom') {
      delta.dx = '-0.31em';
    }
  }
  return delta;
}

export interface SVGAxisTickLabelProps {
  orientation: AxisOrientation;
  label: string;
  labelStyles?: ThemeLabelStyles;
  /** If true, will hide the ticks (but not the tick labels). */
  hideTicks?: boolean;
  /** The angle that the tick label will be rendered at. */
  tickLabelAngle: TickLabelAngle;
  /** Padding between the tick lines and the tick labels. */
  tickLabelPadding: number;
  /** The props to apply to the tick labels. */
  tickLabelProps?: Partial<TextProps>;
  /** The length of the tick lines. */
  tickLength: number;
}

export function SVGAxisTickLabel({
  label,
  hideTicks,
  orientation,
  tickLabelProps = {},
  tickLength,
  tickLabelPadding,
  labelStyles,
  tickLabelAngle
}: SVGAxisTickLabelProps) {
  const isVerticalAxis = orientation === 'left' || orientation === 'right';
  const tickLineAxis = isVerticalAxis ? 'x' : 'y';
  const tickSign = orientation === 'left' || orientation === 'top' ? -1 : 1;

  const {
    style: labelPropsStyle,
    className: labelPropsClassname = ''
    // ...restTickLabelProps
  } = tickLabelProps;
  const style =
    typeof labelStyles?.font === 'string' ? { font: labelStyles?.font, ...labelPropsStyle } : labelPropsStyle;

  const textAnchor = getTextAnchor(orientation, tickLabelAngle);
  const verticalAnchor = getVerticalTextAnchor(orientation, tickLabelAngle);
  const angle = getTextAngle(orientation, tickLabelAngle);
  const delta = getDelta(orientation, tickLabelAngle);

  // return (
  //   <text
  //     data-testid="axis-label"
  //     role="presentation"
  //     aria-hidden
  //     textAnchor={textAnchor}
  //     fill={labelStyles?.fill ?? 'currentColor'}
  //     style={style}
  //     className={`${labelStyles?.className ?? ''} ${labelPropsClassname}`}
  //     {...{
  //       [tickLineAxis]: tickSign * ((hideTicks ? 0 : tickLength) + tickLabelPadding)
  //       // [tickCrossAxis]: y
  //     }}
  //     dy={y}
  //     // dy="0.35rem"

  //     transform={
  //       isVerticalAxis
  //         ? `rotate(${angle}, ${tickSign * ((hideTicks ? 0 : tickLength) + tickLabelPadding)}, 0)`
  //         : `rotate(${angle}, 0, ${tickSign * ((hideTicks ? 0 : tickLength) + tickLabelPadding)})`
  //     }
  //   >
  //     {label}
  //   </text>
  // );

  return (
    <Text
      data-testid="axis-label"
      role="presentation"
      aria-hidden
      textAnchor={textAnchor}
      verticalAnchor={verticalAnchor}
      angle={angle}
      fill={labelStyles?.fill ?? 'currentColor'}
      style={style}
      className={`${labelStyles?.className ?? ''} ${labelPropsClassname}`}
      {...{ [tickLineAxis]: tickSign * ((hideTicks ? 0 : tickLength) + tickLabelPadding) }}
      // {...restTickLabelProps}
      dx={delta.dx}
      dy={delta.dy}
    >
      {label}
    </Text>
  );
}
