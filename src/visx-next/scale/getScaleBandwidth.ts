// import { GridScale } from '../types';

import { AxisScale } from '../types';

// import { D3Scale } from '.';
// export function getScaleBandwidth<Output>(scale: D3Scale<Output, any, any>) {
//   return 'bandwidth' in scale ? scale.bandwidth() : 0;
// }

export function getScaleBandwidth<Scale extends AxisScale>(scale?: Scale) {
  // Broaden type before using 'xxx' in s as typeguard.
  const s = scale as AxisScale;
  return s && 'bandwidth' in s ? s?.bandwidth() ?? 0 : 0;
}
