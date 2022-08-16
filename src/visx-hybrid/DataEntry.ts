import { isNil } from 'lodash-es';

import { createBarPositionerForRenderingData } from './createBarPositionerForRenderingData';
import { findNearestDatumX } from './findNearestDatumX';
import { findNearestDatumY } from './findNearestDatumY';
import { findNearestGroupDatum } from './findNearestGroupDatum';
import { findNearestStackDatum } from './findNearestStackDatum';
import { getFirstItem, getSecondItem } from './getItem';
import { getScaleBandwidth } from './getScaleBandwidth';
import { getScaleBaseline } from './getScaleBaseline';
import { getScaledValueFactory } from './getScaledFactoryValue';
import { isValidNumber } from './isValidNumber';
import type {
  AxisScale,
  DatumPosition,
  IDataEntry,
  NearestDatumReturnType,
  Point,
  ScaleInput,
  ScaleSet,
  StackDatum
} from './types';

export class SimpleDataEntry<Datum extends object> implements IDataEntry<Datum, Datum> {
  private _dataKey: string;
  private _data: readonly Datum[];
  private _independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  private _dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  private _keyAccessor: (datum: Datum) => string | number;
  private _colorAccessor: (datum: Datum, dataKey: string) => string;

  constructor(
    dataKey: string,
    data: readonly Datum[],
    independentAccessor: (datum: Datum) => ScaleInput<AxisScale>,
    dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>,
    colorAccessor: (datum: Datum, dataKey: string) => string,
    keyAccessor?: (datum: Datum) => string | number
  ) {
    this._dataKey = dataKey;
    this._data = data;
    this._independentAccessor = independentAccessor;
    this._dependentAccessor = dependentAccessor;
    this._keyAccessor = keyAccessor ?? independentAccessor;
    this._colorAccessor = colorAccessor;
  }

  get dataKey() {
    return this._dataKey;
  }

  getOriginalData(): readonly Datum[] {
    return this._data;
  }

  getRenderingData(): readonly Datum[] {
    return this._data;
  }

  getRenderingDataWithLabels(labelFormatter?: (value: ScaleInput<AxisScale>) => string): readonly {
    datum: Datum;
    label: string;
  }[] {
    return this.getRenderingData().map((datum) => {
      const value = this.dependentAccessor(datum);
      return { datum, label: labelFormatter?.(value) ?? `${value}` };
    });
  }

  getDomainValuesForIndependentScale(): readonly ScaleInput<AxisScale>[] {
    return this._data.map((datum) => this.independentAccessor(datum));
  }

  getDomainValuesForDependentScale(): readonly ScaleInput<AxisScale>[] {
    return this._data.map((datum) => this.dependentAccessor(datum));
  }

  get keyAccessor() {
    return this._keyAccessor;
  }

  get colorAccessor() {
    return this._colorAccessor;
  }

  get independentAccessor() {
    return this._independentAccessor;
  }

  get dependentAccessor() {
    return this._dependentAccessor;
  }

  getOriginalDatumFromRenderingDatum(datum: Datum): Datum {
    return datum;
  }

  getPositionForOriginalDatum({
    datum,
    scales,
    horizontal
  }: {
    datum: Datum;
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
  }) {
    const foundDatum = this._data.find((originalDatum) => originalDatum === datum) ?? null;
    if (isNil(foundDatum)) {
      return null;
    }
    const position: (datum: Datum) => DatumPosition | null = createBarPositionerForRenderingData(
      scales,
      this,
      horizontal
    );
    return position(foundDatum) ?? null;
  }

  getAreaAccessorsForRenderingData(
    scales: ScaleSet,
    dependent0Accessor?: (datum: Datum) => ScaleInput<AxisScale>
  ): {
    independent: (datum: Datum) => number;
    dependent: (datum: Datum) => number;
    dependent0: number | ((datum: Datum) => number);
    defined: (datum: Datum) => boolean;
  } {
    const getScaledIndependent = getScaledValueFactory(scales.independent, this.independentAccessor);
    const getScaledDependent = getScaledValueFactory(scales.dependent, this.dependentAccessor);
    const getScaledDependent0 = dependent0Accessor
      ? getScaledValueFactory(scales.dependent, dependent0Accessor)
      : getScaleBaseline(scales.dependent);
    const isDefined = (datum: Datum) =>
      isValidNumber(getScaledIndependent(datum)) && isValidNumber(getScaledDependent(datum));
    // isValidNumber(scales.independent(this.independentAccessor(datum))) &&
    // isValidNumber(scales.dependent(this.dependentAccessor(datum)));
    return {
      independent: getScaledIndependent,
      dependent: getScaledDependent,
      dependent0: getScaledDependent0,
      defined: isDefined
    };
  }

