import { FaUniversalAccess } from 'react-icons/fa';

import { Paragraph } from '@/components/Paragraph';

import { BarChartSvg } from './illustrations/BarChartSvg';
import circuitBoardSvgUrl from './illustrations/circuitBoard.svg';
import { GroupedBarChartSvg } from './illustrations/GroupedBarChartSvg';
import { RadarChartSvg } from './illustrations/RadarChartSvg';
import { ReactAndD3Svg } from './illustrations/ReactAndD3Svg';
import { SparklineSvg } from './illustrations/SparklineSvg';
import { StackedBarChartSvg } from './illustrations/StackedBarChartSvg';
import { TooltipSvg } from './illustrations/TooltipSvg';
// import { HistogramChartSvg } from './illustrations/HistogramChartSvg';
import { PageCard } from './PageCard';

const Home = () => (
  <div>
    <h1 className="sr-only">Home Page</h1>
    <div className="bg-center" style={{ backgroundImage: `url("${circuitBoardSvgUrl}")` }}>
      <div className="flex flex-col-reverse items-center justify-between px-4 py-8 overflow-hidden border-b lg:py-16 lg:px-16 lg:flex-row border-slate-600 bg-gradient-to-t lg:bg-gradient-to-r from-slate-800 lg:via-slate-800 to-transparent">
        <p className="max-w-screen-sm text-2xl font-semibold text-center lg:text-left md:text-3xl text-slate-300">
          Combining React and D3 to create <span className="text-teal-400">declarative</span> and{' '}
          <span className="text-cyan-400">maintainable</span> custom data visualisations
        </p>
        <ReactAndD3Svg className="w-[250px] h-[200px] flex-shrink-0 mb-4 lg:mb-0" />
      </div>
    </div>
    <Paragraph className="px-8 pt-8 mx-auto text-xl">
      This site demonstrates how <span className="font-normal text-slate-200">D3</span> and{' '}
      <span className="font-normal text-slate-200">React</span> can be used together to create SVG data
      visualisations. D3 is used to calculate element positions and React is used to render them. Use the
      links below to explore the various example components and visualisations.
    </Paragraph>
    <div className="p-8 space-y-8 md:space-y-0 md:gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <PageCard
        href="/axis"
        title="Axis"
        illustration={() => (
          <div className="mx-auto border-b-2 border-l-2 text-slate-50 border-slate-50 w-[224px] h-[133px]" />
        )}
      />
      <PageCard href="/tooltip" title="Tooltip" illustration={TooltipSvg} />
      <PageCard
        href="/accessibility"
        title="Accessibility"
        illustration={() => <FaUniversalAccess className="w-[133px] h-[133px]" />}
      />
      <PageCard href="/bar-chart" title="Bar Chart" illustration={BarChartSvg} />
      <PageCard href="/stacked-bar-chart" title="Stacked Bar Chart" illustration={StackedBarChartSvg} />
      <PageCard href="/grouped-bar-chart" title="Grouped Bar Chart" illustration={GroupedBarChartSvg} />
      {/* <PageCard href="/histogram" title="Histogram" illustration={HistogramChartSvg} /> */}
      <PageCard href="/radar-chart" title="Radar Chart" illustration={RadarChartSvg} />
      <PageCard href="/sparkline" title="Sparkline" illustration={SparklineSvg} />
    </div>
  </div>
);

export default Home;
