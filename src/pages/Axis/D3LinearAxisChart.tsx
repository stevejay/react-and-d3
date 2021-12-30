import { FC, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

import type { AxisLabelOrientation } from '@/types';

class D3LinearAxisChartRenderer {
  width = 0;
  height = 0;
  drawTicksAsGridLines = false;
  transitionSeconds = 0.25;
  labelOrientation: AxisLabelOrientation = 'horizontal';

  private scale = d3.scaleLinear();
  private axis = d3.axisBottom(this.scale);
  private margins = { top: 20, bottom: 34, left: 30, right: 30 };

  render(svgElement: SVGSVGElement | null, data: number[]): void {
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
      .tickSizeInner(this.drawTicksAsGridLines ? -chartHeight : 6)
      .tickSizeOuter(-chartHeight);

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

export type D3LinearAxisChartProps = {
  data: number[];
  width: number;
  height: number;
  ariaLabelledby: string;
  drawTicksAsGridLines: boolean;
  transitionSeconds: number;
  labelOrientation: AxisLabelOrientation;
};

export const D3LinearAxisChart: FC<D3LinearAxisChartProps> = ({
  data,
  width,
  height,
  ariaLabelledby,
  drawTicksAsGridLines,
  transitionSeconds,
  labelOrientation
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [renderer] = useState<D3LinearAxisChartRenderer>(() => new D3LinearAxisChartRenderer());

  useEffect(() => {
    renderer.width = width;
    renderer.height = height;
    renderer.drawTicksAsGridLines = drawTicksAsGridLines;
    renderer.transitionSeconds = transitionSeconds;
    renderer.labelOrientation = labelOrientation;
    renderer.render(svgRef.current, data);
  }, [renderer, data, width, height, drawTicksAsGridLines, transitionSeconds, labelOrientation]);

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
