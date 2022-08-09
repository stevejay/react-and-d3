import { schemeCategory10 } from 'd3-scale-chromatic';

import { XYChartTheme } from '@/visx-hybrid/types';

export const darkTheme: XYChartTheme = {
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
  bigLabels: {
    // font-style, font-variant, font-weight, font-size/line-height, font-family
    font: 'normal normal normal 16px/1 "Readex Pro"',
    className: 'text-slate-400'
  },
  smallLabels: {
    font: 'normal normal normal 14px/1 "Readex Pro"',
    className: 'text-slate-200'
  },
  datumLabels: {
    font: 'normal normal normal 14px/1 "Readex Pro"',
    className: 'text-slate-200'
  },
  tooltip: {
    container: {
      className:
        'text-slate-900 bg-slate-100 pointer-events-none px-2 py-1 shadow-md max-w-[280px] text-sm leading-none rounded-sm'
    }
  }
};
