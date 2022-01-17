import { StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

// This is the :focus-visible polyfill
import 'focus-visible';

import { ErrorBoundary } from './components/ErrorBoundary';
import { App } from './App';

import './index.css';

render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
