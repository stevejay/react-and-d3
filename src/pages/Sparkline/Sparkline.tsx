import { FC, memo } from 'react';
import { useId } from '@uifabric/react-hooks';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

import type { Margins } from '@/types';

export type Datum = {
  date: Date;
  value: number;
};

const LAST_POINT_RADIUS_PX = 3;
const LAST_POINT_MARGIN_PX = 2;
const LINE_STROKE_WIDTH_PX = 2;
const NO_DATA_LINE_LENGTH_PX = 8;

const margins: Margins = {
  top: LAST_POINT_RADIUS_PX + 1,
  left: 1,
  bottom: LAST_POINT_RADIUS_PX + 1,
  right: LAST_POINT_RADIUS_PX + 1
};

export type SparklineProps = {
  width?: number;
  height?: number;
  data?: readonly Datum[];
};

export const Sparkline: FC<SparklineProps> = memo(
  ({ width, height, data }) => {
    const id = useId();

    if (!width || !height || !data) {
      return null;
    }

    const gradientDefId = `${id}_gradient`;
    const clipPathDefId = `${id}_clipPath`;
    // const trendClassName = getTrendClassName(data);
    const hasData = Boolean(data.length);
    const chartWidth = width - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;

    const x = d3
      .scaleTime()
      .domain(
        hasData
          ? [d3.min(data, (d) => d.date) ?? 0, d3.max(data, (d) => d.date) ?? 0]
          : [new Date(), new Date()]
      )
      .range([0, chartWidth]);

    const y = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.value) ?? 0, d3.max(data, (d) => d.value) ?? 0])
      .range([chartHeight, 0])
      .nice();

    const gradientAreaGenerator = d3
      .area<Datum>()
      .x((d) => x(d.date) ?? 0)
      .y0(chartHeight)
      .y1((d) => y(d.value));

    const lineGenerator = d3
      .line<Datum>()
      .x((d) => x(d.date) ?? 0)
      .y((d) => y(d.value));

    const lastDatum = hasData ? data[data.length - 1] : null;
    const lastPointCx = lastDatum
      ? x(lastDatum.date) ?? 0
      : NO_DATA_LINE_LENGTH_PX + LAST_POINT_RADIUS_PX + LAST_POINT_MARGIN_PX * 0.5;
    const lastPointCy = lastDatum ? y(lastDatum.value) ?? 0 : 0;

    return (
      <motion.svg
        role="presentation"
        className="text-pink-600 pointer-events-none"
        width={width}
        height={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <defs>
          <linearGradient id={gradientDefId} x1={0} y2="100%" x2={0} y1={0}>
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.2}></stop>
            <stop offset="100%" stopColor="currentColor" stopOpacity={0}></stop>
          </linearGradient>
          <mask id={clipPathDefId}>
            <rect x={0} y={0} width={chartWidth} height={chartHeight} fill="white" />
            <circle
              r={LAST_POINT_RADIUS_PX + LAST_POINT_MARGIN_PX}
              fill="black"
              cx={lastPointCx}
              cy={lastPointCy}
            />
          </mask>
        </defs>
        <g transform={`translate(${margins.left},${margins.top})`} mask={`url(#${clipPathDefId})`}>
          {hasData && (
            <>
              <path d={gradientAreaGenerator(data) ?? ''} fill={`url(#${gradientDefId})`} />
              <path
                className="stroke-current"
                d={lineGenerator(data) ?? ''}
                fill="none"
                strokeWidth={LINE_STROKE_WIDTH_PX}
              />
            </>
          )}
          {!hasData && (
            <line
              className="stroke-current"
              fill="none"
              strokeWidth={LINE_STROKE_WIDTH_PX}
              x1={0}
              y1={0}
              x2={NO_DATA_LINE_LENGTH_PX}
              y2={0}
            />
          )}
        </g>
        <g transform={`translate(${margins.left},${margins.top})`}>
          <circle className="fill-current" cx={lastPointCx} cy={lastPointCy} r={LAST_POINT_RADIUS_PX} />
        </g>
      </motion.svg>
    );
  },
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height
);
