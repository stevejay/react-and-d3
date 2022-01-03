import { FC, useEffect, useRef, useState } from 'react';
import { axisBottom, scaleBand, select } from 'd3';

import type { AxisLabelOrientation } from '@/types';

class D3BandAxisChartRenderer {
  width = 0;
  height = 0;
  transitionSeconds = 0.25;
  labelOrientation: AxisLabelOrientation = 'horizontal';

  private scale = scaleBand();
  private axis = axisBottom(this.scale);
  private margins = { top: 20, bottom: 34, left: 30, right: 30 };

  render(svgElement: SVGSVGElement | null, data: string[]): void {
    if (!svgElement) {
      return;
    }

    const svg = select(svgElement);
    svg.attr('width', this.width);
    svg.attr('height', this.height);

    if (this.width === 0 || this.height === 0) {
      return;
    }

    const chartWidth = this.width - this.margins.left - this.margins.right;
    const chartHeight = this.height - this.margins.top - this.margins.bottom;

    this.scale.domain(data).rangeRound([0, chartWidth]);

    this.axis.tickArguments([10]).tickSizeInner(6).tickSizeOuter(-chartHeight);

    let group = svg.selectAll<SVGGElement, null>('.axis').data([null]);
    group = group.enter().append('g').classed('axis', true).merge(group);
    group
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top + chartHeight})`)
      .style('font-family', 'inherit')
      .transition()
      .duration(this.transitionSeconds * 1000)
      .call(this.axis);
  }
}

export type D3BandAxisChartProps = {
  data: string[];
  width: number;
  height: number;
  ariaLabelledby: string;
  transitionSeconds?: number;
  labelOrientation: AxisLabelOrientation;
};

export const D3BandAxisChart: FC<D3BandAxisChartProps> = ({
  data,
  width,
  height,
  ariaLabelledby,
  labelOrientation,
  transitionSeconds = 0.25
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [renderer] = useState<D3BandAxisChartRenderer>(() => new D3BandAxisChartRenderer());

  useEffect(() => {
    renderer.width = width;
    renderer.height = height;
    renderer.transitionSeconds = transitionSeconds;
    renderer.labelOrientation = labelOrientation;
    renderer.render(svgRef.current, data);
  }, [renderer, data, width, height, transitionSeconds, labelOrientation]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className="font-sans bg-slate-800"
      aria-labelledby={ariaLabelledby}
    />
  );
};
