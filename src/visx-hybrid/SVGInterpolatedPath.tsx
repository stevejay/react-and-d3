import type { SVGProps } from 'react';
import { animated } from 'react-spring';
import { CurveFactory, CurveFactoryLineOnly, curveLinear } from 'd3-shape';

import { createLineSeriesPathShape } from './createLineSeriesPathShape';
import type { RenderPathProps } from './types';
import { useInterpolatedPathTransitions } from './useInterpolatedPathTransitions';

export type SVGInterpolatedPathProps<Datum extends object> = RenderPathProps<Datum> & {
  curve?: CurveFactory | CurveFactoryLineOnly;
} & Omit<Omit<SVGProps<SVGPathElement>, 'ref'>, keyof RenderPathProps<Datum>>;

/** Cannot be used if the data to interpolate contains missing values (e.g., `null` or `undefined` values). */
export function SVGInterpolatedPath<Datum extends object>({
  dataEntry,
  scales,
  horizontal,
  renderingOffset,
  animate,
  springConfig,
  curve = curveLinear,
  color,
  ...rest
}: SVGInterpolatedPathProps<Datum>) {
  const pathShape = createLineSeriesPathShape({ scales, horizontal, curve, dataEntry, renderingOffset });
  const transitions = useInterpolatedPathTransitions({ pathShape, springConfig, animate, renderingOffset });
  return (
    <animated.path
      data-testid="path"
      d={transitions}
      // shapeRendering={defaultShapeRendering}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round" // Without this a datum surrounded by nulls will not be visible
      fill="none"
      role="presentation"
      aria-hidden
      {...rest}
    />
  );
}
