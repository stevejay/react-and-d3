import { FC, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { LoadingPlaceholder } from './components/LoadingPlaceholder';
import { ScrollToTopOnNavigation } from './components/ScrollToTopOnNavigation';

const HomePage = lazy(() => import('@/pages/Home'));
const AxisPage = lazy(() => import('@/pages/Axis'));
const TooltipPage = lazy(() => import('@/pages/Tooltip'));
const AccessibilityPage = lazy(() => import('@/pages/Accessibility'));
const BarChartPage = lazy(() => import('@/pages/BarChart'));
const StackedBarChartPage = lazy(() => import('@/pages/StackedBarChart'));
const GroupedBarChartPage = lazy(() => import('@/pages/GroupedBarChart'));
const RadarChartPage = lazy(() => import('@/pages/RadarChart'));
const ScatterplotPage = lazy(() => import('@/pages/Scatterplot'));
const SparklinePage = lazy(() => import('@/pages/Sparkline'));
const ThreePage = lazy(() => import('@/pages/Three'));

const pageLinks = [
  { href: '/', title: 'Home', pageComponent: HomePage },
  { href: '/axis', title: 'Axis', pageComponent: AxisPage },
  { href: '/tooltip', title: 'Tooltip', pageComponent: TooltipPage },
  { href: '/accessibility', title: 'Accessibility', pageComponent: AccessibilityPage },
  { href: '/bar-chart', title: 'Bar Chart', pageComponent: BarChartPage },
  { href: '/stacked-bar-chart', title: 'Stacked Bar Chart', pageComponent: StackedBarChartPage },
  { href: '/grouped-bar-chart', title: 'Grouped Bar Chart', pageComponent: GroupedBarChartPage },
  { href: '/radar-chart', title: 'Radar Chart', pageComponent: RadarChartPage },
  { href: '/scatterplot', title: 'Scatterplot', pageComponent: ScatterplotPage },
  { href: '/sparkline', title: 'Sparkline', pageComponent: SparklinePage },
  { href: '/three', title: 'Three.js Rendering', pageComponent: ThreePage }
];

const navigationData = [
  {
    title: 'Pages',
    links: pageLinks
  },
  {
    title: 'Links',
    links: [
      { href: 'https://github.com/stevejay/react-and-d3', title: 'Github Repository' },
      { href: 'https://www.middle-engine.com/blog', title: 'Blog' }
    ]
  }
];

export const App: FC = () => (
  <>
    <ScrollToTopOnNavigation />
    <Header navigationData={navigationData} />
    <main className="mx-auto max-w-screen-2xl">
      <ErrorBoundary>
        <Suspense fallback={<LoadingPlaceholder />}>
          <Routes>
            {pageLinks.map(({ href, pageComponent: PageComponent }) => (
              <Route key={href} path={href} element={<PageComponent />} />
            ))}
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </main>
  </>
);