  getBarAccessorsForRenderingData(scales: ScaleSet): {
    independent0: (datum: Datum) => number;
    independent: (datum: Datum) => number;
    dependent0: (datum: Datum) => number;
    dependent1: (datum: Datum) => number;
  } {
    const dependentStartCoord = getScaleBaseline(scales.dependent);
    return {
      independent0: getScaledValueFactory<AxisScale, Datum>(
        scales.independent,
        this.independentAccessor,
        'start'
      ),
      independent: getScaledValueFactory<AxisScale, Datum>(
        scales.independent,
        this.independentAccessor,
        'end'
      ),
      dependent0: () => dependentStartCoord,
      dependent1: getScaledValueFactory(scales.dependent, this.dependentAccessor)
    };
  }

  getOriginalDataByIndependentValue(value: ScaleInput<AxisScale>): readonly Datum[] {
    return this._data.filter((datum) => this.independentAccessor(datum) === value);
  }

  getMappedData(mapper: (datum: Datum) => ScaleInput<AxisScale>): ScaleInput<AxisScale>[] {
    return this._data.map(mapper);
  }

  findNearestOriginalDatum({
    horizontal,
    scales,
    point,
    width,
    height
  }: {
    horizontal: boolean;
    width: number;
    height: number;
    point: Point;
    scales: ScaleSet;
  }): NearestDatumReturnType<Datum> | null {
    const findNearestOriginalDatum = horizontal ? findNearestDatumY : findNearestDatumX;
    return findNearestOriginalDatum({
      independentScale: scales.independent,
      independentAccessor: this.independentAccessor,
      dependentScale: scales.dependent,
      dependentAccessor: this.dependentAccessor,
      point,
      data: this._data,
      width,
      height,
      dataKey: this.dataKey
    });
  }
}

export class GroupDataEntry<Datum extends object> implements IDataEntry<Datum, Datum> {
  private _dataKey: string;
  private _data: readonly Datum[];
  private _independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  private _dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  private _keyAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  private _colorAccessor: (datum: Datum, dataKey: string) => string;

  constructor(
    dataKey: string,
    data: readonly Datum[],
    independentAccessor: (datum: Datum) => ScaleInput<AxisScale>,
    dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>,
    colorAccessor: (datum: Datum, dataKey: string) => string,
    keyAccessor?: (datum: Datum) => string | number
  ) {
    this._dataKey = dataKey;
    this._data = data;
    this._independentAccessor = independentAccessor;
    this._dependentAccessor = dependentAccessor;
    this._keyAccessor = keyAccessor ?? independentAccessor;
    this._colorAccessor = colorAccessor;
  }

  get dataKey(): string {
    return this._dataKey;
  }

  getOriginalData(): readonly Datum[] {
    return this._data;
  }

  getRenderingData(): readonly Datum[] {
    return this._data;
  }

  getRenderingDataWithLabels(labelFormatter?: (value: ScaleInput<AxisScale>) => string): readonly {
    datum: Datum;
    label: string;
  }[] {
    return this.getRenderingData().map((datum) => {
      const value = this.dependentAccessor(datum);
      return { datum, label: labelFormatter?.(value) ?? `${value}` };
    });
  }

  getDomainValuesForIndependentScale(): readonly ScaleInput<AxisScale>[] {
    return this._data.map((datum) => this.independentAccessor(datum));
  }

  getDomainValuesForDependentScale(): readonly ScaleInput<AxisScale>[] {
    return this._data.map((datum) => this.dependentAccessor(datum));
  }

  get keyAccessor() {
    return this._keyAccessor;
  }

  get colorAccessor() {
    return this._colorAccessor;
  }

  get independentAccessor() {
    return this._independentAccessor;
  }

  get dependentAccessor() {
    return this._dependentAccessor;
  }

  getOriginalDatumFromRenderingDatum(datum: Datum): Datum {
    return datum;
  }

  getPositionForOriginalDatum({
    datum,
    scales,
    horizontal
  }: {
    datum: Datum;
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
  }) {
    const foundDatum = this._data.find((originalDatum) => originalDatum === datum) ?? null;
    if (isNil(foundDatum)) {
      return null;
    }
    const position: (datum: Datum) => DatumPosition | null = createBarPositionerForRenderingData(
      scales,
      this,
      horizontal
    );
    return position(foundDatum) ?? null;
  }

  getAreaAccessorsForRenderingData(
    scales: ScaleSet,
    dependent0Accessor?: (datum: Datum) => ScaleInput<AxisScale>
  ): {
    independent: (datum: Datum) => number;
    dependent: (datum: Datum) => number;
    dependent0: number | ((datum: Datum) => number);
    defined: (datum: Datum) => boolean;
  } {
    const getScaledIndependent = getScaledValueFactory(scales.independent, this.independentAccessor);
    const getScaledDependent = getScaledValueFactory(scales.dependent, this.dependentAccessor);
    const getScaledDependent0 = dependent0Accessor
      ? getScaledValueFactory(scales.dependent, dependent0Accessor)
      : getScaleBaseline(scales.dependent);
    const isDefined = (datum: Datum) =>
      isValidNumber(getScaledIndependent(datum)) && isValidNumber(getScaledDependent(datum));
    return {
      independent: getScaledIndependent,
      dependent: getScaledDependent,
      dependent0: getScaledDependent0,
      defined: isDefined
    };
  }

