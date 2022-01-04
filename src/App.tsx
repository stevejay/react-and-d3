import { FC, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ErrorBoundary } from './components/ErrorBoundary';
import { Header, NavigationSection } from './components/Header';
import { LoadingPlaceholder } from './components/LoadingPlaceholder';
import { ScrollToTopOnNavigation } from './components/ScrollToTopOnNavigation';

const navigationData: NavigationSection[] = [
  {
    title: 'Pages',
    links: [
      { href: '/', title: 'Home' },
      { href: '/axis', title: 'Axis' },
      { href: '/tooltip', title: 'Tooltip' },
      { href: '/bar-chart', title: 'Bar Chart' },
      { href: '/stacked-bar-chart', title: 'Stacked Bar Chart' },
      //   { href: '/histogram', title: 'Histogram' },
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
const Tooltip = lazy(() => import('@/pages/Tooltip'));
const BarChart = lazy(() => import('@/pages/BarChart'));
const StackedBarChart = lazy(() => import('@/pages/StackedBarChart'));
const Histogram = lazy(() => import('@/pages/Histogram'));
const RadarChart = lazy(() => import('@/pages/RadarChart'));
const Sparkline = lazy(() => import('@/pages/Sparkline'));

export const App: FC = () => (
  <>
    <ScrollToTopOnNavigation />
    <Header navigationData={navigationData} />
    <main className="mx-auto max-w-screen-2xl">
      <ErrorBoundary>
        <Suspense fallback={<LoadingPlaceholder />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/axis" element={<Axis />} />
            <Route path="/tooltip" element={<Tooltip />} />
            <Route path="/bar-chart" element={<BarChart />} />
            <Route path="/stacked-bar-chart" element={<StackedBarChart />} />
            <Route path="/histogram" element={<Histogram />} />
            <Route path="/radar-chart" element={<RadarChart />} />
            <Route path="/sparkline" element={<Sparkline />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </main>
  </>
);
