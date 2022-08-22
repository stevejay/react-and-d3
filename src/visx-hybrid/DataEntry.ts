import { createBarPositionerForRenderingData } from './createBarPositionerForRenderingData';
import { findNearestDatumX } from './findNearestDatumX';
import { findNearestDatumY } from './findNearestDatumY';
import { findNearestGroupDatum } from './findNearestGroupDatum';
import { findNearestStackDatum } from './findNearestStackDatum';
import { getFirstItem, getSecondItem } from './getItem';
import { getScaleBandwidth } from './getScaleBandwidth';
import { getScaleBaseline } from './getScaleBaseline';
import { getScaledValueFactory } from './getScaledFactoryValue';
import { isDefined } from './isDefined';
import { isNil } from './isNil';
import type {
  AxisScale,
  DatumPosition,
  IDataEntry,
  IScaleSet,
  NearestDatumReturnType,
  Point,
  ScaleInput,
  StackDatum
} from './types';

export class SimpleDataEntry<Datum extends object> implements IDataEntry<Datum, Datum> {
  private _dataKey: string;
  private _data: readonly Datum[];
  private _independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  private _dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  private _usesAlternateDependent: boolean;
  private _keyAccessor: (datum: Datum) => string | number;
  private _colorAccessor: (datum: Datum, dataKey: string) => string;

