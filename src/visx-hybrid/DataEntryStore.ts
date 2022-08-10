import { isNil } from 'lodash-es';

import type { IDataEntry, IDataEntryStore } from './types';

export class DataEntryStore implements IDataEntryStore {
  private _dataEntries: Map<string, IDataEntry>;
  private _dataKeys: readonly string[];

  constructor(dataEntries: readonly IDataEntry[]) {
    this._dataEntries = new Map<string, IDataEntry>(
      dataEntries.map((dataEntry) => [dataEntry.dataKey, dataEntry])
    );
    this._dataKeys = [...this._dataEntries.keys()];
    if (dataEntries.length !== this._dataKeys.length) {
      // TODO better error message
      throw new Error('Duplicate dataKey found in chart.');
    }
  }

  getByDataKey(dataKey: string): IDataEntry {
    const value = this.tryGetByDataKey(dataKey);
    if (isNil(value)) {
      throw new Error(`Could not find data for dataKey '${dataKey}'`);
    }
    return value;
  }

  tryGetByDataKey(dataKey: string): IDataEntry | null {
    return this._dataEntries.get(dataKey) ?? null;
  }

  getAllDataKeys(): readonly string[] {
    return this._dataKeys;
  }
}
