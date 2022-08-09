import { coerceNumber } from './coerceNumber';
import { getFontMetricsWithCache } from './getFontMetricsWithCache';
import { getFirstItem, getSecondItem } from './getItem';
import { getScaleBandwidth } from './getScaleBandwidth';
import { getScaleBaseline } from './getScaleBaseline';
import { isValidNumber } from './isValidNumber';
import { measureTextWithCache } from './measureTextWithCache';
import type {
  AxisScale,
  FontProperties,
  IDatumEntry,
  InternalBarLabelPosition,
  ScaleInput,
  ScaleSet,
  StackDatum
} from './types';

export class SimpleDatumEntry<Datum extends object> implements IDatumEntry {
  private _dataKey: string;
  private _data: readonly Datum[];
  private independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  private dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
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
    this.independentAccessor = independentAccessor;
    this.dependentAccessor = dependentAccessor;
    this._keyAccessor = keyAccessor ?? independentAccessor;
    this._colorAccessor = colorAccessor;
  }

  get dataKey() {
    return this._dataKey;
  }

  get data() {
    return this._data;
  }

  getDataWithDatumLabels(labelFormatter?: (value: ScaleInput<AxisScale>) => string): {
    datum: Datum;
    label: string;
  }[] {
    return this.data.map((datum) => {
      const value = this.dependentAccessor(datum);
      return { datum, label: labelFormatter?.(value) ?? `${value}` };
    });
  }

  getIndependentDomainValues(): readonly ScaleInput<AxisScale>[] {
    return this.data.map((datum) => this.independentAccessor(datum));
  }

  getDependentDomainValues(): readonly ScaleInput<AxisScale>[] {
    return this.data.map((datum) => this.dependentAccessor(datum));
  }

  get keyAccessor() {
    return this._keyAccessor;
  }

  get colorAccessor() {
    return this._colorAccessor;
  }

  findDatumForPositioner(datum: Datum): Datum | null {
    return this.data.find((d) => d === datum) ?? null;
  }

  createDatumPositioner({
    scales,
    horizontal
  }: {
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
  }): (datum: Datum) => {
    baselineX: number;
    baselineY: number;
    datumX: number;
    datumY: number;
  } | null {
    const dependentStartCoord = getScaleBaseline(scales.dependent);
    const independentBandwidth = getScaleBandwidth(scales.independent);
    return (datum: Datum) => {
      const independentStartCoord = coerceNumber(scales.independent(this.independentAccessor(datum)));
      if (!isValidNumber(independentStartCoord)) {
        return null;
      }
      const independentEndCoord = independentStartCoord + independentBandwidth;
      const dependentEndCoord = coerceNumber(scales.dependent(this.dependentAccessor(datum)));
      if (!isValidNumber(dependentEndCoord)) {
        return null;
      }
      return {
        baselineX: horizontal ? dependentStartCoord : independentStartCoord,
        baselineY: horizontal ? independentStartCoord : dependentStartCoord,
        datumX: horizontal ? dependentEndCoord : independentEndCoord,
        datumY: horizontal ? independentEndCoord : dependentEndCoord
      };
    };
  }

  createDatumLabelPositioner({
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

  getMatchingDataForA11ySeries(independentDomainValue: ScaleInput<AxisScale>): readonly Datum[] {
    return this._data.filter((datum) => this.independentAccessor(datum) === independentDomainValue);
  }
}

export class GroupDatumEntry<Datum extends object> implements IDatumEntry {
  private _dataKey: string;
  private _data: readonly Datum[];
  private independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  private dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
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
    this.independentAccessor = independentAccessor;
    this.dependentAccessor = dependentAccessor;
    this._keyAccessor = keyAccessor ?? independentAccessor;
    this._colorAccessor = colorAccessor;
  }

  get dataKey(): string {
    return this._dataKey;
  }

  get data(): readonly Datum[] {
    return this._data;
  }

  getDataWithDatumLabels(labelFormatter?: (value: ScaleInput<AxisScale>) => string): {
    datum: Datum;
    label: string;
  }[] {
    return this.data.map((datum) => {
      const value = this.dependentAccessor(datum);
      return { datum, label: labelFormatter?.(value) ?? `${value}` };
    });
  }

  getIndependentDomainValues(): readonly ScaleInput<AxisScale>[] {
    return this.data.map((datum) => this.independentAccessor(datum));
  }

  getDependentDomainValues(): readonly ScaleInput<AxisScale>[] {
    return this.data.map((datum) => this.dependentAccessor(datum));
  }

  get keyAccessor() {
    return this._keyAccessor;
  }

  get colorAccessor() {
    return this._colorAccessor;
  }

  findDatumForPositioner(datum: Datum): Datum | null {
    return this.data.find((d) => d === datum) ?? null;
  }

  createDatumPositioner({
    scales,
    horizontal
  }: {
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
  }): (datum: Datum) => {
    baselineX: number;
    baselineY: number;
    datumX: number;
    datumY: number;
  } | null {
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
      const dependentEndCoord = coerceNumber(scales.dependent(this.dependentAccessor(datum)));
      if (!isValidNumber(dependentEndCoord)) {
        return null;
      }
      return {
        baselineX: horizontal ? dependentStartCoord : groupIndependentStartCoord,
        baselineY: horizontal ? groupIndependentStartCoord : dependentStartCoord,
        datumX: horizontal ? dependentEndCoord : independentEndCoord,
        datumY: horizontal ? independentEndCoord : dependentEndCoord
      };
    };
  }

  createDatumLabelPositioner({
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

  getMatchingDataForA11ySeries(independentDomainValue: ScaleInput<AxisScale>): readonly Datum[] {
    return this._data.filter((datum) => this.independentAccessor(datum) === independentDomainValue);
  }
}

const getStack = <IndependentScale extends AxisScale, DependentScale extends AxisScale, Datum extends object>(
  datum: StackDatum<IndependentScale, DependentScale, Datum>
) => datum?.data?.stack;

function getStackOriginalDatum<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(datum: StackDatum<IndependentScale, DependentScale, Datum>): Datum {
  return datum.data.__datum__;
}

export class StackDatumEntry<Datum extends object> implements IDatumEntry {
  private _dataKey: string;
  private _data: readonly StackDatum<AxisScale, AxisScale, Datum>[];
  private independentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  private dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>;
  private _keyAccessor: (datum: Datum) => string | number;
  private _colorAccessor: (datum: Datum, dataKey: string) => string;

  constructor(
    dataKey: string,
    data: readonly StackDatum<AxisScale, AxisScale, Datum>[],
    independentAccessor: (datum: Datum) => ScaleInput<AxisScale>,
    dependentAccessor: (datum: Datum) => ScaleInput<AxisScale>,
    colorAccessor: (datum: Datum, dataKey: string) => string,
    keyAccessor?: (datum: Datum) => string | number
  ) {
    this._dataKey = dataKey;
    this._data = data;
    this.independentAccessor = independentAccessor;
    this.dependentAccessor = dependentAccessor;
    this._keyAccessor = keyAccessor ?? independentAccessor;
    this._colorAccessor = colorAccessor;
  }

  get dataKey(): string {
    return this._dataKey;
  }

  get data(): readonly StackDatum<AxisScale, AxisScale, Datum>[] {
    return this._data;
  }

  getDataWithDatumLabels(labelFormatter?: (value: ScaleInput<AxisScale>) => string): {
    datum: StackDatum<AxisScale, AxisScale, Datum>;
    label: string;
  }[] {
    return this.data.map((datum) => {
      const value = this.dependentAccessor(getStackOriginalDatum(datum));
      return { datum, label: labelFormatter?.(value) ?? `${value}` };
    });
  }

  getIndependentDomainValues(): readonly ScaleInput<AxisScale>[] {
    return this.data.map((datum) => getStack(datum));
  }

  getDependentDomainValues(): readonly ScaleInput<AxisScale>[] {
    return this.data.map((datum) => [getFirstItem(datum), getSecondItem(datum)]).flat();
  }

  getColorAccessor() {
    return this.colorAccessor;
  }

  get keyAccessor() {
    return (datum: StackDatum<AxisScale, AxisScale, Datum>) =>
      this._keyAccessor(getStackOriginalDatum(datum));
  }

  get colorAccessor() {
    return this._colorAccessor;
  }

  findDatumForPositioner(datum: Datum): StackDatum<AxisScale, AxisScale, Datum> | null {
    return this.data.find((d) => getStackOriginalDatum(d) === datum) ?? null;
  }

  createDatumPositioner({
    scales,
    horizontal
  }: {
    scales: ScaleSet;
    horizontal: boolean;
    renderingOffset: number;
  }): (datum: StackDatum<AxisScale, AxisScale, Datum>) => {
    baselineX: number;
    baselineY: number;
    datumX: number;
    datumY: number;
  } | null {
    const independentBandwidth = getScaleBandwidth(scales.independent);
    return (datum: StackDatum<AxisScale, AxisScale, Datum>) => {
      const independentStartCoord = coerceNumber(scales.independent(getStack(datum)));
      if (!isValidNumber(independentStartCoord)) {
        return null;
      }
      const independentEndCoord = independentStartCoord + independentBandwidth;
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
        datumY: horizontal ? independentEndCoord : dependentEndCoord
      };
    };
  }

  createDatumLabelPositioner({
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
  }) {
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

  getMatchingDataForA11ySeries(independentDomainValue: ScaleInput<AxisScale>): readonly Datum[] {
    return this._data
      .filter((datum) => this.independentAccessor(getStackOriginalDatum(datum)) === independentDomainValue)
      .map((datum) => getStackOriginalDatum(datum));
  }
}
