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
    className: 'text-slate-800'
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
    text: {
      font: 'normal normal normal 14px/1 "Readex Pro"',
      className: 'text-slate-200'
    },
    padding: 5
  },
  tooltip: {
    container: {
      className:
        'max-w-xs px-2 py-1 text-base text-left border rounded shadow-sm opacity-0 select-none border-slate-600 bg-slate-900 pointer-events-none'
    }
  }
};

export const clippdTheme: IXYChartTheme = {
  colors: ['currentColor'],
  svg: {
    style: { userSelect: 'none' },
    className: 'text-slate-500/50'
  },
  grid: {
    independent: {
      className: 'text-slate-500'
      // strokeDasharray: '1 3'
    },
    dependent: {
      className: 'text-slate-500'
      // strokeDasharray: '1 3'
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
    text: {
      font: 'normal normal normal 20px/1 "Readex Pro"',
      className: 'text-slate-200'
    },
    padding: 12
  },
  tooltip: {
    container: {
      className:
        'max-w-xs px-2 py-1 text-base text-left border rounded shadow-sm opacity-0 select-none border-slate-600 bg-slate-900 pointer-events-none'
    }
  },
  axis: {
    bottom: {
      tickLabel: {
        font: 'normal normal normal 20px/1 "Readex Pro"',
        className: 'text-slate-200'
      }
    },
    left: {
      tickLabel: {
        font: 'normal normal normal 18px/1 "Readex Pro"',
        className: 'text-slate-400'
      }
    }
  }
};

export const axisTheme: IXYChartTheme = {
  colors: schemeCategory10,
  svg: {
    style: { userSelect: 'none' },
    className: 'bg-slate-800'
  },
  smallLabels: {
    font: 'normal normal normal 10px/1 "Readex Pro"',
    className: 'text-slate-200'
  },
  axis: {
    bottom: {
      tickLength: 6,
      tickLabelPadding: 1
    }
  }
};
