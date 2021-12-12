import { FC, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

class AxisD3Renderer {
  width = 0;
  height = 0;
  drawTicksAsGridLines = false;

  private scale = d3.scaleLinear();
  private axis = d3.axisBottom(this.scale);
  private margins = { top: 20, bottom: 34, left: 20, right: 20 };

  render(svgElement: SVGSVGElement, data: number[]): void {
    const svg = d3.select(svgElement);
    svg.style('width', `${this.width}px`);
    svg.style('height', `${this.height}px`);

    if (this.width === 0 || this.height === 0) {
      return;
    }

    const chartWidth = this.width - this.margins.left - this.margins.right;
    const chartHeight = this.height - this.margins.top - this.margins.bottom;

    this.scale.domain([d3.min(data) ?? 0, d3.max(data) ?? 0]).range([0, chartWidth]);

    this.axis
      .ticks(10)
      .tickSizeInner(this.drawTicksAsGridLines ? -chartHeight : 6)
      .tickSizeOuter(-chartHeight);

    let group = svg.selectAll<SVGGElement, null>('.axis').data([null]);
    group = group.enter().append('g').classed('axis', true).merge(group);
    group
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top + chartHeight})`)
      .attr('font-family', 'inherit');
    // .classed('axis');

    group.transition().duration(1000).call(this.axis);
    // this.axis(group.transition());

    // .classed('text-red-500', true);
  }
}

type AxisD3Props = {
  data: number[];
  width: number;
  height: number;
  drawTicksAsGridLines: boolean;
};

export const AxisD3: FC<AxisD3Props> = ({ data, width, height, drawTicksAsGridLines }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [renderer] = useState<AxisD3Renderer>(() => new AxisD3Renderer());

  useEffect(() => {
    renderer.width = width;
    renderer.height = height;
    renderer.drawTicksAsGridLines = drawTicksAsGridLines;
    if (svgRef.current) {
      renderer.render(svgRef.current, data);
    }
  }, [renderer, data, width, height, drawTicksAsGridLines]);

  //   useEffect(() => {
  //     console.log((svgRef.current?.firstChild as unknown as { __axis: any }).__axis);
  //   });

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className="bg-slate-200 font-sans"
      style={{ shapeRendering: 'optimizeSpeed' }}
    />
  );
};
