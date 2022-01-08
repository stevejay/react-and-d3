export const GroupedBarChartSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="224"
    height="133"
    version="1.1"
    viewBox="0 0 256 152"
    className="mx-auto border-b-2 border-l-2 text-slate-50 border-slate-50"
    fill="currentColor"
  >
    <rect x={8} y={64} width={16} height={80} />
    <rect x={28} y={30} width={16} height={114} className="opacity-80" />
    <rect x={48} y={44} width={16} height={100} className="opacity-60" />

    <rect x={104} y={30} width={16} height={114} />
    <rect x={124} y={0} width={16} height={144} className="opacity-80" />
    <rect x={144} y={10} width={16} height={134} className="opacity-60" />

    <rect x={200} y={80} width={16} height={64} />
    <rect x={220} y={90} width={16} height={54} className="opacity-80" />
    <rect x={240} y={64} width={16} height={80} className="opacity-60" />
  </svg>
);
