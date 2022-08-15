import type { SVGProps } from 'react';
import { animated } from 'react-spring';
import { CurveFactory, curveLinear } from 'd3-shape';

import { defaultShapeRendering } from './constants';
import { createAreaSeriesPathShape } from './createAreaSeriesPathShape';
import type { RenderPathProps } from './types';
import { useInterpolatedPathTransitions } from './useInterpolatedPathTransitions';

export type SVGInterpolatedAreaProps<Datum extends object> = RenderPathProps<Datum> & {
  curve?: CurveFactory;
} & Omit<Omit<SVGProps<SVGPathElement>, 'ref'>, keyof RenderPathProps<Datum>>;

/** Cannot be used if the data to interpolate contains missing values (e.g., `null` or `undefined` values). */
export function SVGInterpolatedArea<Datum extends object>({
  dataEntry,
  scales,
  horizontal,
  renderingOffset,
  animate,
  springConfig,
  curve = curveLinear,
  color,
  // stroke,
  ...rest
}: //   onBlur,
//   onFocus,
//   onPointerMove,
//   onPointerOut,
//   onPointerUp,
SVGInterpolatedAreaProps<Datum>) {
  const pathShape = createAreaSeriesPathShape({ scales, horizontal, curve, dataEntry, renderingOffset });
  const transitions = useInterpolatedPathTransitions({ pathShape, springConfig, animate, renderingOffset });
  return (
    <animated.path
      data-testid="area"
      d={transitions}
      shapeRendering={defaultShapeRendering}
      stroke="none"
      // strokeWidth={2}
      // strokeLinecap="round" // Without this a datum surrounded by nulls will not be visible
      fill={color}
      role="presentation"
      aria-hidden
      {...rest}
      // {...eventEmitters}
    />
  );
}
