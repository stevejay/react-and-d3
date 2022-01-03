export const TooltipSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="256"
    height="152"
    version="1.1"
    viewBox="0 0 256 152"
    className="mx-auto border-b-2 border-l-2 text-slate-50 border-slate-50"
  >
    {/* <rect fill="currentColor" x={8} y={30} width={56} height={114} /> */}
    <g className="opacity-50">
      <rect fill="currentColor" x={8} y={0} width={77} height={144} />
      <rect fill="currentColor" x={93} y={120} width={77} height={24} />
      <rect fill="currentColor" x={178} y={80} width={77} height={64} />
    </g>
    <rect fill="currentColor" x={131 - 60} y={20} width={120} height={80} />
    <rect fill="currentColor" transform="rotate(-45 131 100)" x={131 - 10} y={90} width={20} height={20} />
  </svg>
);

// midx = 131.5
