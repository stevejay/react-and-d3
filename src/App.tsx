import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';
import { LoadingPlaceholder } from '@/components/LoadingPlaceholder';
// import { ScrollToTopOnNavigation } from '@/components/ScrollToTopOnNavigation';
import { TitleAnnouncer } from '@/components/TitleAnnouncer';
import { AnnouncerProvider } from '@/contexts/Announcer';

import 'focus-visible'; // A :focus-visible polyfill, for Safari.

import { useLagRadar } from './hooks/useLagRadar';

import './index.css';

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
const VisxPage = lazy(() => import('@/pages/Visx'));
const VisxConfigPage = lazy(() => import('@/pages/VisxConfig'));
const VisxHybridPage = lazy(() => import('@/pages/VisxHybrid'));
const VisxNextPage = lazy(() => import('@/pages/VisxNext'));
const StateOfJSPage = lazy(() => import('@/pages/StateOfJS'));

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
  { href: '/visx', title: 'Visx by Airbnb', pageComponent: VisxPage },
  { href: '/visx-config', title: 'Visx Config', pageComponent: VisxConfigPage },
  { href: '/visx-hybrid', title: 'Visx Hybrid', pageComponent: VisxHybridPage },
  { href: '/visx-next', title: 'Visx Next', pageComponent: VisxNextPage },
  { href: '/state-of-js', title: 'State of JS', pageComponent: StateOfJSPage }
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

const queryClient = new QueryClient();

export function App() {
  useLagRadar();
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AnnouncerProvider>
            <HelmetProvider>
              <TitleAnnouncer />
              {/* <ScrollToTopOnNavigation /> */}
              <Header navigationData={navigationData} />
              <ErrorBoundary>
                <Suspense fallback={<LoadingPlaceholder />}>
                  <Routes>
                    {pageLinks.map(({ href, pageComponent: PageComponent }) => (
                      <Route key={href} path={href} element={<PageComponent />} />
                    ))}
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </HelmetProvider>
          </AnnouncerProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
