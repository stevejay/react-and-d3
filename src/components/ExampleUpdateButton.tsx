import { ButtonHTMLAttributes, FC } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

export type ExampleUpdateButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const ExampleUpdateButton: FC<ExampleUpdateButtonProps> = ({ children, ...rest }) => (
  <button
    type="button"
    className="px-4 py-2 transition-colors outline-none bg-slate-600 hover:bg-slate-700 active:bg-slate-800 focus-visible:ring-2"
    {...rest}
  >
    <FiRefreshCw className="inline-block mb-1 mr-2" />
    {children}
  </button>
);
