import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Pairing days calendar/i);
  expect(linkElement).toBeInTheDocument();
});