  getBarAccessorsForRenderingData(scales: ScaleSet): {
    independent0: (datum: Datum) => number;
    independent: (datum: Datum) => number;
    dependent0: (datum: Datum) => number;
    dependent1: (datum: Datum) => number;
  } {
    if (!scales.group) {
      throw new Error('Chart has a grouping but the group scale is nil.');
    }
    const dependentStartCoord = getScaleBaseline(scales.dependent);
    const withinGroupPosition = scales.group(this.dataKey) ?? 0;
    const groupBandwidth = getScaleBandwidth(scales.group);
    const independent = getScaledValueFactory<AxisScale, Datum>(
      scales.independent,
      this.independentAccessor,
      'start'
    );
    return {
      independent0: (datum: Datum) => independent(datum) + withinGroupPosition,
      independent: (datum: Datum) => independent(datum) + withinGroupPosition + groupBandwidth,
      dependent0: () => dependentStartCoord,
      dependent1: getScaledValueFactory(scales.dependent, this.dependentAccessor)
    };
  }

  getOriginalDataByIndependentValue(value: ScaleInput<AxisScale>): readonly Datum[] {
    return this._data.filter((datum) => this.independentAccessor(datum) === value);
  }

  getMappedData(mapper: (datum: Datum) => ScaleInput<AxisScale>): ScaleInput<AxisScale>[] {
    return this._data.map(mapper);
  }

  findNearestOriginalDatum({
    horizontal,
    scales,
    point,
    width,
    height
  }: {
    horizontal: boolean;
    width: number;
    height: number;
    point: Point;
    scales: ScaleSet;
  }): NearestDatumReturnType<Datum> | null {
    if (!scales.group) {
      throw new Error('Chart has a grouping but the group scale is nil.');
    }
    return findNearestGroupDatum(
      {
        independentScale: scales.independent,
        independentAccessor: this.independentAccessor,
        dependentScale: scales.dependent,
        dependentAccessor: this.dependentAccessor,
        point,
        data: this._data,
        width,
        height,
        dataKey: this.dataKey
      },
      scales.group,
      horizontal
    );
  }
}

function getStack<IndependentScale extends AxisScale, DependentScale extends AxisScale, Datum extends object>(
  datum: StackDatum<IndependentScale, DependentScale, Datum>
) {
  return datum?.data?.stack;
}

// returns average of top + bottom of bar (the middle) as this enables more accurately
// finding the nearest datum to a FocusEvent (which is based on the middle of the rect bounding box)
function getNumericValue<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(bar: StackDatum<IndependentScale, DependentScale, Datum>) {
  return (getFirstItem(bar) + getSecondItem(bar)) / 2;
}

function getOriginalDatumFromStackDatum<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(datum: StackDatum<IndependentScale, DependentScale, Datum>): Datum {
  return datum.data.__datum__;
}

