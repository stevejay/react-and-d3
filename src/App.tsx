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
      { href: '/accessibility', title: 'Accessibility' },
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

const HomePage = lazy(() => import('@/pages/Home'));
const AxisPage = lazy(() => import('@/pages/Axis'));
const TooltipPage = lazy(() => import('@/pages/Tooltip'));
const AccessibilityPage = lazy(() => import('@/pages/Accessibility'));
const BarChartPage = lazy(() => import('@/pages/BarChart'));
const StackedBarChartPage = lazy(() => import('@/pages/StackedBarChart'));
const HistogramPage = lazy(() => import('@/pages/Histogram'));
const RadarChartPage = lazy(() => import('@/pages/RadarChart'));
const SparklinePage = lazy(() => import('@/pages/Sparkline'));

export const App: FC = () => (
  <>
    <ScrollToTopOnNavigation />
    <Header navigationData={navigationData} />
    <main className="mx-auto max-w-screen-2xl">
      <ErrorBoundary>
        <Suspense fallback={<LoadingPlaceholder />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/axis" element={<AxisPage />} />
            <Route path="/tooltip" element={<TooltipPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/bar-chart" element={<BarChartPage />} />
            <Route path="/stacked-bar-chart" element={<StackedBarChartPage />} />
            <Route path="/histogram" element={<HistogramPage />} />
            <Route path="/radar-chart" element={<RadarChartPage />} />
            <Route path="/sparkline" element={<SparklinePage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </main>
  </>
);
