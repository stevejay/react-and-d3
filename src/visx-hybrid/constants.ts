import { easeCubicInOut } from 'd3-ease';
import { schemeCategory10 } from 'd3-scale-chromatic';

import type { Margin, TickLabelAlignment, XYChartTheme } from './types';

export const defaultSpringConfig = { duration: 350, easing: easeCubicInOut };

export const defaultHideZero = false;
export const defaultHideTicks = false;
export const defaultTickLength = 8;
export const defaultTickLabelPadding = 6;
export const defaultHorizontalAxisAutoMarginLabelPadding = 8;
export const defaultVerticalAxisAutoMarginLabelPadding = defaultHorizontalAxisAutoMarginLabelPadding + 8;
export const defaultHideTooltipDebounceMs = 400;
export const defaultParentSizeDebounceMs = 300;
export const defaultTickLabelAngle: TickLabelAlignment = 'horizontal';
export const defaultShapeRendering = 'crispEdges';
export const defaultDatumLabelPadding = 8;
export const defaultGroupPadding = 0.1;
export const defaultTooltipGlyphRadius = 4;
export const defaultOuterTickLength = 0;
export const defaultGlyphSize = 6;
export const zeroRangePadding: [number, number] = [0, 0];
export const zeroMargin: Margin = { left: 0, right: 0, top: 0, bottom: 0 };

// An arbitrary default bandwidth for a non-band scale on the independent axis.
export const defaultA11yElementBandwidth = 40;

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
  svg: {
    style: { userSelect: 'none' }
  },
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
  smallLabels: defaultSmallLabelsTextStyle,
  tooltip: {
    container: {
      style: {
        pointerEvents: 'none',
        maxWidth: 280,
        padding: '4px 8px 4px 8px',
        backgroundColor: 'white',
        color: 'black',
        border: '1px solid black'
      }
    }
  }
};

export const areaSeriesEventSource = 'AREASERIES_EVENT_SOURCE';
export const areaStackEventSource = 'AREASTACK_EVENT_SOURCE';
export const barGroupEventSource = 'BARGROUP_EVENT_SOURCE';
export const barSeriesEventSource = 'BARSERIES_EVENT_SOURCE';
export const barStackEventSource = 'BARSTACK_EVENT_SOURCE';
export const glyphSeriesEventSource = 'GLYPHSERIES_EVENT_SOURCE';
export const lineSeriesEventSource = 'LINESERIES_EVENT_SOURCE';
export const xyChartEventSource = 'XYCHART_EVENT_SOURCE';