export class StackDataEntry<Datum extends object>
  implements IDataEntry<Datum, StackDatum<AxisScale, AxisScale, Datum>>
{
  private _dataKey: string;
  private _stackData: readonly StackDatum<AxisScale, AxisScale, Datum>[];
  private _independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  private _dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  private _keyAccessor: (datum: Datum) => string | number;
  private _colorAccessor: (datum: Datum, dataKey: string) => string;
  private _originalData: readonly Datum[];

  constructor(
    dataKey: string,
    stackData: readonly StackDatum<AxisScale, AxisScale, Datum>[],
    independentAccessor: (datum: Datum) => ScaleInput<AxisScale>,
    dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>,
    colorAccessor: (datum: Datum, dataKey: string) => string,
    keyAccessor?: (datum: Datum) => string | number
  ) {
    this._dataKey = dataKey;
    this._originalData = stackData.map(getOriginalDatumFromStackDatum);
    this._stackData = stackData;
    this._independentAccessor = independentAccessor;
    this._dependentAccessor = dependentAccessor;
    this._keyAccessor = keyAccessor ?? independentAccessor;
    this._colorAccessor = colorAccessor;
  }

  get dataKey(): string {
    return this._dataKey;
  }

  get independentAccessor() {
    return this._independentAccessor;
  }

  get dependentAccessor() {
    return this._dependentAccessor;
  }

  get keyAccessor() {
    return this._keyAccessor;
  }

  get colorAccessor() {
    return this._colorAccessor;
  }

  getOriginalDatumFromRenderingDatum(datum: StackDatum<AxisScale, AxisScale, Datum>): Datum {
    return getOriginalDatumFromStackDatum(datum);
  }

  getDomainValuesForIndependentScale(): readonly ScaleInput<AxisScale>[] {
    return this._stackData.map(getStack);
  }

  getDomainValuesForDependentScale(): readonly ScaleInput<AxisScale>[] {
    return this._stackData.map((datum) => [getFirstItem(datum), getSecondItem(datum)]).flat();
  }

  getPositionForOriginalDatum({
    datum,
    scales,
    horizontal
  }: {
    datum: Datum;
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
  }) {
    const foundDatum =
      this._stackData.find((stackDatum) => getOriginalDatumFromStackDatum(stackDatum) === datum) ?? null;
    if (isNil(foundDatum)) {
      return null;
    }
    const position: (datum: StackDatum<AxisScale, AxisScale, Datum>) => DatumPosition | null =
      createBarPositionerForRenderingData(scales, this, horizontal);
    return position(foundDatum) ?? null;
  }

  getOriginalData(): readonly Datum[] {
    return this._originalData;
  }

  getRenderingData(): readonly StackDatum<AxisScale, AxisScale, Datum>[] {
    return this._stackData;
  }

  getRenderingDataWithLabels(labelFormatter?: (value: ScaleInput<AxisScale>) => string): readonly {
    datum: StackDatum<AxisScale, AxisScale, Datum>;
    label: string;
  }[] {
    return this.getRenderingData().map((datum) => {
      const value = this.dependentAccessor(getOriginalDatumFromStackDatum(datum));
      return { datum, label: labelFormatter?.(value) ?? `${value}` };
    });
  }

  getBarAccessorsForRenderingData(scales: ScaleSet): {
    independent0: (datum: StackDatum<AxisScale, AxisScale, Datum>) => number;
    independent: (datum: StackDatum<AxisScale, AxisScale, Datum>) => number;
    dependent0: (datum: StackDatum<AxisScale, AxisScale, Datum>) => number;
    dependent1: (datum: StackDatum<AxisScale, AxisScale, Datum>) => number;
  } {
    return {
      independent0: getScaledValueFactory<AxisScale, StackDatum<AxisScale, AxisScale, Datum>>(
        scales.independent,
        getStack,
        'start'
      ),
      independent: getScaledValueFactory<AxisScale, StackDatum<AxisScale, AxisScale, Datum>>(
        scales.independent,
        getStack,
        'end'
      ),
      dependent0: getScaledValueFactory(scales.dependent, getFirstItem),
      dependent1: getScaledValueFactory(scales.dependent, getSecondItem)
    };
  }

  getAreaAccessorsForRenderingData(scales: ScaleSet): {
    independent: (datum: StackDatum<AxisScale, AxisScale, Datum>) => number;
    dependent: (datum: StackDatum<AxisScale, AxisScale, Datum>) => number;
    dependent0: number | ((datum: StackDatum<AxisScale, AxisScale, Datum>) => number);
    defined: (datum: StackDatum<AxisScale, AxisScale, Datum>) => boolean;
  } {
    const getScaledIndependent = getScaledValueFactory<AxisScale, StackDatum<AxisScale, AxisScale, Datum>>(
      scales.independent,
      getStack
    );
    const getScaledDependent0 = getScaledValueFactory(scales.dependent, getFirstItem);
    const getScaledDependent = getScaledValueFactory(scales.dependent, getSecondItem);
    const isDefined = (datum: StackDatum<AxisScale, AxisScale, Datum>) =>
      isValidNumber(getScaledIndependent(datum)) && isValidNumber(getScaledDependent(datum));
    return {
      independent: getScaledIndependent,
      dependent0: getScaledDependent0,
      dependent: getScaledDependent,
      defined: isDefined
    };
  }

  getOriginalDataByIndependentValue(value: ScaleInput<AxisScale>): readonly Datum[] {
    return this._originalData.filter((datum) => this.independentAccessor(datum) === value);
  }

  getMappedData(mapper: (datum: Datum) => ScaleInput<AxisScale>): ScaleInput<AxisScale>[] {
    return this._originalData.map(mapper);
  }

  findNearestOriginalDatum({
    point,
    horizontal,
    width,
    height,
    scales
  }: {
    horizontal: boolean;
    width: number;
    height: number;
    point: Point;
    scales: ScaleSet;
  }): NearestDatumReturnType<Datum> | null {
    return findNearestStackDatum(
      {
        independentScale: scales.independent,
        independentAccessor: getStack,
        dependentScale: scales.dependent,
        dependentAccessor: getNumericValue,
        point,
        data: this._stackData,
        width,
        height,
        dataKey: this.dataKey
      },
      this._originalData,
      horizontal
    );
  }
}
