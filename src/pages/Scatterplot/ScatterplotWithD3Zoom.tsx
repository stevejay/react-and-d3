import { memo, ReactElement, Ref } from 'react';
import type { SpringConfig } from 'react-spring';

import { SvgAxis } from '@/components/SvgAxis';
import { SvgChartAreaGroup } from '@/components/SvgChartAreaGroup';
import { SvgChartAreaInteractionRect } from '@/components/SvgChartAreaInteractionRect';
import { SvgChartRoot } from '@/components/SvgChartRoot';
import { SvgPoints } from '@/components/SvgPoints';
import { useChartArea } from '@/hooks/useChartArea';
import { useContinuousDomain } from '@/hooks/useContinuousDomain';
import { useD3Zoom } from '@/hooks/useD3Zoom';
import { useLinearScaleWithZoom } from '@/hooks/useLinearScaleWithZoom';
import { Margin, PointDatum } from '@/types';

export interface ScatterplotWithD3ZoomProps<DatumT> {
  data: PointDatum<DatumT>[];
  width: number;
  height: number;
  margins: Margin;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRoleDescription?: string;
  description?: string;
  ariaDescribedby?: string;
  datumAriaRoleDescription?: (datum: PointDatum<DatumT>) => string;
  datumAriaLabel?: (datum: PointDatum<DatumT>) => string;
  datumDescription?: (datum: PointDatum<DatumT>) => string;
  pointsGroupClassName?: string;
  pointRadius: ((datum: PointDatum<DatumT>) => number) | number;
  pointClassName: ((datum: PointDatum<DatumT>) => string) | string;
  svgRef?: Ref<SVGSVGElement>;
  compact: boolean;
  springConfig: SpringConfig;
}

function ScatterplotWithD3ZoomCore<DatumT>({
  data,
  width,
  height,
  margins,
  ariaLabel,
  ariaLabelledby,
  ariaRoleDescription,
  description,
  ariaDescribedby,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription,
  pointsGroupClassName = '',
  pointRadius,
  pointClassName,
  svgRef,
  springConfig,
  compact
}: ScatterplotWithD3ZoomProps<DatumT>): ReactElement | null {
  const chartArea = useChartArea(width, height, margins, 0);
  const [interactiveRef, transform] = useD3Zoom<SVGRectElement>(
    [
      [0, 0],
      [chartArea.width, chartArea.height]
    ],
    {
      scaleExtent: [0.5, 5],
      translateExtent: [
        [chartArea.width * -0.5, chartArea.height * -0.5],
        [chartArea.width * 1.5, chartArea.height * 1.5]
      ]
    }
  );
  const xDomain = useContinuousDomain(data, (datum) => datum.x);
  const xScale = useLinearScaleWithZoom(xDomain, chartArea.rangeWidth, 'x', transform);
  const yDomain = useContinuousDomain(data, (datum) => datum.y);
  const yScale = useLinearScaleWithZoom(yDomain, chartArea.rangeHeight, 'y', transform);

  return (
    <SvgChartRoot
      ref={svgRef}
      width={width}
      height={height}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      ariaRoleDescription={ariaRoleDescription}
      description={description}
      ariaDescribedby={ariaDescribedby}
      className="font-sans bg-slate-800 touch-none"
    >
      <SvgAxis
        scale={xScale}
        chartArea={chartArea}
        orientation="bottom"
        tickSizeOuter={0}
        tickSizeInner={10}
        tickPadding={10}
        tickArguments={[compact ? 5 : 10]}
        className="text-xs"
        domainClassName="text-slate-400"
        tickLineClassName="text-slate-400"
        tickTextClassName="text-slate-200"
        animate={false}
        springConfig={springConfig}
      />
      <SvgAxis
        scale={yScale}
        chartArea={chartArea}
        orientation="left"
        tickSizeOuter={0}
        tickSizeInner={10}
        tickPadding={10}
        tickArguments={[compact ? 5 : 10]}
        className="text-xs"
        domainClassName="text-slate-400"
        tickLineClassName="text-slate-400"
        tickTextClassName="text-slate-200"
        animate={false}
        springConfig={springConfig}
      />
      <SvgChartAreaGroup chartArea={chartArea} clipChartArea>
        <SvgPoints
          data={data}
          xScale={xScale}
          yScale={yScale}
          datumAriaRoleDescription={datumAriaRoleDescription}
          datumAriaLabel={datumAriaLabel}
          datumDescription={datumDescription}
          pointsGroupClassName={pointsGroupClassName}
          pointRadius={pointRadius}
          pointClassName={pointClassName}
          animate={false}
          springConfig={springConfig}
        />
      </SvgChartAreaGroup>
      <SvgChartAreaInteractionRect ref={interactiveRef} chartArea={chartArea} />
    </SvgChartRoot>
  );
}

export const ScatterplotWithD3Zoom = memo(
  ScatterplotWithD3ZoomCore,
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.margins === nextProps.margins
) as typeof ScatterplotWithD3ZoomCore;
