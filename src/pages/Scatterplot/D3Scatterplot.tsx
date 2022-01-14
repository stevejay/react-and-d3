import { FC, useLayoutEffect, useRef, useState } from 'react';
import { max, min } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import { uniqueId } from 'lodash-es';

import { Svg } from '@/components/Svg';
import { Margins, PointDatum } from '@/types';

class D3ScatterplotRenderer {
  width = 0;
  height = 0;
  margins: Margins = { left: 0, right: 0, top: 0, bottom: 0 };
  data: PointDatum[] = [];
  svgElement: SVGSVGElement | null = null;
  compact = false;

  private chartId: string = uniqueId('scatterplot');

  render() {
    if (!this.svgElement) {
      return;
    }

    const svg = select(this.svgElement).attr('width', this.width).attr('height', this.height);

    if (!this.width || !this.height) {
      return;
    }

    const chartWidth = this.width - this.margins.left - this.margins.right;
    const chartHeight = this.height - this.margins.top - this.margins.bottom;

    // Clip path for chart area

    const clipPathId = `${this.chartId}-chartAreaClip`;

    let defs = svg.selectAll<SVGDefsElement, null>('.scatterplot-defs').data([null]);
    defs = defs.enter().append('defs').classed('scatterplot-defs', true).merge(defs);

    let clipPath = defs.selectAll<SVGClipPathElement, null>(`#${clipPathId}`).data([null]);
    clipPath = clipPath.enter().append('clipPath').attr('id', clipPathId).merge(clipPath);

    let rect = clipPath.selectAll<SVGRectElement, null>('.rect').data([null]);
    rect = rect
      .enter()
      .append('rect')
      .classed('rect', true)
      .merge(rect)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', chartWidth)
      .attr('height', chartHeight);

    // X Scale

    const xScale = scaleLinear()
      .domain([min(this.data, (d) => d.x) ?? NaN, max(this.data, (d) => d.x) ?? NaN])
      .range([0, chartWidth]);
    xScale.ticks(this.compact ? 5 : 10);

    let xAxisGroup = svg.selectAll<SVGGElement, null>('.x-axis').data([null]);
    xAxisGroup = xAxisGroup
      .enter()
      .append('g')
      .classed('x-axis', true)
      .merge(xAxisGroup)
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top + chartHeight})`)
      .call(axisBottom(xScale));

    // Y Scale

    const yScale = scaleLinear()
      .domain([min(this.data, (d) => d.y) ?? NaN, max(this.data, (d) => d.y) ?? NaN])
      .range([chartHeight, 0]);
    yScale.ticks(this.compact ? 5 : 10);

    let yAxisGroup = svg.selectAll<SVGGElement, null>('.y-axis').data([null]);
    yAxisGroup = yAxisGroup
      .enter()
      .append('g')
      .classed('y-axis', true)
      .merge(yAxisGroup)
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`)
      .call(axisLeft(yScale));

    // Chart area

    let chartAreaGroup = svg.selectAll<SVGGElement, null>('.scatterplot').data([null]);
    chartAreaGroup = chartAreaGroup
      .enter()
      .append('g')
      .classed('scatterplot', true)
      .merge(chartAreaGroup)
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`)
      .attr('clip-path', `url(#${clipPathId})`);

    // Points

    let circle = chartAreaGroup.selectAll<SVGCircleElement, PointDatum>('.circle').data(this.data);
    circle.exit().remove();
    circle = circle
      .enter()
      .append('circle')
      .classed('circle', true)
      .classed('fill-sky-500', true)
      .merge(circle)
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', 8)
      .style('opacity', 0.5);

    // Zoom

    const zoomInstance = zoom<SVGRectElement, null>().scaleExtent([0.5, 5]);

    zoomInstance
      .extent([
        [0, 0],
        [chartWidth, chartHeight]
      ])
      .on('zoom', (event) => {
        const newXScale = event.transform.rescaleX(xScale);
        const newYScale = event.transform.rescaleY(yScale);

        xAxisGroup.call(axisBottom(newXScale));
        yAxisGroup.call(axisLeft(newYScale));

        // update circle position
        chartAreaGroup
          .selectAll<SVGCircleElement, PointDatum>('circle')
          .attr('cx', (d) => newXScale(d.x))
          .attr('cy', (d) => newYScale(d.y));
      });

    // Zoom event rect

    let zoomRect = svg.selectAll<SVGRectElement, null>('.zoom-rect').data([null]);
    zoomRect = zoomRect
      .enter()
      .append('rect')
      .classed('zoom-rect', true)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .merge(zoomRect);
    zoomRect
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`)
      .call(zoomInstance);

    // Reset the zoom transform in the case that the chart has been updated.
    // https://stackoverflow.com/a/67976133/604006
    zoomRect.call(zoomInstance.transform, zoomIdentity);
  }
}

export type D3ScatterplotProps = {
  data: PointDatum[];
  width: number;
  height: number;
  margins: Margins;
  ariaLabelledby: string;
  compact?: boolean;
};

export const D3Scatterplot: FC<D3ScatterplotProps> = ({
  data,
  margins,
  ariaLabelledby,
  width = 0,
  height = 0,
  compact = false
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [renderer] = useState<D3ScatterplotRenderer>(() => new D3ScatterplotRenderer());

  useLayoutEffect(() => {
    renderer.width = width;
    renderer.height = height;
    renderer.margins = margins;
    renderer.data = data;
    renderer.svgElement = svgRef.current;
    renderer.compact = compact;
    renderer.render();
  }, [data, margins, width, height, compact, renderer]);

  return (
    <Svg
      ref={svgRef}
      width={width}
      height={height}
      aria-labelledby={ariaLabelledby}
      className="select-none bg-slate-800 touch-none"
    />
  );
};
