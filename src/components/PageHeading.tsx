import { HTMLAttributes } from 'react';

export function PageHeading({ className = '', children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={`mb-3 text-lg text-blue-500 uppercase ${className}`} {...rest}>
      {children}
    </h1>
  );
}
