import { render, screen } from '@testing-library/react';
import { Star } from './Star';

describe('Star', () => {
  it('debe renderizar el componente', () => {
    render(<Star />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