  constructor({
    dataKey,
    data,
    independentAccessor,
    dependentAccessor,
    usesAlternateDependent,
    colorAccessor,
    keyAccessor
  }: {
    dataKey: string;
    data: readonly Datum[];
    independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
    dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
    usesAlternateDependent: boolean;
    colorAccessor: (datum: Datum, dataKey: string) => string;
    keyAccessor?: (datum: Datum) => string | number;
  }) {
    this._dataKey = dataKey;
    this._data = data;
    this._independentAccessor = independentAccessor;
    this._dependentAccessor = dependentAccessor;
    this._usesAlternateDependent = usesAlternateDependent;
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

  isRenderingDatumDefined(datum: Datum): boolean {
    return !isNil(datum) && !isNil(this.independentAccessor(datum)) && !isNil(this.dependentAccessor(datum));
  }

  isOriginalDatumDefined(datum: Datum): boolean {
    return this.isRenderingDatumDefined(datum);
  }

  getDomainValuesForIndependentScale(): readonly ScaleInput<AxisScale>[] {
    return this._data.map((datum) => this.independentAccessor(datum)).filter(isDefined);
  }

  getDomainValuesForDependentScale(): readonly ScaleInput<AxisScale>[] {
    return this._usesAlternateDependent
      ? []
      : this._data.map((datum) => this.dependentAccessor(datum)).filter(isDefined);
  }

  getDomainValuesForAlternateDependentScale(): readonly ScaleInput<AxisScale>[] {
    return this._usesAlternateDependent
      ? this._data.map((datum) => this.dependentAccessor(datum)).filter(isDefined)
      : [];
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

  getTransitionKey(datum: Datum): string | number {
    return this._keyAccessor(this.getOriginalDatumFromRenderingDatum(datum));
  }

  getOriginalDatumFromRenderingDatum(datum: Datum): Datum {
    return datum;
  }

  getPositionFromOriginalDatum({
    datum,
    scales,
    horizontal
  }: {
    datum: Datum;
    scales: IScaleSet;
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

  getIndependent0Accessor(scales: IScaleSet): (datum: Datum) => number {
    return getScaledValueFactory<AxisScale, Datum>(scales.independent, this.independentAccessor, 'start');
  }

  getIndependent1Accessor(scales: IScaleSet): (datum: Datum) => number {
    return getScaledValueFactory<AxisScale, Datum>(scales.independent, this.independentAccessor, 'end');
  }

  getIndependentCenterAccessor(scales: IScaleSet): (datum: Datum) => number {
    return getScaledValueFactory<AxisScale, Datum>(scales.independent, this.independentAccessor, 'center');
  }

  getDependent0Accessor(
    scales: IScaleSet,
    customAccessor?: (datum: Datum) => ScaleInput<AxisScale>
  ): (datum: Datum) => number {
    const dependentScale = scales.getDependentScale(this._usesAlternateDependent);
    const dependentStartCoord = getScaleBaseline(dependentScale);
    return customAccessor ? getScaledValueFactory(dependentScale, customAccessor) : () => dependentStartCoord;
  }

  getDependent1Accessor(scales: IScaleSet): (datum: Datum) => number {
    const dependentScale = scales.getDependentScale(this._usesAlternateDependent);
    return getScaledValueFactory(dependentScale, this.dependentAccessor);
  }

  getOriginalDataByIndependentValue(value: ScaleInput<AxisScale>): readonly Datum[] {
    return this._data.filter((datum) => this.independentAccessor(datum) === value);
  }

  findNearestOriginalDatumToPoint({
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
    scales: IScaleSet;
  }): NearestDatumReturnType<Datum> | null {
    const dependentScale = scales.getDependentScale(this._usesAlternateDependent);
    const findNearestOriginalDatumToPoint = horizontal ? findNearestDatumY : findNearestDatumX;
    return findNearestOriginalDatumToPoint({
      independentScale: scales.independent,
      independentAccessor: this.independentAccessor,
      dependentScale,
      dependentAccessor: this.dependentAccessor,
      point,
      data: this._data.filter((datum) => isDefined(this.independentAccessor(datum))), // TODO optimise
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
  private _usesAlternateDependent: boolean;
  private _keyAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  private _colorAccessor: (datum: Datum, dataKey: string) => string;

  constructor({
    dataKey,
    data,
    independentAccessor,
    dependentAccessor,
    usesAlternateDependent,
    colorAccessor,
    keyAccessor
  }: {
    dataKey: string;
    data: readonly Datum[];
    independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
    dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
    usesAlternateDependent: boolean;
    colorAccessor: (datum: Datum, dataKey: string) => string;
    keyAccessor?: (datum: Datum) => string | number;
  }) {
    this._dataKey = dataKey;
    this._data = data;
    this._independentAccessor = independentAccessor;
    this._dependentAccessor = dependentAccessor;
    this._usesAlternateDependent = usesAlternateDependent;
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

  isRenderingDatumDefined(datum: Datum): boolean {
    return !isNil(datum) && !isNil(this.independentAccessor(datum)) && !isNil(this.dependentAccessor(datum));
  }

  isOriginalDatumDefined(datum: Datum): boolean {
    return this.isRenderingDatumDefined(datum);
  }

  getDomainValuesForIndependentScale(): readonly ScaleInput<AxisScale>[] {
    return this._data.map((datum) => this.independentAccessor(datum)).filter(isDefined);
  }

  getDomainValuesForDependentScale(): readonly ScaleInput<AxisScale>[] {
    return this._usesAlternateDependent
      ? []
      : this._data.map((datum) => this.dependentAccessor(datum)).filter(isDefined);
  }

  getDomainValuesForAlternateDependentScale(): readonly ScaleInput<AxisScale>[] {
    return this._usesAlternateDependent
      ? this._data.map((datum) => this.dependentAccessor(datum)).filter(isDefined)
      : [];
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

  getTransitionKey(datum: Datum): string | number {
    return this._keyAccessor(this.getOriginalDatumFromRenderingDatum(datum));
  }

  getOriginalDatumFromRenderingDatum(datum: Datum): Datum {
    return datum;
  }

  getPositionFromOriginalDatum({
    datum,
    scales,
    horizontal
  }: {
    datum: Datum;
    scales: IScaleSet;
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

  getIndependent0Accessor(scales: IScaleSet): (datum: Datum) => number {
    if (!scales.group) {
      throw new Error('Chart has a grouping but the group scale is nil.');
    }
    const withinGroupPosition = scales.group(this.dataKey) ?? 0;
    const independent = getScaledValueFactory<AxisScale, Datum>(
      scales.independent,
      this.independentAccessor,
      'start'
    );
    return (datum: Datum) => independent(datum) + withinGroupPosition;
  }

  getIndependent1Accessor(scales: IScaleSet): (datum: Datum) => number {
    if (!scales.group) {
      throw new Error('Chart has a grouping but the group scale is nil.');
    }
    const withinGroupPosition = scales.group(this.dataKey) ?? 0;
    const independent = getScaledValueFactory<AxisScale, Datum>(
      scales.independent,
      this.independentAccessor,
      'start'
    );
    const groupBandwidth = getScaleBandwidth(scales.group);
    return (datum: Datum) => independent(datum) + withinGroupPosition + groupBandwidth;
  }

  getIndependentCenterAccessor(scales: IScaleSet): (datum: Datum) => number {
    if (!scales.group) {
      throw new Error('Chart has a grouping but the group scale is nil.');
    }
    const withinGroupPosition = scales.group(this.dataKey) ?? 0;
    const independent = getScaledValueFactory<AxisScale, Datum>(
      scales.independent,
      this.independentAccessor,
      'start'
    );
    const groupBandwidth = getScaleBandwidth(scales.group);
    return (datum: Datum) => independent(datum) + withinGroupPosition + groupBandwidth * 0.5;
  }

  getDependent0Accessor(
    scales: IScaleSet,
    customAccessor?: (datum: Datum) => ScaleInput<AxisScale>
  ): (datum: Datum) => number {
    const dependentScale = scales.getDependentScale(this._usesAlternateDependent);
    const dependentStartCoord = getScaleBaseline(dependentScale);
    return customAccessor ? getScaledValueFactory(dependentScale, customAccessor) : () => dependentStartCoord;
  }

  getDependent1Accessor(scales: IScaleSet): (datum: Datum) => number {
    const dependentScale = scales.getDependentScale(this._usesAlternateDependent);
    return getScaledValueFactory(dependentScale, this.dependentAccessor);
  }

  getOriginalDataByIndependentValue(value: ScaleInput<AxisScale>): readonly Datum[] {
    return this._data.filter((datum) => this.independentAccessor(datum) === value);
  }

  findNearestOriginalDatumToPoint({
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
    scales: IScaleSet;
  }): NearestDatumReturnType<Datum> | null {
    if (!scales.group) {
      throw new Error('Chart has a grouping but the group scale is nil.');
    }
    const dependentScale = scales.getDependentScale(this._usesAlternateDependent);
    return findNearestGroupDatum(
      {
        independentScale: scales.independent,
        independentAccessor: this.independentAccessor,
        dependentScale,
        dependentAccessor: this.dependentAccessor,
        point,
        data: this._data.filter((datum) => isDefined(this.independentAccessor(datum))), // TODO optimise
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
  private _usesAlternateDependent: boolean;
  private _keyAccessor: (datum: Datum) => string | number;
  private _colorAccessor: (datum: Datum, dataKey: string) => string;
  private _originalData: readonly Datum[];

  constructor({
    dataKey,
    stackData,
    independentAccessor,
    dependentAccessor,
    usesAlternateDependent,
    colorAccessor,
    keyAccessor
  }: {
    dataKey: string;
    stackData: readonly StackDatum<AxisScale, AxisScale, Datum>[];
    independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
    dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
    usesAlternateDependent: boolean;
    colorAccessor: (datum: Datum, dataKey: string) => string;
    keyAccessor?: (datum: Datum) => string | number;
  }) {
    this._dataKey = dataKey;
    this._originalData = stackData.map(getOriginalDatumFromStackDatum);
    this._stackData = stackData;
    this._independentAccessor = independentAccessor;
    this._dependentAccessor = dependentAccessor;
    this._usesAlternateDependent = usesAlternateDependent;
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

  get colorAccessor() {
    return this._colorAccessor;
  }

  getTransitionKey(datum: StackDatum<AxisScale, AxisScale, Datum>): string | number {
    return this._keyAccessor(this.getOriginalDatumFromRenderingDatum(datum));
  }

  getOriginalDatumFromRenderingDatum(datum: StackDatum<AxisScale, AxisScale, Datum>): Datum {
    return getOriginalDatumFromStackDatum(datum);
  }

  getDomainValuesForIndependentScale(): readonly ScaleInput<AxisScale>[] {
    return this._stackData.map(getStack).filter(isDefined);
  }

  getDomainValuesForDependentScale(): readonly ScaleInput<AxisScale>[] {
    return this._usesAlternateDependent
      ? []
      : this._stackData
          .map((datum) => {
            const first = getFirstItem(datum);
            const second = getSecondItem(datum);
            return isNil(first) || isNil(second) ? null : [first, second];
          })
          .filter(isDefined)
          .reduce((acc, val) => acc.concat(val), []);
  }

  getDomainValuesForAlternateDependentScale(): readonly ScaleInput<AxisScale>[] {
    return this._usesAlternateDependent
      ? this._stackData
          .map((datum) => {
            const first = getFirstItem(datum);
            const second = getSecondItem(datum);
            return isNil(first) || isNil(second) ? null : [first, second];
          })
          .filter(isDefined)
          .reduce((acc, val) => acc.concat(val), [])
      : [];
  }

  getPositionFromOriginalDatum({
    datum,
    scales,
    horizontal
  }: {
    datum: Datum;
    scales: IScaleSet;
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

  isRenderingDatumDefined(datum: StackDatum<AxisScale, AxisScale, Datum>): boolean {
    return !isNil(datum) && !isNil(getStack(datum)) && !isNil(getSecondItem(datum));
  }

  isOriginalDatumDefined(datum: Datum): boolean {
    return !isNil(datum) && !isNil(this.independentAccessor(datum)) && !isNil(this.dependentAccessor(datum));
  }

  getIndependent0Accessor(scales: IScaleSet): (datum: StackDatum<AxisScale, AxisScale, Datum>) => number {
    return getScaledValueFactory<AxisScale, StackDatum<AxisScale, AxisScale, Datum>>(
      scales.independent,
      getStack,
      'start'
    );
  }

  getIndependent1Accessor(scales: IScaleSet): (datum: StackDatum<AxisScale, AxisScale, Datum>) => number {
    return getScaledValueFactory<AxisScale, StackDatum<AxisScale, AxisScale, Datum>>(
      scales.independent,
      getStack,
      'end'
    );
  }

  getIndependentCenterAccessor(
    scales: IScaleSet
  ): (datum: StackDatum<AxisScale, AxisScale, Datum>) => number {
    return getScaledValueFactory<AxisScale, StackDatum<AxisScale, AxisScale, Datum>>(
      scales.independent,
      getStack,
      'center'
    );
  }

  getDependent0Accessor(
    scales: IScaleSet,
    _customAccessor?: (datum: StackDatum<AxisScale, AxisScale, Datum>) => ScaleInput<AxisScale>
  ): (datum: StackDatum<AxisScale, AxisScale, Datum>) => number {
    const dependentScale = scales.getDependentScale(this._usesAlternateDependent);
    return getScaledValueFactory(dependentScale, getFirstItem);
  }

  getDependent1Accessor(scales: IScaleSet): (datum: StackDatum<AxisScale, AxisScale, Datum>) => number {
    const dependentScale = scales.getDependentScale(this._usesAlternateDependent);
    return getScaledValueFactory(dependentScale, getSecondItem);
  }

  getOriginalDataByIndependentValue(value: ScaleInput<AxisScale>): readonly Datum[] {
    return this._originalData.filter((datum) => this.independentAccessor(datum) === value);
  }

  findNearestOriginalDatumToPoint({
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
    scales: IScaleSet;
  }): NearestDatumReturnType<Datum> | null {
    const dependentScale = scales.getDependentScale(this._usesAlternateDependent);
    return findNearestStackDatum(
      {
        independentScale: scales.independent,
        independentAccessor: getStack,
        dependentScale,
        dependentAccessor: getNumericValue,
        point,
        data: this._stackData.filter((datum) => isDefined(getStack(datum))), // TODO optimise
        width,
        height,
        dataKey: this.dataKey
      },
      this._originalData,
      horizontal
    );
  }
}
