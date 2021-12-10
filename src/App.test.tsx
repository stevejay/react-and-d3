import App from '@/App';

import { render, screen } from '@testing-library/react';

test('example test', () => {
  render(<App />);
  expect(screen.getByRole('heading')).toHaveTextContent('Hello Vite + React in test!');
});
