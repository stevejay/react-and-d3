import { ButtonHTMLAttributes } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

const variants = {
  primary: 'text-slate-200 bg-slate-600 hover:bg-slate-700 active:bg-slate-800',
  secondary: 'text-slate-200 bg-teal-700 active:bg-teal-800'
} as const;

export type ExampleUpdateButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function ExampleUpdateButton({
  children,
  className = '',
  variant = 'primary',
  ...rest
}: ExampleUpdateButtonProps) {
  return (
    <button
      type="button"
      className={`px-4 py-2 transition-colors outline-none focus-visible:ring-2 ${variants[variant]} ${className}`}
      {...rest}
    >
      <FiRefreshCw className="inline-block mb-1 mr-2" />
      {children}
    </button>
  );
}
