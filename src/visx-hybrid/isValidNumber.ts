import { isNil } from 'lodash-es';

export function isValidNumber(_: unknown): _ is number {
  return !isNil(_) && typeof _ === 'number' && !Number.isNaN(_) && Number.isFinite(_);
}
