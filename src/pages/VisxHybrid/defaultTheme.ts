import { schemeCategory10 } from 'd3-scale-chromatic';

import { IXYChartTheme } from '@/visx-hybrid/types';

export const defaultTheme: IXYChartTheme = {
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
    text: {
      font: 'normal normal normal 14px/1 "Readex Pro"',
      className: 'text-slate-200'
    },
    padding: 4
  },
  tooltip: {
    container: {
      className:
        'text-slate-900 bg-slate-100 pointer-events-none px-2 py-1 shadow-md max-w-[280px] text-sm leading-none rounded-sm'
    }
  }
};
