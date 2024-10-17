import { render, screen } from '@testing-library/react';
import ContentLoader from 'react-content-loader';
import { ProductsListLoader } from './ProductsListLoader';

jest.mock('react-content-loader', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Content Loader</div>),
}));

describe('ProductsListLoader', () => {
  it('debería renderizar correctamente', () => {
    render(<ProductsListLoader />);

    const loader = screen.getByText('Content Loader');
    expect(loader).toBeInTheDocument();
  });

  it('debería pasar las props correctamente a ContentLoader', () => {
    render(<ProductsListLoader speed={5} />);

    expect(ContentLoader).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 800,
        height: 575,
        speed: 5,
      }),
      {},
    );
  });
});
