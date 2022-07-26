import { ReactNode, SVGProps } from 'react';
import { SpringConfig } from 'react-spring';
import { Group } from '@visx/group';

// import { isNil } from 'lodash-es';
import { AxisScale, LineProps, Orientation, ScaleInput, TextProps, TickFormatter } from '@/visx-next/types';

import { useDataContext } from './useDataContext';

export type AxisRendererProps = {
  orientation: Orientation;
  scale: AxisScale;
  rangePadding: number;
  springConfig?: SpringConfig;
  animate?: boolean;
  renderingOffset?: number;
  hideZero?: boolean;
  tickFormat?: TickFormatter<ScaleInput<AxisScale>>;
  tickCount?: number;
  tickValues?: ScaleInput<AxisScale>[];
  /**  If true, will hide the axis line. */
  hideAxisLine?: boolean;
  /** If true, will hide the ticks (but not the tick labels). */
  hideTicks?: boolean;
  /** Props to apply to the <g> element that wraps each tick line and label. */
  tickGroupProps?: Omit<SVGProps<SVGGElement>, 'ref' | 'style'>; // TODO think about removing style.
  /** Padding between the tick lines and the tick labels. */
  tickLabelPadding?: number;
  /** The props to apply to the tick labels. */
  tickLabelProps?: Partial<TextProps>;
  /** The length of the tick lines. */
  tickLength?: number;
  /** The length of the outer ticks (added at the very start and very end of the axis domain). */
  outerTickLength?: number;
  /** Props to be applied to individual tick lines. */
  tickLineProps?: LineProps;
  /** The text for the axis label. */
  label?: string;
  /** Pixel offset of the axis label. */
  labelOffset?: number;
  /** Props to apply to the axis label. */
  labelProps?: Partial<TextProps>;
  /** Props to apply to the axis domain path. */
  domainPathProps?: Omit<SVGProps<SVGPathElement>, 'ref'>;
};

export type AxisRenderer = (props: AxisRendererProps) => ReactNode;

export type SVGAxisProps = Omit<
  AxisRendererProps,
  'ticks' | 'scale' | 'margin' | 'rangePadding' | 'orientation'
> & {
  groupProps?: SVGProps<SVGGElement>;
  position: 'start' | 'end';
  variableType: 'independent' | 'dependent';
  renderer: AxisRenderer;
};

export function SVGAxis(props: SVGAxisProps) {
  const {
    variableType,
    position,
    groupProps,
    springConfig,
    animate = true,
    renderer,
    tickLabelProps,
    ...restProps
  } = props;

  const {
    independentScale,
    dependentScale,
    independentRangePadding,
    dependentRangePadding,
    horizontal,
    margin,
    width,
    height,
    springConfig: contextSpringConfig,
    animate: contextAnimate
  } = useDataContext();

  // if (isNil(independentScale || isNil(dependentScale))) {
  //   return null;
  // }

  const scale = variableType === 'independent' ? independentScale : dependentScale;
  if (!scale) {
    return null;
  }

  const orientation: Orientation =
    horizontal && variableType === 'independent'
      ? position === 'start'
        ? 'left'
        : 'right'
      : horizontal && variableType === 'dependent'
      ? position === 'start'
        ? 'bottom'
        : 'top'
      : !horizontal && variableType == 'independent'
      ? position === 'start'
        ? 'bottom'
        : 'top'
      : position === 'start'
      ? 'left'
      : 'right'; // !horizontal && variableType === 'dependent'

  const top =
    orientation === 'bottom'
      ? (height ?? 0) - (margin?.bottom ?? 0)
      : orientation === 'top'
      ? margin?.top ?? 0
      : 0;

  const left =
    orientation === 'left'
      ? margin?.left ?? 0
      : orientation === 'right'
      ? (width ?? 0) - (margin?.right ?? 0)
      : 0;

  const rangePadding = variableType === 'independent' ? independentRangePadding : dependentRangePadding;

  const defaultTextAnchor = orientation === 'left' ? 'end' : orientation === 'right' ? 'start' : 'middle';
  const defaultVerticalAnchor = orientation === 'top' ? 'end' : orientation === 'bottom' ? 'start' : 'middle';

  return (
    <Group data-test-id={`axis-${orientation}`} {...groupProps} top={top} left={left}>
      {renderer({
        ...restProps,
        tickLabelProps: {
          textAnchor: defaultTextAnchor,
          verticalAnchor: defaultVerticalAnchor,
          ...tickLabelProps
        },
        orientation,
        scale,
        springConfig: springConfig ?? contextSpringConfig,
        animate: animate ?? contextAnimate,
        rangePadding
      })}
    </Group>
  );
}
