import { AxisScaleOutput, Orientation, TextProps } from './types';

export interface GetLabelTransformArgs {
  labelPadding: number;
  labelProps: Partial<TextProps>;
  orientation: Orientation;
  range: AxisScaleOutput[];
  maxTickLabelFontSize: number;
  tickLength: number;
}

export function getLabelTransform({
  labelPadding,
  labelProps,
  orientation,
  range,
  maxTickLabelFontSize,
  tickLength
}: GetLabelTransformArgs) {
  const sign = orientation === 'left' || orientation === 'top' ? -1 : 1;
  let x;
  let y;
  let transform;

  if (orientation === 'top' || orientation === 'bottom') {
    const yBottomOffset =
      orientation === 'bottom' && typeof labelProps.fontSize === 'number' ? labelProps.fontSize : 0;

    x = (Number(range[0]) + Number(range[range.length - 1])) / 2;
    y = sign * (tickLength + labelPadding + maxTickLabelFontSize + yBottomOffset);
  } else {
    x = sign * ((Number(range[0]) + Number(range[range.length - 1])) / 2);
    y = -(tickLength + labelPadding);
    transform = `rotate(${sign * 90})`;
  }

  return { x, y, transform };
}
