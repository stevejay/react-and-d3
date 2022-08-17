import type { ScaleTypeToD3Scale } from '@visx/scale';
import type { ScaleBand } from 'd3-scale';
import { isNil } from 'lodash-es';

import type { AxisScale, AxisScaleOutput, IScaleSet } from './types';

export class ScaleSet implements IScaleSet {
  private _independent: AxisScale<AxisScaleOutput>;
  private _dependent: AxisScale<AxisScaleOutput>;
  private _alternateDependent: AxisScale<AxisScaleOutput> | null;
  private _group: ScaleBand<string> | null;
  private _color: ScaleTypeToD3Scale<string, string>['ordinal'];

  constructor({
    independentScale,
    dependentScale,
    alternateDependentScale,
    groupScale,
    colorScale
  }: {
    independentScale: AxisScale<AxisScaleOutput>;
    dependentScale: AxisScale<AxisScaleOutput>;
    alternateDependentScale: AxisScale<AxisScaleOutput> | null;
    groupScale: ScaleBand<string> | null;
    colorScale: ScaleTypeToD3Scale<string, string>['ordinal'];
  }) {
    this._independent = independentScale;
    this._dependent = dependentScale;
    this._alternateDependent = alternateDependentScale;
    this._group = groupScale;
    this._color = colorScale;
  }

  get independent(): AxisScale<AxisScaleOutput> {
    return this._independent;
  }

  getDependentScale(usesAlternateDependent: boolean): AxisScale<AxisScaleOutput> {
    if (usesAlternateDependent) {
      if (isNil(this._alternateDependent)) {
        throw new Error('Alternate dependent scale is nil.');
      }
      return this._alternateDependent;
    }
    return this._dependent;
  }

  get group(): ScaleBand<string> | null {
    return this._group;
  }

  get color(): ScaleTypeToD3Scale<string, string>['ordinal'] {
    return this._color;
  }
}
