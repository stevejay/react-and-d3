import type { SVGProps } from 'react';
import { animated } from 'react-spring';
import { CurveFactory, CurveFactoryLineOnly, curveLinear } from 'd3-shape';

import { createLineSeriesPathShape } from './createLineSeriesPathShape';
import type { RenderPathProps } from './types';
import { useSVGPathLength } from './useSVGPathLength';
import { useSwipedPathTransitions } from './useSwipedPathTransitions';

// Dash array animation from https://github.com/flashblaze/flashblaze-website/blob/39c459c7664590d80eac7329b596a1cfee1beb9a/src/posts/2020-06-15-svg-animations-using-react-spring.mdx

export type SVGSwipedPathProps<Datum extends object> = RenderPathProps<Datum> & {
  curve?: CurveFactory | CurveFactoryLineOnly;
} & Omit<Omit<SVGProps<SVGPathElement>, 'ref'>, keyof RenderPathProps<Datum>>;

export function SVGSwipedPath<Datum extends object>({
  dataEntry,
  scales,
  horizontal,
  renderingOffset,
  springConfig,
  animate,
  color,
  curve = curveLinear,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  theme,
  ...rest
}: SVGSwipedPathProps<Datum>) {
  const [offset, pathRef] = useSVGPathLength();
  const pathShape = createLineSeriesPathShape({
    dataEntry,
    scales,
    horizontal,
    curve,
    renderingOffset
  });
  const transitions = useSwipedPathTransitions({ offset, pathShape, springConfig, animate, renderingOffset });
  return (
    <animated.path
      ref={pathRef}
      d={pathShape}
      stroke={color}
      strokeDashoffset={transitions.offset}
      strokeDasharray={`${offset} ${offset}`}
      // strokeDasharray={dataEntry.getOriginalData().length > 1 ? `${offset} ${offset}` : undefined}
      strokeWidth={2}
      strokeLinecap="round" // Without this a datum surrounded by nulls will not be visible.
      fill="none"
      role="presentation"
      aria-hidden
      {...rest}
    />
  );
}
