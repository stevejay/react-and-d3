import { Margin } from '@/types';
import { AxisScaleOutput, Orientation, TextProps } from '@/visx-next/types';

export interface GetLabelTransformArgs {
  labelOffset: number;
  labelProps: Partial<TextProps>;
  orientation: Orientation;
  range: AxisScaleOutput[];
  maxTickLabelFontSize: number;
  tickLength: number;
  tickLabelPadding: number;
  margin: Margin;
}

export function getLabelTransform({
  labelOffset,
  labelProps,
  orientation,
  range,
  maxTickLabelFontSize,
  tickLength,
  tickLabelPadding,
  margin
}: GetLabelTransformArgs) {
  const sign = orientation === 'left' || orientation === 'top' ? -1 : 1;
  let x;
  let y;
  let transform;
  const fontSize = typeof labelProps.fontSize === 'number' ? labelProps.fontSize : 0;

  if (orientation === 'top' || orientation === 'bottom') {
    const yBottomOffset = 0;
    // orientation === 'bottom' && typeof labelProps.fontSize === 'number' ? labelProps.fontSize : 0;

    x = (Number(range[0]) + Number(range[range.length - 1])) / 2;
    y = sign * (tickLength + tickLabelPadding + maxTickLabelFontSize + labelOffset + yBottomOffset);
  } else {
    const width = orientation === 'left' ? margin.left : margin.right;
    x = sign * ((Number(range[0]) + Number(range[range.length - 1])) / 2);
    y = -(width - fontSize); // -(tickLength + labelOffset);
    transform = `rotate(${sign * 90})`;
  }

  return { x, y, transform };
}
