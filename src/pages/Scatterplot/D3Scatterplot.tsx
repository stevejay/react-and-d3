import { ReactElement, useEffect, useLayoutEffect, useState } from 'react';
import { max, min } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { Delaunay } from 'd3-delaunay';
import { scaleLinear } from 'd3-scale';
import { select, Selection } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import { noop, uniqueId } from 'lodash-es';

import { Svg } from '@/components/Svg';
import { useFollowOnHoverTooltip } from '@/tooltip';
import { Margin, PointDatum, Rect } from '@/types';

/* globals ElementTagNameMap */
function ensureChild<K extends keyof ElementTagNameMap, ParentElementT extends SVGElement>(
  svg: Selection<ParentElementT, any, any, any>,
  k: K,
  className?: string
) {
  let element = svg.selectAll<ElementTagNameMap[K], null>(`.${className ?? k}`).data([null]);
  const enter = element
    .enter()
    .append(k)
    .classed(className ?? k, true);
  const update = enter.merge(element);
  return { enter, update };
}

class D3ScatterplotRenderer<DatumT> {
  width = 0;
  height = 0;
  margins: Margin = { left: 0, right: 0, top: 0, bottom: 0 };
  svgElement: SVGSVGElement | null = null;
  compact = false;
  onMouseMove: (datum: PointDatum<DatumT>, rect: Rect) => void = noop;
  onMouseLeave: () => void = noop;
  onClick: (datum: PointDatum<DatumT>, rect: Rect) => void = noop;

  private chartId: string = uniqueId('scatterplot');
  private data: PointDatum<DatumT>[] = [];
  private delaunayTriangulation: Delaunay<DatumT> = new Delaunay([]);

  updateData(
    data: PointDatum<DatumT>[],
    getX: (datum: PointDatum<DatumT>) => number,
    getY: (datum: PointDatum<DatumT>) => number
  ) {
    if (data !== this.data) {
      this.delaunayTriangulation = Delaunay.from(data, getX, getY);
    }
    this.data = data;
  }

