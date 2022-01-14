import { memo, ReactElement, Ref, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { zoomIdentity, ZoomTransform } from 'd3-zoom';

import { SvgAxis } from '@/components/SvgAxis';
import { SvgChartAreaGroup } from '@/components/SvgChartAreaGroup';
import { SvgChartRoot } from '@/components/SvgChartRoot';
import { SvgPoints } from '@/components/SvgPoints';
import { SvgZoomInteraction } from '@/components/SvgZoomInteraction';
import { useChartArea } from '@/hooks/useChartArea';
import { useContinuousDomain } from '@/hooks/useContinuousDomain';
import { useLinearScaleWithZoom } from '@/hooks/useLinearScaleWithZoom';
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
  const [transform, setTransform] = useState(zoomIdentity);

  const transformRef = useRef(transform);
  useLayoutEffect(() => {
    transformRef.current = transform;
  });

  const getCurrentTransform = useCallback(() => transformRef.current, []);

  const chartArea = useChartArea(width, height, margins, 0);
  const xDomain = useContinuousDomain(data, (d) => d.x);
  const xScale = useLinearScaleWithZoom(xDomain, chartArea.rangeWidth, 'x', transform);
  const yDomain = useContinuousDomain(data, (d) => d.y);
  const yScale = useLinearScaleWithZoom(yDomain, chartArea.rangeHeight, 'y', transform);

  const onDrag = useCallback((x: number, y: number) => {
    setTransform((prev) => new ZoomTransform(prev.k, x, y));
  }, []);

  const onPinch = useCallback((transform: ZoomTransform) => {
    setTransform(transform);
  }, []);

  // Reset the zoom transform on new data.
  useEffect(() => {
    const transform = new ZoomTransform(1, 0, 0);
    setTransform(transform);
    transformRef.current = transform;
  }, [data]);

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
      className="font-sans select-none bg-slate-800 touch-none"
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
      <SvgZoomInteraction
        chartArea={chartArea}
        getCurrentTransform={getCurrentTransform}
        onDrag={onDrag}
        onPinch={onPinch}
      />
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
