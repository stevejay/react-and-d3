import { schemeCategory10 } from 'd3-scale-chromatic';

import { IXYChartTheme } from '@/visx-hybrid/types';

export const darkTheme: IXYChartTheme = {
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
        'max-w-xs p-2 text-base text-left border rounded shadow-sm opacity-0 select-none border-slate-600 bg-slate-900'
    }
  }
};
