import { render, screen } from '@testing-library/react';
import ContentLoader from 'react-content-loader';
import { ProductDetailLoader } from './ProductDetailLoader';

jest.mock('react-content-loader', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Content Loader</div>),
}));

describe('ProductDetailLoader', () => {
  it('debería renderizar correctamente', () => {
    render(<ProductDetailLoader />);

    const loader = screen.getByText('Content Loader');
    expect(loader).toBeInTheDocument();
  });

  it('debería pasar las props correctamente a ContentLoader', () => {
    render(<ProductDetailLoader speed={5} />);

    expect(ContentLoader).toHaveBeenCalledWith(
      expect.objectContaining({
        speed: 5,
        className: 'h-screen w-fit',
        width: 1200,
        height: 500,
      }),
      {},
    );
  });
});
