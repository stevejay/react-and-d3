import { useContext } from 'react';
import { isNil } from 'lodash-es';

import { DataContext } from './DataContext';

export function useDataContext() {
  const value = useContext(DataContext);
  if (isNil(value)) {
    throw new Error('No data context found');
  }
  return value;
}
