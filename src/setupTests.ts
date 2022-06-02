// import chai from 'chai';
// import { afterEach } from 'vitest';
import { cleanup } from '@/testUtils';

// import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';

// import { server } from './mocks/server.js';
// Extend chai with chai-dom assertions
// chai.use(require('chai-dom'));
// React Testing Library cleanup
afterEach(cleanup);
// // Establish API mocking before all tests.
// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// // Reset any request handlers that we may add during the tests,
// // so they don't affect other tests.
// afterEach(() => server.resetHandlers());
// // Clean up after the tests are finished.
// afterAll(() => server.close());
