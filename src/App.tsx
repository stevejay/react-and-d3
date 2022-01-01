import { FC, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Header, NavigationSection } from './components/Header';
import { LoadingPlaceholder } from './components/LoadingPlaceholder';
import { ScrollToTop } from './components/ScrollToTop';

const navigationData: NavigationSection[] = [
  {
    title: 'Pages',
    links: [
      { href: '/', title: 'Home' },
      { href: '/axis', title: 'Axis' },
      { href: '/bar-chart', title: 'Bar Chart' },
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
const BarChart = lazy(() => import('@/pages/BarChart'));
const RadarChart = lazy(() => import('@/pages/RadarChart'));
const Sparkline = lazy(() => import('@/pages/Sparkline'));

export const App: FC = () => (
  <>
    <ScrollToTop />
    <Header navigationData={navigationData} />
    <main className="mx-auto max-w-screen-2xl">
      <Suspense fallback={<LoadingPlaceholder />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/axis" element={<Axis />} />
          <Route path="/bar-chart" element={<BarChart />} />
          <Route path="/radar-chart" element={<RadarChart />} />
          <Route path="/sparkline" element={<Sparkline />} />
        </Routes>
      </Suspense>
    </main>
  </>
);
