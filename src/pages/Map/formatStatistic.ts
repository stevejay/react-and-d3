import { format } from 'd3-format';

import { Statistic } from './types';

export function formatStatistic(value: number, statistic: Statistic) {
  switch (statistic) {
    case 'count':
      return format(',d')(value);
    default:
      return format('.1%')(value * 0.01);
  }
}
