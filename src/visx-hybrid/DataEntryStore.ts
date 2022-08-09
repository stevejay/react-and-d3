import { isNil } from 'lodash-es';

import type { IDataEntryStore, IDatumEntry } from './types';

export class DataEntryStore implements IDataEntryStore {
  private _dataEntries: Map<string, IDatumEntry>;
  private _dataKeys: readonly string[];

  constructor(dataEntries: readonly IDatumEntry[]) {
    this._dataEntries = new Map<string, IDatumEntry>(
      dataEntries.map((dataEntry) => [dataEntry.dataKey, dataEntry])
    );
    this._dataKeys = [...this._dataEntries.keys()];
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

  getAllDataKeys(): readonly string[] {
    return this._dataKeys;
  }
}
