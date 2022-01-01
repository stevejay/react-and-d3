import useBreakpointLib from 'use-breakpoint';

const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024
};

export const useBreakpoint = () => useBreakpointLib(breakpoints);
