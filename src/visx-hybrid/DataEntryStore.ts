import { isNil } from 'lodash-es';

import type { IDataEntryStore, IDatumEntry } from './types';

export class DataEntryStore implements IDataEntryStore {
  private _dataEntries: Map<string, IDatumEntry>;

  constructor(dataEntries: readonly IDatumEntry[]) {
    this._dataEntries = new Map<string, IDatumEntry>(
      dataEntries.map((dataEntry) => [dataEntry.dataKey, dataEntry])
    );
  }

  getByDataKey(dataKey: string): IDatumEntry {
    const value = this.tryGetByDataKey(dataKey);
    if (isNil(value)) {
      throw new Error(`Could not find data for dataKey '${dataKey}'`);
    }
    return value;
  }

  tryGetByDataKey(dataKey: string): IDatumEntry | null {
    return this._dataEntries.get(dataKey) ?? null;
  }
}
