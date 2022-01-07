import { FC, useEffect, useRef, useState } from 'react';
import { max, min } from 'd3-array';
import { axisBottom } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';

import type { TickLabelOrientation } from '@/types';

class D3LinearAxisChartRenderer {
  width = 0;
  height = 0;
  transitionSeconds = 0.25;
  tickLabelOrientation: TickLabelOrientation = 'horizontal';

  private scale = scaleLinear();
  private axis = axisBottom(this.scale);
  private margins = { top: 20, bottom: 34, left: 24, right: 24 };

  render(svgElement: SVGSVGElement | null, data: number[]): void {
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

    const domain = [min(data) ?? 0, max(data) ?? 0];
    this.scale.domain(domain).rangeRound([0, chartWidth]).nice();

    this.axis.tickArguments([10]).tickSizeInner(6).tickSizeOuter(-chartHeight);

    const groupTransition = transition<SVGGElement>().duration(this.transitionSeconds * 1000);
    let group = svg.selectAll<SVGGElement, null>('.axis').data([null]);
    group = group.enter().append('g').classed('axis', true).merge(group);
    group
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top + chartHeight})`)
      .style('font-family', 'inherit')
      .transition(groupTransition as any)
      .call(this.axis);
  }
}

export type D3LinearAxisChartProps = {
  data: number[];
  width: number;
  height: number;
  ariaLabelledby: string;
  transitionSeconds?: number;
  tickLabelOrientation: TickLabelOrientation;
};

export const D3LinearAxisChart: FC<D3LinearAxisChartProps> = ({
  data,
  width,
  height,
  ariaLabelledby,
  tickLabelOrientation,
  transitionSeconds = 0.25
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [renderer] = useState<D3LinearAxisChartRenderer>(() => new D3LinearAxisChartRenderer());

  useEffect(() => {
    renderer.width = width;
    renderer.height = height;
    renderer.transitionSeconds = transitionSeconds;
    renderer.tickLabelOrientation = tickLabelOrientation;
    renderer.render(svgRef.current, data);
  }, [renderer, data, width, height, transitionSeconds, tickLabelOrientation]);

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
