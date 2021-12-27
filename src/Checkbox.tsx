import { FC } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useId } from '@uifabric/react-hooks';

export const Checkbox: FC<{ checked: boolean; label: string; onChange: (value: boolean) => void }> = ({
  checked,
  label,
  onChange
}) => {
  const id = useId();
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        className="absolute w-6 h-6 opacity-0 peer"
        onChange={() => onChange(!checked)}
      />
      <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 mr-2 bg-white border-2 pointer-events-none border-slate-600 peer-focus-visible:ring">
        <FaCheck className={`fill-current text-slate-600 w-3 h-3 ${checked ? 'opacity-100' : 'opacity-0'}`} />
      </div>
      <label htmlFor={id} className="select-none">
        {label}
      </label>
    </div>
  );
};
