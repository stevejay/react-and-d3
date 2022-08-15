import { CurveFactory } from 'd3-shape';
import { isNil } from 'lodash-es';

import { coerceNumber } from './coerceNumber';
import { findNearestDatumX } from './findNearestDatumX';
import { findNearestDatumY } from './findNearestDatumY';
import { findNearestGroupDatum } from './findNearestGroupDatum';
import findNearestStackDatum from './findNearestStackDatum';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { getFirstItem, getSecondItem } from './getItem';
import { getScaleBandwidth } from './getScaleBandwidth';
import { getScaleBaseline } from './getScaleBaseline';
import { getScaledValueFactory } from './getScaledFactoryValue';
import { isValidNumber } from './isValidNumber';
import { measureTextWithCache } from './measureTextWithCache';
import type {
  AxisScale,
  DatumPosition,
  FontProperties,
  IDataEntry,
  InternalBarLabelPosition,
  LabelTransition,
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

  getPositionForDatum(params: {
    datum: Datum;
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
  }) {
    const foundDatum = this._data.find((datum) => datum === params.datum) ?? null;
    if (isNil(foundDatum)) {
      return null;
    }
    const positioner = this.createElementPositionerForRenderingData(params);
    return positioner(foundDatum) ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createShape(shapeFunc: (data: readonly Datum[]) => any) {
    return shapeFunc(this._data);
  }

  getAreaAccessors({
    scales,
    dependent0Accessor
  }: {
    scales: ScaleSet;
    horizontal: boolean;
    curve: CurveFactory;
    renderingOffset: number;
    dependent0Accessor?: (datum: Datum) => ScaleInput<AxisScale>;
  }): {
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
      isValidNumber(scales.independent(this.independentAccessor(datum))) &&
      isValidNumber(scales.dependent(this.dependentAccessor(datum)));
    return {
      independent: getScaledIndependent,
      dependent: getScaledDependent,
      dependent0: getScaledDependent0,
      defined: isDefined
    };
  }

  createElementPositionerForRenderingData({
    scales,
    horizontal
  }: {
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
  }): (datum: Datum) => DatumPosition | null {
    const dependentStartCoord = getScaleBaseline(scales.dependent);
    const independentBandwidth = getScaleBandwidth(scales.independent);
    return (datum: Datum) => {
      const independentStartCoord = coerceNumber(scales.independent(this.independentAccessor(datum)));
      if (!isValidNumber(independentStartCoord)) {
        return null;
      }
      const independentEndCoord = independentStartCoord + independentBandwidth;
      const independentCentreCoord = independentStartCoord + independentBandwidth * 0.5;
      const dependentEndCoord = coerceNumber(scales.dependent(this.dependentAccessor(datum)));
      if (!isValidNumber(dependentEndCoord)) {
        return null;
      }
      return {
        baselineX: horizontal ? dependentStartCoord : independentStartCoord,
        baselineY: horizontal ? independentStartCoord : dependentStartCoord,
        datumX: horizontal ? dependentEndCoord : independentEndCoord,
        datumY: horizontal ? independentEndCoord : dependentEndCoord,
        pointX: horizontal ? dependentEndCoord : independentCentreCoord,
        pointY: horizontal ? independentCentreCoord : dependentEndCoord
      };
    };
  }

  createLabelPositionerForRenderingData({
    scales,
    horizontal,
    font,
    hideOnOverflow,
    padding,
    position,
    positionOutsideOnOverflow
  }: {
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
    font: FontProperties | string;
    position: InternalBarLabelPosition;
    positionOutsideOnOverflow: boolean;
    padding: number;
    hideOnOverflow: boolean;
  }) {
    const dependentStartCoord = getScaleBaseline(scales.dependent);
    const independentBandwidth = getScaleBandwidth(scales.independent);

    return ({ datum, label }: { datum: Datum; label: string }) => {
      const independentStartCoord = coerceNumber(scales.independent(this.independentAccessor(datum)));
      if (!isValidNumber(independentStartCoord)) {
        return null;
      }
      const dependentEndCoord = coerceNumber(scales.dependent(this.dependentAccessor(datum)));
      if (!isValidNumber(dependentEndCoord)) {
        return null;
      }
      const dependentLengthWithSign = dependentEndCoord - dependentStartCoord;
      const isNegative = dependentLengthWithSign > 0;
      const dependentLength = Math.abs(dependentLengthWithSign);
      const textDimension = horizontal
        ? measureTextWithCache(label, font)
        : getFontMetricsWithCache(font).height;

      const isOverflowing = textDimension + padding * 2 > dependentLength;
      const independent = independentStartCoord + independentBandwidth * 0.5;
      let opacity = 1;
      let dependent = 0;

      if (position === 'outside' || (positionOutsideOnOverflow && isOverflowing)) {
        dependent = dependentEndCoord + (textDimension * 0.5 + padding) * (isNegative ? 1 : -1);
      } else {
        if (position === 'inside') {
          dependent = dependentEndCoord + (textDimension * 0.5 + padding) * (isNegative ? -1 : 1);
        } else {
          dependent = dependentEndCoord + dependentLength * 0.5 * (isNegative ? -1 : 1);
        }
        if (hideOnOverflow && isOverflowing) {
          opacity = 0;
        }
      }

      return { x: horizontal ? dependent : independent, y: horizontal ? independent : dependent, opacity };
    };
  }

  getFilteredData(filter: (datum: Datum) => boolean): readonly Datum[] {
    return this._data.filter(filter);
  }

  getMappedData(mapper: (datum: Datum) => ScaleInput<AxisScale>): ScaleInput<AxisScale>[] {
    return this._data.map(mapper);
  }

  findNearestDatum({
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
    const findNearestDatum = horizontal ? findNearestDatumY : findNearestDatumX;
    return findNearestDatum({
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

  getPositionForDatum(params: {
    datum: Datum;
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
  }) {
    const foundDatum = this._data.find((datum) => datum === params.datum) ?? null;
    if (isNil(foundDatum)) {
      return null;
    }
    const positioner = this.createElementPositionerForRenderingData(params);
    return positioner(foundDatum) ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createShape(shapeFunc: (data: readonly Datum[]) => any) {
    return shapeFunc(this._data);
  }

  getAreaAccessors({
    scales,
    dependent0Accessor
  }: {
    scales: ScaleSet;
    horizontal: boolean;
    curve: CurveFactory;
    renderingOffset: number;
    dependent0Accessor?: (datum: Datum) => ScaleInput<AxisScale>;
  }): {
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
      isValidNumber(scales.independent(this.independentAccessor(datum))) &&
      isValidNumber(scales.dependent(this.dependentAccessor(datum)));
    return {
      independent: getScaledIndependent,
      dependent: getScaledDependent,
      dependent0: getScaledDependent0,
      defined: isDefined
    };
  }

  createElementPositionerForRenderingData({
    scales,
    horizontal
  }: {
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
  }): (datum: Datum) => DatumPosition | null {
    const dependentStartCoord = getScaleBaseline(scales.dependent);
    const groupBandwidth = getScaleBandwidth(scales.group[0]);
    const withinGroupPosition = scales.group[0](this.dataKey) ?? 0;

    return (datum: Datum) => {
      const independentStartCoord = coerceNumber(scales.independent(this.independentAccessor(datum)));
      if (!isValidNumber(independentStartCoord)) {
        return null;
      }
      const groupIndependentStartCoord = independentStartCoord + withinGroupPosition;
      const independentEndCoord = groupIndependentStartCoord + groupBandwidth;
      const independentCentreCoord = groupIndependentStartCoord + groupBandwidth * 0.5;
      const dependentEndCoord = coerceNumber(scales.dependent(this.dependentAccessor(datum)));
      if (!isValidNumber(dependentEndCoord)) {
        return null;
      }
      return {
        baselineX: horizontal ? dependentStartCoord : groupIndependentStartCoord,
        baselineY: horizontal ? groupIndependentStartCoord : dependentStartCoord,
        datumX: horizontal ? dependentEndCoord : independentEndCoord,
        datumY: horizontal ? independentEndCoord : dependentEndCoord,
        pointX: horizontal ? dependentEndCoord : independentCentreCoord,
        pointY: horizontal ? independentCentreCoord : dependentEndCoord
      };
    };
  }

  createLabelPositionerForRenderingData({
    scales,
    horizontal,
    font,
    hideOnOverflow,
    padding,
    position,
    positionOutsideOnOverflow
  }: {
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
    font: FontProperties | string;
    position: InternalBarLabelPosition;
    positionOutsideOnOverflow: boolean;
    padding: number;
    hideOnOverflow: boolean;
  }) {
    const dependentStartCoord = getScaleBaseline(scales.dependent);
    const groupBandwidth = getScaleBandwidth(scales.group[0]);
    const withinGroupPosition = scales.group[0](this.dataKey) ?? 0;

    return ({ datum, label }: { datum: Datum; label: string }) => {
      const independentStartCoord = coerceNumber(scales.independent(this.independentAccessor(datum)));
      if (!isValidNumber(independentStartCoord)) {
        return null;
      }
      const dependentEndCoord = coerceNumber(scales.dependent(this.dependentAccessor(datum)));
      if (!isValidNumber(dependentEndCoord)) {
        return null;
      }
      const dependentLengthWithSign = dependentEndCoord - dependentStartCoord;
      const isNegative = dependentLengthWithSign > 0;
      const dependentLength = Math.abs(dependentLengthWithSign);
      const textDimension = horizontal
        ? measureTextWithCache(label, font)
        : getFontMetricsWithCache(font).height;

      const isOverflowing = textDimension + padding * 2 > dependentLength;
      const independent = independentStartCoord + withinGroupPosition + groupBandwidth * 0.5;
      let dependent = 0;
      let opacity = 1;

      if (position === 'outside' || (positionOutsideOnOverflow && isOverflowing)) {
        dependent = dependentEndCoord + (textDimension * 0.5 + padding) * (isNegative ? 1 : -1);
      } else {
        if (position === 'inside') {
          dependent = dependentEndCoord + (textDimension * 0.5 + padding) * (isNegative ? -1 : 1);
        } else {
          dependent = dependentEndCoord + dependentLength * 0.5 * (isNegative ? -1 : 1);
        }
        if (hideOnOverflow && isOverflowing) {
          opacity = 0;
        }
      }

      return { x: horizontal ? dependent : independent, y: horizontal ? independent : dependent, opacity };
    };
  }

  getFilteredData(filter: (datum: Datum) => boolean): readonly Datum[] {
    return this._data.filter(filter);
  }

  getMappedData(mapper: (datum: Datum) => ScaleInput<AxisScale>): ScaleInput<AxisScale>[] {
    return this._data.map(mapper);
  }

  findNearestDatum({
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
      scales.group[0],
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createShape(shapeFunc: (data: readonly StackDatum<AxisScale, AxisScale, Datum>[]) => any) {
    // throw new Error('Not supported for stack data');
    return shapeFunc(this._stackData);
  }

  getAreaAccessors({
    scales
  }: {
    scales: ScaleSet;
    horizontal: boolean;
    curve: CurveFactory;
    renderingOffset: number;
    dependent0Accessor?: (datum: StackDatum<AxisScale, AxisScale, Datum>) => ScaleInput<AxisScale>;
  }): {
    independent: (datum: StackDatum<AxisScale, AxisScale, Datum>) => number;
    dependent: (datum: StackDatum<AxisScale, AxisScale, Datum>) => number;
    dependent0: number | ((datum: StackDatum<AxisScale, AxisScale, Datum>) => number);
    defined: (datum: StackDatum<AxisScale, AxisScale, Datum>) => boolean;
  } {
    const getScaledIndependent = getScaledValueFactory<AxisScale, StackDatum<AxisScale, AxisScale, Datum>>(
      scales.independent,
      getStack
    );
    const getScaledDependent = getScaledValueFactory(scales.dependent, getFirstItem);
    const getScaledDependent0 = getScaledValueFactory(scales.dependent, getSecondItem);
    const isDefined = (datum: StackDatum<AxisScale, AxisScale, Datum>) =>
      isValidNumber(scales.independent(getStack(datum))) &&
      isValidNumber(scales.dependent(getSecondItem(datum)));
    return {
      independent: getScaledIndependent,
      dependent: getScaledDependent,
      dependent0: getScaledDependent0,
      defined: isDefined
    };
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

  getPositionForDatum(params: {
    datum: Datum;
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
  }) {
    const foundDatum =
      this._stackData.find((datum) => getOriginalDatumFromStackDatum(datum) === params.datum) ?? null;
    if (isNil(foundDatum)) {
      return null;
    }
    const positioner = this.createElementPositionerForRenderingData(params);
    return positioner(foundDatum) ?? null;
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

  // createRectPositionerForRenderingData ?
  createElementPositionerForRenderingData({
    scales,
    horizontal
  }: {
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
  }): (datum: StackDatum<AxisScale, AxisScale, Datum>) => DatumPosition | null {
    const independentBandwidth = getScaleBandwidth(scales.independent);
    return (datum) => {
      const independentStartCoord = coerceNumber(scales.independent(getStack(datum)));
      if (!isValidNumber(independentStartCoord)) {
        return null;
      }
      const independentEndCoord = independentStartCoord + independentBandwidth;
      const independentCentreCoord = independentStartCoord + independentBandwidth * 0.5;
      const dependentStartCoord = coerceNumber(scales.dependent(getFirstItem(datum)));
      if (!isValidNumber(dependentStartCoord)) {
        return null;
      }
      const dependentEndCoord = coerceNumber(scales.dependent(getSecondItem(datum)));
      if (!isValidNumber(dependentEndCoord)) {
        return null;
      }
      return {
        baselineX: horizontal ? dependentStartCoord : independentStartCoord,
        baselineY: horizontal ? independentStartCoord : dependentStartCoord,
        datumX: horizontal ? dependentEndCoord : independentEndCoord,
        datumY: horizontal ? independentEndCoord : dependentEndCoord,
        pointX: horizontal ? dependentEndCoord : independentCentreCoord,
        pointY: horizontal ? independentCentreCoord : dependentEndCoord
      };
    };
  }

  createLabelPositionerForRenderingData({
    scales,
    horizontal,
    font,
    hideOnOverflow,
    padding
  }: {
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
    font: FontProperties | string;
    position: InternalBarLabelPosition; // Ignored: always inside-centered.
    positionOutsideOnOverflow: boolean; // Ignored: no change of position on overflow.
    padding: number;
    hideOnOverflow: boolean;
  }): (datumWithLabel: {
    datum: StackDatum<AxisScale, AxisScale, Datum>;
    label: string;
  }) => LabelTransition | null {
    const independentBandwidth = getScaleBandwidth(scales.independent);

    return ({ datum, label }: { datum: StackDatum<AxisScale, AxisScale, Datum>; label: string }) => {
      const independentStartCoord = coerceNumber(scales.independent(getStack(datum)));
      if (!isValidNumber(independentStartCoord)) {
        return null;
      }
      const dependentStartCoord = coerceNumber(scales.dependent(getFirstItem(datum)));
      if (!isValidNumber(dependentStartCoord)) {
        return null;
      }
      const dependentEndCoord = coerceNumber(scales.dependent(getSecondItem(datum)));
      if (!isValidNumber(dependentEndCoord)) {
        return null;
      }

      const dependentLengthWithSign = dependentEndCoord - dependentStartCoord;
      const dependentLength = Math.abs(dependentLengthWithSign);
      const isNegative = dependentLengthWithSign > 0;
      const textDimension = horizontal
        ? measureTextWithCache(label, font)
        : getFontMetricsWithCache(font).height;

      const independent = independentStartCoord + independentBandwidth * 0.5;
      const dependent = dependentEndCoord + dependentLength * 0.5 * (isNegative ? -1 : 1);
      const opacity = hideOnOverflow && textDimension + padding * 2 > dependentLength ? 0 : 1;
      return { x: horizontal ? dependent : independent, y: horizontal ? independent : dependent, opacity };
    };
  }

  getFilteredData(filter: (datum: Datum) => boolean): readonly Datum[] {
    return this._originalData.filter(filter);
  }

  getMappedData(mapper: (datum: Datum) => ScaleInput<AxisScale>): ScaleInput<AxisScale>[] {
    return this._originalData.map(mapper);
  }

  findNearestDatum({
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
