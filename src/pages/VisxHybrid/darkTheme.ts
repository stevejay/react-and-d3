import { XYChartTheme } from '@/visx-hybrid/types';

export const darkTheme: XYChartTheme = {
  grid: {
    className: 'text-slate-500',
    strokeDasharray: '1 3'
  },
  bandStripes: {
    className: 'text-slate-600'
  },
  svgLabelBig: {
    // font-style, font-variant and font-weight
    font: 'normal normal normal 16px/1 "Readex Pro"',
    fill: 'green',
    className: 'text-slate-400'
  },
  svgLabelSmall: {
    font: 'normal normal normal 14px/1 "Readex Pro"',
    fill: 'pink',
    className: 'text-slate-200'
  }
};
