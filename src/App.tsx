import { FC, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { LoadingPlaceholder } from './components/LoadingPlaceholder';
import { ScrollToTop } from './components/ScrollToTop';
import { DocumentVisibilityRoot } from './DocumentVisibility';
// import { Checkbox } from './Checkbox';
// import { CustomTimeAxisExamples } from './CustomTimeAxisExamples';
// import { D3Logo } from './D3Logo';
import { Header, NavigationSection } from './Header';
// import { HeadlessUiDialog } from './HeadlessUiDialog';
// import { LinearAxisExamples } from './LinearAxisExamples';
// import { RadarChartExamples } from './RadarChartExamples';
// import { SparklineExamples } from './SparklineExamples';
// import { TimeAxisExamples } from './TimeAxisExamples';

// const SectionHeading: FC = ({ children }) => (
//   <h2 className="text-2xl font-bold text-slate-700">{children}</h2>
// );

// const fastAnimationSeconds = 0.75;
// const slowAnimationSeconds = 2;

const navigationData: NavigationSection[] = [
  {
    title: 'Pages',
    links: [
      { href: '/', title: 'Home' },
      { href: '/axis', title: 'Axis' },
      { href: '/radar-chart', title: 'Radar Chart' },
      { href: '/sparkline', title: 'Sparkline' }
    ]
  },
  {
    title: 'Links',
    links: [
      { href: 'https://github.com/stevejay/react-and-d3', title: 'Github Repository' },
      { href: 'https://www.middle-engine.com/blog', title: 'Blog' }
    ]
  }
];

const Home = lazy(() => import('@/pages/Home'));
const Axis = lazy(() => import('@/pages/Axis'));
const RadarChart = lazy(() => import('@/pages/RadarChart'));
const Sparkline = lazy(() => import('@/pages/Sparkline'));

export const App: FC = () => {
  //   const [slowAnimations, setSlowAnimations] = useState(false);
  //   const [drawTicksAsGridLines, setDrawTicksAsGridLines] = useState(false);
  //   const transitionSeconds = slowAnimations ? slowAnimationSeconds : fastAnimationSeconds;
  return (
    <>
      <ScrollToTop />
      {/* <D3Logo className="absolute w-[600px] text-slate-800/50 -z-10 h-[600px] left-[-50px] top-[-44px]" /> */}
      <Header navigationData={navigationData} />

      {/* <div className="sticky top-0 flex px-8 py-4 space-x-8 bg-white shadow-lg">
        <Checkbox
          label="Draw inner ticks as grid lines"
          checked={drawTicksAsGridLines}
          onChange={setDrawTicksAsGridLines}
        />
        <Checkbox label="Use slow animations" checked={slowAnimations} onChange={setSlowAnimations} />
      </div> */}
      {/* <main className="p-8 space-y-8 bg-fixed bg-left-top bg-no-repeat bg-d3-logo"> */}
      <DocumentVisibilityRoot>
        <main className="mx-auto max-w-screen-2xl">
          <Suspense fallback={<LoadingPlaceholder />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/axis" element={<Axis />} />
              <Route path="/radar-chart" element={<RadarChart />} />
              <Route path="/sparkline" element={<Sparkline />} />
            </Routes>
          </Suspense>

          {/* <HeadlessUiDialog />
        <SectionHeading>Linear Axis</SectionHeading>
        <LinearAxisExamples
          drawTicksAsGridLines={drawTicksAsGridLines}
          transitionSeconds={transitionSeconds}
        />
        <SectionHeading>Time Axis</SectionHeading>
        <TimeAxisExamples drawTicksAsGridLines={drawTicksAsGridLines} transitionSeconds={transitionSeconds} />
        <SectionHeading>Custom Time Axis</SectionHeading>
        <CustomTimeAxisExamples transitionSeconds={transitionSeconds} />
        <SectionHeading>Radar Chart</SectionHeading>
        <RadarChartExamples transitionSeconds={transitionSeconds} />
        <SectionHeading>Sparkline</SectionHeading>
        <SparklineExamples transitionSeconds={transitionSeconds} /> */}
        </main>
      </DocumentVisibilityRoot>
    </>
  );
};
