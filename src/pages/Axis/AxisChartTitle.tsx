export interface AxisChartTitleProps {
  title: string;
  id: string;
}

export function AxisChartTitle({ title, id }: AxisChartTitleProps) {
  return (
    <h3 id={id} className="mb-2 font-light leading-none text-slate-200">
      {title}
    </h3>
  );
}
