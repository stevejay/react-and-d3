import { memo, useMemo, VFC } from 'react';
import { useId } from '@uifabric/react-hooks';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { random } from 'lodash-es';

import type { Margins } from './types';

export type Datum = {
  date: string;
  value: number;
};

type MappedDatum = {
  date: Date;
  value: number;
};

const LAST_POINT_RADIUS_PX = 3;
const LAST_POINT_MARGIN_PX = 2;
const LINE_STROKE_WIDTH_PX = 2;
const NO_DATA_LINE_LENGTH_PX = 8;

const MARGINS: Margins = {
  top: LAST_POINT_RADIUS_PX + 1,
  left: 1,
  bottom: LAST_POINT_RADIUS_PX + 1,
  right: LAST_POINT_RADIUS_PX + 1
};

export function generateTrendBasedData(trendDir: 1 | 0 | -1) {
  const data: Datum[] = [];

  data.push({
    date: '2020-01-01',
    value: 10
  });

  for (let index = 2; index < 12; index++) {
    data.push({
      date: `2020-${index > 9 ? index : `0${index}`}-01`,
      value: random(15, 45)
    });
  }

  data.push({
    date: '2020-12-01',
    value: 10 + 5 * trendDir
  });

  return data;
}

export function getTrendClassName(data: readonly Datum[]) {
  if (!data.length) {
    return 'text-secondary';
  }

  const firstValue = data[0].value;
  const lastValue = data[data.length - 1].value;

  if (firstValue > lastValue) {
    return 'text-danger';
  } else if (firstValue < lastValue) {
    return 'text-success';
  } else {
    return 'text-secondary';
  }
}

export type SparklineProps = {
  width?: number;
  height?: number;
  data?: readonly Datum[];
};

export const Sparkline: VFC<SparklineProps> = memo(
  ({ width, height, data }) => {
    const id = useId();

    const mappedData = useMemo<MappedDatum[]>(
      () =>
        (data || []).map((d) => ({
          date: new Date(d.date),
          value: d.value
        })),
      [data]
    );

    if (!width || !height || !data) {
      return null;
    }

    const gradientDefId = `${id}_gradient`;
    const clipPathDefId = `${id}_clipPath`;
    const trendClassName = getTrendClassName(data);
    const hasData = Boolean(data.length);
    const chartWidth = width - MARGINS.left - MARGINS.right;
    const chartHeight = height - MARGINS.top - MARGINS.bottom;

    const x = d3
      .scaleTime()
      .domain(
        hasData
          ? [d3.min(mappedData, (d) => d.date) ?? 0, d3.max(mappedData, (d) => d.date) ?? 0]
          : [new Date(), new Date()]
      )
      .range([0, chartWidth]);

    const y = d3
      .scaleLinear()
      .domain([d3.min(mappedData, (d) => d.value) ?? 0, d3.max(mappedData, (d) => d.value) ?? 0])
      .range([chartHeight, 0])
      .nice();

    const gradientAreaGenerator = d3
      .area<MappedDatum>()
      .x((d) => x(d.date) ?? 0)
      .y0(chartHeight)
      .y1((d) => y(d.value));

    const lineGenerator = d3
      .line<MappedDatum>()
      .x((d) => x(d.date) ?? 0)
      .y((d) => y(d.value));

    const lastDatum = hasData ? mappedData[data.length - 1] : null;
    const lastPointCx = lastDatum
      ? x(lastDatum.date) ?? 0
      : NO_DATA_LINE_LENGTH_PX + LAST_POINT_RADIUS_PX + LAST_POINT_MARGIN_PX * 0.5;
    const lastPointCy = lastDatum ? y(lastDatum.value) ?? 0 : 0;

    return (
      <motion.svg
        role="none"
        className={`absolute top-0 left-0 pointer-events-none ${trendClassName}`}
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
        <g transform={`translate(${MARGINS.left},${MARGINS.top})`} mask={`url(#${clipPathDefId})`}>
          {hasData && (
            <>
              <path d={gradientAreaGenerator(mappedData) ?? ''} fill={`url(#${gradientDefId})`} />
              <path
                className="stroke-current"
                d={lineGenerator(mappedData) ?? ''}
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
        <g transform={`translate(${MARGINS.left},${MARGINS.top})`}>
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
