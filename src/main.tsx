import { StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { domAnimation, LazyMotion } from 'framer-motion';

// :focus-visible polyfill
import 'focus-visible';

import { App } from './App';

import './index.css';

render(
  <StrictMode>
    <BrowserRouter>
      <LazyMotion features={domAnimation} strict>
        <App />
      </LazyMotion>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
