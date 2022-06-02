// import { GridScale } from '../types';

import { D3Scale } from '.';

export function getScaleBandwidth<Output>(scale: D3Scale<Output, any, any>) {
  return 'bandwidth' in scale ? scale.bandwidth() : 0;
}
