import { StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { domAnimation, LazyMotion } from 'framer-motion';

// This is the :focus-visible polyfill
import 'focus-visible';

import { ErrorBoundary } from './components/ErrorBoundary';
import { App } from './App';

import './index.css';

render(
  <StrictMode>
    <BrowserRouter>
      <LazyMotion features={domAnimation} strict>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </LazyMotion>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
