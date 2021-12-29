import { FC, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

class D3BandAxisChartRenderer {
  width = 0;
  height = 0;
  drawTicksAsGridLines = false;
  transitionSeconds = 0.25;

  private scale = d3.scaleBand();
  private axis = d3.axisBottom(this.scale);
  private margins = { top: 20, bottom: 34, left: 40, right: 40 };

  render(svgElement: SVGSVGElement | null, data: string[]): void {
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

    this.scale.domain(data).range([0, chartWidth]);

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

export type D3BandAxisChartProps = {
  data: string[];
  width: number;
  height: number;
  drawTicksAsGridLines: boolean;
  transitionSeconds: number;
};

export const D3BandAxisChart: FC<D3BandAxisChartProps> = ({
  data,
  width,
  height,
  drawTicksAsGridLines,
  transitionSeconds
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [renderer] = useState<D3BandAxisChartRenderer>(() => new D3BandAxisChartRenderer());

  useEffect(() => {
    renderer.width = width;
    renderer.height = height;
    renderer.drawTicksAsGridLines = drawTicksAsGridLines;
    renderer.transitionSeconds = transitionSeconds;
    renderer.render(svgRef.current, data);
  }, [renderer, data, width, height, drawTicksAsGridLines, transitionSeconds]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className="font-sans bg-slate-800"
      style={{ shapeRendering: 'optimizeSpeed' }}
    />
  );
};
