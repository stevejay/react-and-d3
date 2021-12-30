import { timeFormat, timeYear } from 'd3';

const formatAbbrMonth = timeFormat('%b');
const formatYear = timeFormat('%Y');

export function yearMonthMultiFormat(date: Date): string {
  return (timeYear(date) < date ? formatAbbrMonth : formatYear)(date);
}
