import { Key } from 'react';
import { AxisDomain } from 'd3-axis';

/**
 * Get the key value for an AxisDomain object, for use as the key prop on a React element.
 */
export function getAxisDomainValueAsReactKey(value: AxisDomain): Key {
  return value.toString();
}
