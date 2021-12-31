import { FC, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

import type { AxisLabelOrientation } from '@/types';

import { yearMonthMultiFormat } from './formatters';

class D3TimeAxisChartRenderer {
  width = 0;
  height = 0;
  transitionSeconds = 0.25;
  labelOrientation: AxisLabelOrientation = 'horizontal';

  private scale = d3.scaleTime();
  private axis = d3.axisBottom<Date>(this.scale);
  private margins = { top: 20, bottom: 48, left: 48, right: 32 };

  render(svgElement: SVGSVGElement | null, data: Date[]): void {
    if (!svgElement) {
      return;
    }

    const svg = d3.select(svgElement);
    svg.attr('width', this.width);
    svg.attr('height', this.height);

    if (this.width === 0 || this.height === 0) {
      return;
    }

    const chartWidth = this.width - this.margins.left - this.margins.right;
    const chartHeight = this.height - this.margins.top - this.margins.bottom;

    const domain = [d3.min(data) ?? 0, d3.max(data) ?? 0];
    this.scale.domain(domain).range([0, chartWidth]).nice();

    this.axis
      .tickArguments([10])
      .tickSizeInner(6)
      .tickSizeOuter(-chartHeight)
      .tickFormat(yearMonthMultiFormat);

    let group = svg.selectAll<SVGGElement, null>('.axis').data([null]);
    group = group.enter().append('g').classed('axis', true).merge(group);
    group
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top + chartHeight})`)
      .style('font-family', 'inherit')
      .transition()
      .duration(this.transitionSeconds * 1000)
      .call(this.axis)
      .selectAll('text')
      .attr('transform', 'translate(-10,0) rotate(-45)')
      .style('text-anchor', 'end');
  }
}

export type D3TimeAxisChartProps = {
  data: Date[];
  width: number;
  height: number;
  ariaLabelledby: string;
  transitionSeconds?: number;
  labelOrientation: AxisLabelOrientation;
};

export const D3TimeAxisChart: FC<D3TimeAxisChartProps> = ({
  data,
  width,
  height,
  ariaLabelledby,
  labelOrientation,
  transitionSeconds = 0.25
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [renderer] = useState<D3TimeAxisChartRenderer>(() => new D3TimeAxisChartRenderer());

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
      style={{ shapeRendering: 'optimizeSpeed' }}
      aria-labelledby={ariaLabelledby}
    />
  );
};
