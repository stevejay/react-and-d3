// Fallback bandwidth estimate assumes no missing data values (divides chart space by number of datums)
export function getFallbackBandwidth(fullBarWidth: number, barPadding: number) {
  // clamp padding to [0, 1], bar thickness = (1-padding) * availableSpace
  return fullBarWidth * (1 - Math.min(1, Math.max(0, barPadding)));
}
