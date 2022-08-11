import { animated } from 'react-spring';

import { defaultShapeRendering } from './constants';
import { createLinePositioning } from './createLinePositioning';
import type { AxisScale, SVGAnimatedPathProps } from './types';
import { useLineInterpolationTransitions } from './useLineInterpolationTransitions';

/** Cannot be used if the data to interpolate contains missing values (e.g., `null` or `undefined` values). */
export function SVGInterpolatedPath<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>({
  dataEntry,
  scales,
  horizontal,
  renderingOffset,
  animate,
  springConfig,
  curve,
  color,
  pathProps
}: //   onBlur,
//   onFocus,
//   onPointerMove,
//   onPointerOut,
//   onPointerUp,
SVGAnimatedPathProps<IndependentScale, DependentScale, Datum>) {
  const position = createLinePositioning({ scales, horizontal, curve, dataEntry, renderingOffset });
  const pathD = dataEntry.createShape(position) || '';
  const transitions = useLineInterpolationTransitions({ pathD, springConfig, animate, renderingOffset });
  const {
    style: lineStyle,
    stroke,
    ...restLineProps
  } = (typeof pathProps === 'function' ? pathProps(dataEntry.dataKey) : pathProps) ?? {};
  return (
    <animated.path
      data-testid="path"
      d={transitions}
      style={lineStyle}
      shapeRendering={defaultShapeRendering}
      stroke={stroke ?? color}
      strokeWidth={2}
      strokeLinecap="round" // Without this a datum surrounded by nulls will not be visible
      fill="none"
      role="presentation"
      aria-hidden
      {...restLineProps}
      // {...eventEmitters}
    />
  );
  // return <SVGPath d={transition} color={color} dataKey={dataEntry.dataKey} />;
}
