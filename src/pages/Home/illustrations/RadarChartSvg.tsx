export function RadarChartSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="224"
      height="133"
      version="1.1"
      viewBox="-128 -76 256 152"
      className="mx-auto text-slate-50"
      stroke="currentColor"
      fill="none"
    >
      <circle cx={0} cy={0} r={75} strokeWidth={1} />
      <circle cx={0} cy={0} r={60} strokeWidth={1} />
      <circle cx={0} cy={0} r={40} strokeWidth={1} />
      <circle cx={0} cy={0} r={20} strokeWidth={1} />
      <path strokeWidth={4} d="M 0,-65 L 40,-50 L 30,30 L -20,50 L -60,-10 Z" />
    </svg>
  );
}
