import type {
  DefaultOutput,
  LinearScaleConfig,
  PowScaleConfig,
  QuantizeScaleConfig,
  ScaleConfig,
  ScaleType,
  SqrtScaleConfig,
  SymlogScaleConfig
} from '@visx/scale';

// import { DefaultOutput } from '../types/Base';
// import {
//   LinearScaleConfig,
//   PowScaleConfig,
//   QuantizeScaleConfig,
//   ScaleConfig,
//   ScaleType,
//   SqrtScaleConfig,
//   SymlogScaleConfig,
// } from '../types/ScaleConfig';

type ZeroableScaleConfigs<Output = DefaultOutput> =
  | LinearScaleConfig<Output>
  | PowScaleConfig<Output>
  | SqrtScaleConfig<Output>
  | SymlogScaleConfig<Output>
  | QuantizeScaleConfig<Output>;

const zeroableScaleTypes = new Set<ScaleType>(['linear', 'pow', 'quantize', 'sqrt', 'symlog']);

// A typeguard.
export function scaleCanBeZeroed<Output = DefaultOutput>(
  scaleConfig: ScaleConfig<Output>
): scaleConfig is ZeroableScaleConfigs<Output> {
  return zeroableScaleTypes.has(scaleConfig.type);
}
