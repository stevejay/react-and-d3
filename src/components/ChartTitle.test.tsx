import { render, screen } from '@/testUtils';

import { ChartTitle } from './ChartTitle';

it('should render', () => {
  render(<ChartTitle>Hello</ChartTitle>);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
