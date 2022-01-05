export const StackedVerticalBarChartSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="256"
    height="152"
    version="1.1"
    viewBox="0 0 256 152"
    className="mx-auto border-b-2 border-l-2 text-slate-50 border-slate-50"
    fill="currentColor"
  >
    <rect x={8} y={30} width={56} height={26} />
    <rect x={8} y={60} width={56} height={16} />
    <rect x={8} y={80} width={56} height={64} />

    <rect x={72} y={0} width={56} height={82} />
    <rect x={72} y={86} width={56} height={30} />
    <rect x={72} y={120} width={56} height={24} />

    <rect x={136} y={130} width={56} height={4} />
    <rect x={136} y={138} width={56} height={6} />

    <rect x={200} y={80} width={56} height={26} />
    <rect x={200} y={110} width={56} height={16} />
    <rect x={200} y={130} width={56} height={14} />
  </svg>
);
