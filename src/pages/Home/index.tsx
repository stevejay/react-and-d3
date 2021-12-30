import { AxisSvg } from './illustrations/AxisSvg';
import { HorizontalBarChartSvg } from './illustrations/HorizontalBarChartSvg';
import { RadarChartSvg } from './illustrations/RadarChartSvg';
import { ReactAndD3Svg } from './illustrations/ReactAndD3Svg';
import { SparklineSvg } from './illustrations/SparklineSvg';
import { StackedVerticalBarChartSvg } from './illustrations/StackedVerticalBarChartSvg';
import { VerticalBarChartSvg } from './illustrations/VerticalBarChartSvg';
import { PageCard } from './PageCard';

const Home = () => (
  <div>
    <h1 className="sr-only">Home Page</h1>
    <div className="flex flex-col-reverse items-center justify-between gap-8 px-16 py-16 overflow-hidden border-b lg:py-0 lg:flex-row border-slate-600 bg-gradient-to-r from-slate-900 to-slate-800">
      <p className="max-w-screen-sm text-2xl font-bold leading-relaxed text-center lg:text-left md:text-3xl text-slate-300">
        Combining the best of React and D3 to create <span className="text-teal-500">dynamic</span> and{' '}
        <span className="text-cyan-500">maintainable</span> data visualisations
      </p>
      <ReactAndD3Svg className="w-[300px] h-[250px] md:w-[400px] md:h-[350px] flex-shrink-0" />
    </div>
    <div className="p-8 space-y-8 md:space-y-0 md:gap-8 md:grid md:grid-cols-2 lg:grid-cols-3">
      <PageCard href="/axis" title="Axis" illustration={AxisSvg} />
      <PageCard href="/axis" title="Vertical Bar Chart" illustration={VerticalBarChartSvg} />
      <PageCard href="/axis" title="Horizontal Bar Chart" illustration={HorizontalBarChartSvg} />
      <PageCard href="/axis" title="Stacked Vertical Bar Chart" illustration={StackedVerticalBarChartSvg} />
      <PageCard href="/radar-chart" title="Radar Chart" illustration={RadarChartSvg} />
      <PageCard href="/axis" title="Sparkline" illustration={SparklineSvg} />
    </div>
  </div>
);

export default Home;
