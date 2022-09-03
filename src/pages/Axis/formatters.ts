import { timeYear } from 'd3-time';
import { timeFormat } from 'd3-time-format';

const formatAbbrMonth = timeFormat('%b');
const formatYear = timeFormat('%Y');

export function yearMonthMultiFormat(date: Date): string {
  return (timeYear(date) < date ? formatAbbrMonth : formatYear)(date);
}
