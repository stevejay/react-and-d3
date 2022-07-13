import { Statistic } from './types';

export interface LocationSelectProps {
  value: Statistic;
  onChange: (value: Statistic) => void;
}

export function LocationStatisticSelect({ value, onChange }: LocationSelectProps) {
  return (
    <select
      name="accessor"
      value={value}
      onChange={(event) => onChange(event.target.value as unknown as Statistic)}
      className="form-select appearance-none
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
    >
      <option value="percentage_survey">% of survey respondents</option>
      <option value="percentage_question">% of question respondents</option>
      <option value="count">Count</option>
    </select>
  );
}
