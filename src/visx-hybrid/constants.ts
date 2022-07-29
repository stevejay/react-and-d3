import { easeCubicInOut } from 'd3-ease';

import type { XYChartTheme } from './types';

export const defaultSpringConfig = { duration: 350, easing: easeCubicInOut };

export const defaultHideZero = false;
export const defaultHideTicks = false;
export const defaultTickLength = 8;
export const defaultTickLabelPadding = 6;
export const defaultLabelOffset = 14;
export const defaultHideTooltipDebounceMs = 400;
export const defaultParentSizeDebounceMs = 300;

export const defaultLabelTextProps = 'normal normal normal 14px/1 inherit';
export const defaultTickLabelTextProps = 'normal normal normal 12px/1 inherit';

export const defaultTheme: XYChartTheme = {
  grid: {
    className: 'text-slate-500',
    strokeDasharray: '1 3'
  },
  stripes: {
    className: 'text-slate-600'
  },
  svgLabelBig: {
    // font-style, font-variant, font-weight, font-size, line-height, font-family
    font: 'normal normal normal 16px/1 "Readex Pro"',
    fill: 'green',
    className: 'text-slate-300'
  },
  svgLabelSmall: {
    font: 'normal normal normal 14px/1 "Readex Pro"',
    fill: 'pink',
    className: 'text-slate-200'
  }
};

export const AREASERIES_EVENT_SOURCE = 'AREASERIES_EVENT_SOURCE';
export const AREASTACK_EVENT_SOURCE = 'AREASTACK_EVENT_SOURCE';
export const BARGROUP_EVENT_SOURCE = 'BARGROUP_EVENT_SOURCE';
export const BARSERIES_EVENT_SOURCE = 'BARSERIES_EVENT_SOURCE';
export const BARSTACK_EVENT_SOURCE = 'BARSTACK_EVENT_SOURCE';
export const GLYPHSERIES_EVENT_SOURCE = 'GLYPHSERIES_EVENT_SOURCE';
export const LINESERIES_EVENT_SOURCE = 'LINESERIES_EVENT_SOURCE';
export const XYCHART_EVENT_SOURCE = 'XYCHART_EVENT_SOURCE';
