import { createContext } from 'react';

import type { XYChartContextType } from './types';

export const XYChartContext = createContext<XYChartContextType | null>(null);
