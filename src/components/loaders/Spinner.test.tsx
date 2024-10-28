import { render, screen } from '@testing-library/react';
import { ImSpinner8 } from 'react-icons/im';
import { PiDogFill } from 'react-icons/pi';
import { Spinner } from './Spinner';

jest.mock('react-icons/im', () => ({
  ImSpinner8: jest.fn(() => <div>ImSpinner8 Icon</div>),
}));

jest.mock('react-icons/pi', () => ({
  PiDogFill: jest.fn(() => <div>PiDogFill Icon</div>),
}));

describe('Spinner Component', () => {
  it('debería renderizar el icono de perro cuando la propiedad dog es true', () => {
    render(<Spinner dog={true} />);

    const dogIcon = screen.getByText('PiDogFill Icon');
    expect(dogIcon).toBeInTheDocument();
  });

  it('debería renderizar el icono de spinner cuando la propiedad dog es false o no está presente', () => {
    render(<Spinner dog={false} />);

    const spinnerIcon = screen.getByText('ImSpinner8 Icon');
    expect(spinnerIcon).toBeInTheDocument();
  });

  it('debería pasar las props correctamente al icono de perro', () => {
    render(<Spinner dog={true} className="custom-class" />);

    expect(PiDogFill).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 25,
        className: expect.stringContaining('custom-class'),
      }),
      {},
    );
  });

  it('debería pasar las props correctamente al icono de spinner', () => {
    render(<Spinner dog={false} className="custom-class" />);

    expect(ImSpinner8).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 25,
        className: expect.stringContaining('custom-class'),
      }),
      {},
    );
  });
});
