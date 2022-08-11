import { useRef, useState } from 'react';
import { animated, Spring, SpringConfig } from 'react-spring';
import { isNil } from 'lodash-es';

import { createLinePositioning } from './createLinePositioning';
import type { AxisScale, PathProps, SVGAnimatedPathProps } from './types';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

// Dash array animation from https://github.com/flashblaze/flashblaze-website/blob/39c459c7664590d80eac7329b596a1cfee1beb9a/src/posts/2020-06-15-svg-animations-using-react-spring.mdx

interface AnimatedWipePathProps {
  dataKey: string;
  d: string;
  animate: boolean;
  springConfig: SpringConfig;
  pathProps?: PathProps | ((dataKey: string) => PathProps);
  color: string;
}

function AnimatedWipePath({ dataKey, d, animate, springConfig, pathProps, color }: AnimatedWipePathProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [offset, setOffset] = useState<number | null>(null);
  useIsomorphicLayoutEffect(() => {
    setOffset(pathRef.current?.getTotalLength() ?? 0);
  }, [offset]);
  const resolvedPathProps = (typeof pathProps === 'function' ? pathProps(dataKey) : pathProps) ?? {};
  if (isNil(offset)) {
    return <path ref={pathRef} strokeWidth="2" d={d} stroke="none" fill="none" {...resolvedPathProps} />;
  }
  return (
    <Spring from={{ x: offset }} to={{ x: 0 }} config={springConfig} immediate={!animate}>
      {(transitions) => (
        <animated.path
          ref={pathRef}
          d={d}
          strokeDashoffset={transitions.x}
          strokeDasharray={`${offset} ${offset}`}
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round" // Without this a datum surrounded by nulls will not be visible.
          fill="none"
          role="presentation"
          aria-hidden
          {...resolvedPathProps}
        />
      )}
    </Spring>
  );
}

export function SVGWipedPath<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>({
  dataEntry,
  scales,
  horizontal,
  renderingOffset,
  springConfig,
  animate,
  color,
  curve,
  pathProps
}: //   onBlur,
//   onFocus,
//   onPointerMove,
//   onPointerOut,
//   onPointerUp,
SVGAnimatedPathProps<IndependentScale, DependentScale, Datum>) {
  const position = createLinePositioning({
    dataEntry,
    scales,
    horizontal,
    curve,
    renderingOffset
  });
  const pathD = dataEntry.createShape(position) || '';

  // TODO Try to reinstate this:

  // const pathRef = useRef<SVGPathElement>(null);
  // const [offset, setOffset] = useState<number | null>(null);
  // useIsomorphicLayoutEffect(() => {
  //   setOffset(pathRef.current?.getTotalLength() ?? 0);
  // }, [offset]);
  // const resolvedPathProps =
  //   (typeof pathProps === 'function' ? pathProps(dataEntry.dataKey) : pathProps) ?? {};
  // if (isNil(offset)) {
  //   return <path ref={pathRef} strokeWidth="2" d={pathD} stroke="none" fill="none" {...resolvedPathProps} />;
  // }
  // return (
  //   <Spring from={{ x: offset }} to={{ x: 0 }} config={springConfig} immediate={!animate}>
  //     {(transitions) => (
  //       <animated.path
  //         ref={pathRef}
  //         d={pathD}
  //         strokeDashoffset={transitions.x}
  //         strokeDasharray={`${offset} ${offset}`}
  //         strokeWidth={2}
  //         strokeLinecap="round" // Without this a datum surrounded by nulls will not be visible.
  //         stroke={color}
  //         fill="none"
  //         role="presentation"
  //         aria-hidden
  //         {...resolvedPathProps}
  //       />
  //     )}
  //   </Spring>
  // );

  return (
    <AnimatedWipePath
      key={pathD}
      color={color}
      dataKey={dataEntry.dataKey}
      d={pathD ?? ''}
      animate={animate}
      springConfig={springConfig}
      pathProps={pathProps}
      // {...eventEmitters}
    />
  );
}
