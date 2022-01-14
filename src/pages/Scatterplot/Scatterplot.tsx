import { memo, ReactElement, Ref } from 'react';

import { SvgAxis } from '@/components/SvgAxis';
import { SvgChartAreaGroup } from '@/components/SvgChartAreaGroup';
import { SvgChartAreaInteractionRect } from '@/components/SvgChartAreaInteractionRect';
import { SvgChartRoot } from '@/components/SvgChartRoot';
import { SvgPoints } from '@/components/SvgPoints';
import { useChartArea } from '@/hooks/useChartArea';
import { useContinuousDomain } from '@/hooks/useContinuousDomain';
import { useLinearScaleWithZoom } from '@/hooks/useLinearScaleWithZoom';
import { useZoom } from '@/hooks/useZoom';
import type { Margins, PointDatum } from '@/types';

export type ScatterplotProps = {
  data: PointDatum[];
  width: number;
  height: number;
  margins: Margins;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRoleDescription?: string;
  description?: string;
  ariaDescribedby?: string;
  datumAriaRoleDescription?: (datum: PointDatum) => string;
  datumAriaLabel?: (datum: PointDatum) => string;
  datumDescription?: (datum: PointDatum) => string;
  svgRef?: Ref<SVGSVGElement>;
  transitionSeconds?: number;
  compact: boolean;
};

function ScatterplotCore({
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
  svgRef,
  transitionSeconds = 0.5,
  compact
}: ScatterplotProps): ReactElement | null {
  const [interactiveRef, transform] = useZoom<SVGRectElement>();
  const chartArea = useChartArea(width, height, margins, 0);
  const xDomain = useContinuousDomain(data, (d) => d.x);
  const xScale = useLinearScaleWithZoom(xDomain, chartArea.rangeWidth, 'x', transform);
  const yDomain = useContinuousDomain(data, (d) => d.y);
  const yScale = useLinearScaleWithZoom(yDomain, chartArea.rangeHeight, 'y', transform);

  return (
    <SvgChartRoot
      ref={svgRef}
      width={width}
      height={height}
      transitionSeconds={transitionSeconds}
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
      />
      <SvgChartAreaGroup chartArea={chartArea} clipChartArea>
        <SvgPoints
          data={data}
          xScale={xScale}
          yScale={yScale}
          className="text-sky-500"
          datumAriaRoleDescription={datumAriaRoleDescription}
          datumAriaLabel={datumAriaLabel}
          datumDescription={datumDescription}
          animate={false}
        />
      </SvgChartAreaGroup>
      <SvgChartAreaInteractionRect ref={interactiveRef} chartArea={chartArea} />
    </SvgChartRoot>
  );
}

export const Scatterplot = memo(
  ScatterplotCore,
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.margins === nextProps.margins
) as typeof ScatterplotCore;
