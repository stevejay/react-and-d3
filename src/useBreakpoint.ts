import useBreakpointLib from 'use-breakpoint';

const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024
  //, xl: 1280, '2xl': 1536
};

export const useBreakpoint = () => useBreakpointLib(breakpoints);
