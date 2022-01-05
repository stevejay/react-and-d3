import type { FC, HTMLAttributes } from 'react';

export const PageHeading: FC<HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <h1 className={`mb-3 text-lg text-blue-500 uppercase ${className}`} {...rest}>
    {children}
  </h1>
);
