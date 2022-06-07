import { HTMLAttributes, useEffect, useRef } from 'react';

/** The H1 heading for a page. It self-focuses on mount. */
export function PageHeading({ className = '', children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
    headingRef.current?.setAttribute('tabIndex', '');
  }, []);
  return (
    <h1
      ref={headingRef}
      className={`mb-3 text-lg text-blue-500 uppercase outline-none focus-visible:ring-2 ${className}`}
      tabIndex={-1}
      {...rest}
    >
      {children}
    </h1>
  );
}
