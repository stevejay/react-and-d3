import type { FC, SVGProps } from 'react';
import { useId } from '@uifabric/react-hooks';

import type { ChartArea } from '@/types';

type SvgChartAreaGroupProps = Omit<SVGProps<SVGGElement>, 'clipPath' | 'transform'> & {
  /**
   * Defines the chart area. This data will be used to translate the chart area group
   * by (chartArea.translateLeft, chartArea.translateTop) from the SVG origin.
   */
  chartArea: ChartArea;
  /** If `true` then a clip path will be added which is sized to the chart area. */
  clipChartArea?: boolean;
};

/**
 * For wrapping a chart area in a <g> (group) element. Any extra props get added to
 * that element, excluding `clipPath` and `transform`.
 */
export const SvgChartAreaGroup: FC<SvgChartAreaGroupProps> = ({
  chartArea,
  clipChartArea = true,
  children,
  ...rest
}) => {
  const id = useId();
  return (
    <>
      {clipChartArea && (
        <defs>
          <clipPath data-test-id="chart-area-clip-path" id={id}>
            <rect role="presentation" x={0} y={0} width={chartArea.width} height={chartArea.height} />
          </clipPath>
        </defs>
      )}
      <g
        data-test-id="chart-area"
        {...rest}
        clipPath={clipChartArea ? `url(#${id})` : undefined}
        transform={`translate(${chartArea.translateLeft}, ${chartArea.translateTop})`}
      >
        {children}
      </g>
    </>
  );
};