  render() {
    if (!this.svgElement) {
      return;
    }

    const svg = select(this.svgElement).attr('width', this.width).attr('height', this.height);

    if (this.width <= 0 || this.height <= 0) {
      return;
    }

    const chartWidth = this.width - this.margins.left - this.margins.right;
    const chartHeight = this.height - this.margins.top - this.margins.bottom;

    // Clip rect for plotting area

    const clipPathId = `${this.chartId}-chartAreaClip`;
    const defs = ensureChild(svg, 'defs');
    const clipPath = ensureChild(defs.update, 'clipPath');
    clipPath.enter.attr('id', clipPathId);
    const rect = ensureChild(clipPath.update, 'rect');
    rect.update.attr('x', 0).attr('y', 0).attr('width', chartWidth).attr('height', chartHeight);

    // let defs = svg.selectAll<SVGDefsElement, null>('.defs').data([null]);
    // defs = defs.enter().append('defs').classed('defs', true).merge(defs);

    // let clipPath = defs.selectAll<SVGClipPathElement, null>(`#${clipPathId}`).data([null]);
    // clipPath = clipPath.enter().append('clipPath').attr('id', clipPathId).merge(clipPath);

    // let rect = clipPath.selectAll<SVGRectElement, null>('.rect').data([null]);
    // rect = rect
    //   .enter()
    //   .append('rect')
    //   .classed('rect', true)
    //   .merge(rect)
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('width', chartWidth)
    //   .attr('height', chartHeight);

    // X Scale

    const baseXScale = scaleLinear()
      .domain([min(this.data, (datum) => datum.x) ?? NaN, max(this.data, (datum) => datum.x) ?? NaN])
      .range([0, chartWidth]);
    baseXScale.ticks(this.compact ? 5 : 10);

    let xScale = baseXScale.copy();

    const xAxisGroup = ensureChild(svg, 'g', 'x-axis');
    xAxisGroup.update
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top + chartHeight})`)
      .call(axisBottom(xScale));

    // let xAxisGroup = svg.selectAll<SVGGElement, null>('.x-axis').data([null]);
    // xAxisGroup = xAxisGroup
    //   .enter()
    //   .append('g')
    //   .classed('x-axis', true)
    //   .merge(xAxisGroup)
    //   .attr('transform', `translate(${this.margins.left}, ${this.margins.top + chartHeight})`)
    //   .call(axisBottom(xScale));

    // Y Scale

    const baseYScale = scaleLinear()
      .domain([min(this.data, (datum) => datum.y) ?? NaN, max(this.data, (datum) => datum.y) ?? NaN])
      .range([chartHeight, 0]);
    baseYScale.ticks(this.compact ? 5 : 10);
    let yScale = baseYScale.copy();

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

    let circle = chartAreaGroup.selectAll<SVGCircleElement, PointDatum<DatumT>>('.circle').data(this.data);
    circle.exit().remove();
    circle = circle
      .enter()
      .append('circle')
      .classed('circle', true)
      .classed('fill-sky-500', true)
      .merge(circle)
      .attr('cx', (datum) => xScale(datum.x))
      .attr('cy', (datum) => yScale(datum.y))
      .attr('r', 8)
      .style('opacity', 0.5);

    // Zoom

    const zoomInstance = zoom<SVGRectElement, null>();

    zoomInstance
      .scaleExtent([0.5, 5])
      .translateExtent([
        [chartWidth * -0.5, chartHeight * -0.5],
        [chartWidth * 1.5, chartHeight * 1.5]
      ])
      .extent([
        [0, 0],
        [chartWidth, chartHeight]
      ]);

    zoomInstance.on('zoom', (event) => {
      xScale = event.transform.rescaleX(baseXScale);
      yScale = event.transform.rescaleY(baseYScale);

      xAxisGroup.update.call(axisBottom(xScale));
      yAxisGroup.call(axisLeft(yScale));

      // update circle position
      chartAreaGroup
        .selectAll<SVGCircleElement, PointDatum<DatumT>>('circle')
        .attr('cx', (datum) => xScale(datum.x))
        .attr('cy', (datum) => yScale(datum.y));

      // Hide the tooltip:
      this.onMouseLeave();
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
    // TODO: Only do this if the data has changed?
    zoomRect.call(
      zoomInstance.transform,
      zoomIdentity.translate(chartWidth * 0.05, chartHeight * 0.05).scale(0.9)
    );

    // Event handlers for tooltip detection:

    zoomRect.on('mousemove.tooltip', (event) => {
      const x = event.offsetX - this.margins.left;
      const y = event.offsetY - this.margins.top;
      const findResult = this.delaunayTriangulation.find(xScale.invert(x), yScale.invert(y));

      if (findResult > -1) {
        const datum = this.data[findResult];
        const relativeX = xScale(datum.x);
        const relativeY = yScale(datum.y);
        const delta = 4; // Allowance for point radius

        // Only show the tooltip if its dot is visible.
        if (
          relativeX >= -delta &&
          relativeX < chartWidth + delta &&
          relativeY >= -delta &&
          relativeY < chartHeight + delta
        ) {
          this.onMouseMove(datum, {
            x: this.margins.left + relativeX,
            y: this.margins.right + relativeY,
            width: 0,
            height: 0
          });
        }
      }
    });

    zoomRect.on('mouseleave.tooltip', () => {
      this.onMouseLeave();
    });

    zoomRect.on('click.tooltip', (event) => {
      // Prevent the click from reaching the click handler added to the document that
      // closes the tooltip.
      event.stopPropagation();
    });
  }

  destroy() {
    const svg = select(this.svgElement);
    svg.selectAll<SVGRectElement, null>('.zoom-rect').on('.tooltip', null).on('.zoom', null);
  }
}

export interface D3ScatterplotProps<DatumT> {
  data: PointDatum<DatumT>[];
  width: number;
  height: number;
  margins: Margin;
  ariaLabelledby: string;
  compact?: boolean;
  renderTooltipContent: (datum: PointDatum<DatumT>) => ReactElement | null;
}

export function D3Scatterplot<DatumT>({
  data,
  margins,
  ariaLabelledby,
  width = 0,
  height = 0,
  compact = false,
  renderTooltipContent
}: D3ScatterplotProps<DatumT>) {
  const [svgRef, interactionProps, TooltipComponent, tooltipProps] = useFollowOnHoverTooltip(
    renderTooltipContent,
    { hideTooltipOnScroll: true, xOffset: 0, yOffset: 14 }
  );

  const [renderer] = useState<D3ScatterplotRenderer<DatumT>>(() => new D3ScatterplotRenderer());

  useLayoutEffect(() => {
    renderer.width = width;
    renderer.height = height;
    renderer.margins = margins;
    renderer.updateData(
      data,
      (datum) => datum.x,
      (datum) => datum.y
    );
    renderer.svgElement = svgRef.current;
    renderer.compact = compact;
    renderer.onMouseMove = interactionProps.onMouseEnter;
    renderer.onMouseLeave = interactionProps.onMouseLeave;
    renderer.onClick = interactionProps.onClick;
    renderer.render();
  }, [renderer, data, margins, width, height, compact, svgRef, interactionProps]);

  useEffect(() => () => renderer.destroy(), [renderer]);

  return (
    <>
      <Svg
        ref={svgRef}
        width={width}
        height={height}
        aria-labelledby={ariaLabelledby}
        className="select-none bg-slate-800 touch-none"
      />
      <TooltipComponent {...tooltipProps} />
    </>
  );
}
