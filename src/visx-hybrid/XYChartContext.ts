import { createContext } from 'react';

import type { IXYChartContext } from './types';

export const XYChartContext = createContext<IXYChartContext | null>(null);
