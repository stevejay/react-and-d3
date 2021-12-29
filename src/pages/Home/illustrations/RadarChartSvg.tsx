export const RadarChartSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="256"
    height="152"
    version="1.1"
    viewBox="-128 -76 256 152"
    className="mx-auto text-slate-50"
  >
    <circle cx={0} cy={0} r={75} strokeWidth={1} fill="none" stroke="currentColor" />
    <circle cx={0} cy={0} r={60} strokeWidth={1} fill="none" stroke="currentColor" />
    <circle cx={0} cy={0} r={40} strokeWidth={1} fill="none" stroke="currentColor" />
    <circle cx={0} cy={0} r={20} strokeWidth={1} fill="none" stroke="currentColor" />
    <path
      strokeWidth={4}
      fill="none"
      stroke="currentColor"
      d="M 0,-65 L 40,-50 L 30,30 L -20,50 L -60,-10 Z"
    />
  </svg>
);
