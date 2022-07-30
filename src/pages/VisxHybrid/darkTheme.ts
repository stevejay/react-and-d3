import { XYChartTheme } from '@/visx-hybrid/types';

export const darkTheme: XYChartTheme = {
  grid: {
    className: 'text-slate-500',
    strokeDasharray: '1 3'
  },
  bandStripes: {
    className: 'text-slate-600'
  },
  bigLabels: {
    // font-style, font-variant and font-weight
    font: 'normal normal normal 16px/1 "Readex Pro"',
    className: 'text-slate-400'
  },
  smallLabels: {
    font: 'normal normal normal 14px/1 "Readex Pro"',
    className: 'text-slate-200'
  }
};
