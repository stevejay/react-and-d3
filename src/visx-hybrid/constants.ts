import { easeCubicInOut } from 'd3-ease';
import { schemeCategory10 } from 'd3-scale-chromatic';

import type { TickLabelAngle, XYChartTheme } from './types';

export const defaultSpringConfig = { duration: 350, easing: easeCubicInOut };

export const defaultHideZero = false;
export const defaultHideTicks = false;
export const defaultTickLength = 8;
export const defaultTickLabelPadding = 6;
export const defaultAutoMarginLabelPadding = 8;
export const defaultHideTooltipDebounceMs = 400;
export const defaultParentSizeDebounceMs = 300;
export const defaultTickLabelAngle: TickLabelAngle = 'horizontal';
export const defaultShapeRendering = 'crispEdges';

// font-style, font-variant, font-weight, font-size, line-height, font-family
export const defaultBigLabelsFont = 'normal normal normal 14px/1 sans-serif';

// font-style, font-variant, font-weight, font-size, line-height, font-family
export const defaultSmallLabelsFont = 'normal normal normal 12px/1 sans-serif';

export const defaultBigLabelsTextStyle = {
  // font-style, font-variant, font-weight, font-size, line-height, font-family
  font: defaultBigLabelsFont
};

export const defaultSmallLabelsTextStyle = {
  // font-style, font-variant, font-weight, font-size, line-height, font-family
  font: defaultSmallLabelsFont
};

export const defaultTheme: XYChartTheme = {
  colors: schemeCategory10,
  grid: {
    independent: {
      className: 'text-slate-500',
      strokeDasharray: '1 3'
    },
    dependent: {
      className: 'text-slate-500',
      strokeDasharray: '1 3'
    }
  },
  bandStripes: {
    className: 'text-slate-600'
  },
  bigLabels: defaultBigLabelsTextStyle,
  smallLabels: defaultSmallLabelsTextStyle
};

export const AREASERIES_EVENT_SOURCE = 'AREASERIES_EVENT_SOURCE';
export const AREASTACK_EVENT_SOURCE = 'AREASTACK_EVENT_SOURCE';
export const BARGROUP_EVENT_SOURCE = 'BARGROUP_EVENT_SOURCE';
export const BARSERIES_EVENT_SOURCE = 'BARSERIES_EVENT_SOURCE';
export const BARSTACK_EVENT_SOURCE = 'BARSTACK_EVENT_SOURCE';
export const GLYPHSERIES_EVENT_SOURCE = 'GLYPHSERIES_EVENT_SOURCE';
export const LINESERIES_EVENT_SOURCE = 'LINESERIES_EVENT_SOURCE';
export const XYCHART_EVENT_SOURCE = 'XYCHART_EVENT_SOURCE';
