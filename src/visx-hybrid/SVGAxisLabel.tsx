import { defaultLabelTextProps } from './constants';
import { measureTextWithCache } from './measureTextWithCache';
import type { AxisOrientation, AxisScale, FontProperties, LabelAngle, SVGTextProps } from './types';

export interface SVGAxisLabelProps {
  label: string;
  orientation: AxisOrientation;
  font?: string | FontProperties;
  fill?: string;
  className?: string;
  /** Props to apply to the axis label. */
  labelProps?: Partial<SVGTextProps>; // Partial<TextProps>;
  scale: AxisScale;
  rangePadding: number;
  width: number;
  height: number;
  labelAngle: LabelAngle;
}

export function SVGAxisLabel({
  label,
  labelProps = {},
  orientation,
  font = defaultLabelTextProps,
  scale,
  rangePadding,
  width,
  height,
  fill = 'currentColor',
  className = '',
  labelAngle
}: SVGAxisLabelProps) {
  // Calculate the dimensions of the axis label (if there is one):
  const labelMeasurements = measureTextWithCache(label, font);
  const { style: labelPropsStyle, className: labelPropsClassname = '', ...restLabelProps } = labelProps;
  const style = typeof font === 'string' ? { font, ...labelPropsStyle } : labelPropsStyle;
  const isVertical = orientation === 'left' || orientation === 'right';
  const rangeFrom = Number(scale.range()[0]) ?? 0;
  const rangeTo = Number(scale.range()[1]) ?? 0;
  const domainRange = isVertical
    ? [rangeFrom + rangePadding, rangeTo - rangePadding]
    : [rangeFrom - rangePadding, rangeTo + rangePadding];

  let x = 0;
  let y = 0;
  let transform: string | undefined = undefined;
  let textAnchor = 'middle';

  if (orientation === 'top') {
    if (labelAngle === 'horizontal') {
      x = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
      y = labelMeasurements.heightFromBaseline;
    } else {
      // Vertical.
      x = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
      y = 0;
      textAnchor = 'end';
      transform = `rotate(${-90}, ${
        (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5
      }, ${0})`;
    }
  } else if (orientation === 'bottom') {
    if (labelAngle === 'horizontal') {
      x = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
      y = height - (labelMeasurements.height - labelMeasurements.heightFromBaseline);
    } else {
      // Vertical.
      x = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
      y = height;
      textAnchor = 'start';
      transform = `rotate(${-90}, ${
        (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5
      }, ${height})`;
    }
  } else if (orientation === 'left') {
    if (labelAngle === 'vertical') {
      x = labelMeasurements.heightFromBaseline;
      y = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
      transform = `rotate(${-90}, ${labelMeasurements.heightFromBaseline}, ${
        (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5
      })`;
    } else {
      x = 0;
      y =
        (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5 -
        labelMeasurements.height * 0.5 +
        labelMeasurements.heightFromBaseline;
      textAnchor = 'start';
    }
  } else {
    // Right.
    if (labelAngle === 'vertical') {
      x = width - labelMeasurements.heightFromBaseline;
      y = (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5;
      transform = `rotate(${90}, ${width - labelMeasurements.heightFromBaseline}, ${
        (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5
      })`;
    } else {
      x = width;
      y =
        (Number(domainRange[0]) + Number(domainRange[domainRange.length - 1])) * 0.5 -
        labelMeasurements.height * 0.5 +
        labelMeasurements.heightFromBaseline;
      textAnchor = 'end';
    }
  }

  return (
    <text
      data-testid={`axis-label-${orientation}`}
      role="presentation"
      aria-hidden
      textAnchor={textAnchor}
      style={style}
      x={x}
      y={y}
      transform={transform}
      fill={fill}
      className={`${className} ${labelPropsClassname}`}
      {...restLabelProps}
    >
      {label}
    </text>
  );
}
