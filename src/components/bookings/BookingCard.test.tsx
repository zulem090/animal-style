import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BookingDto } from '@/dto/booking/bookingDto';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { BookingCard } from './BookingCard';
import { User as UserSession } from 'next-auth';

const bookingControllerMock = {
  deleteById: jest.fn(),
  activeById: jest.fn(),
  inactiveById: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  loading: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
  remove: jest.fn(),
}));

jest.mock('@/controllers/bookingController', () => ({
  BookingController: jest.fn().mockImplementation(() => bookingControllerMock),
}));

describe('BookingCard Component', () => {
  const bookingMock: BookingDto = {
    idCita: 1,
    tipoCita: 'Spa',
    tipoMascota: 'Felino',
    nombreMascota: 'Copito',
    estado: 'ACTIVO',
    idUsuario: '1',
    fechaHoraCita: new Date(),
    observaciones: '',
  };

  const userMock: UserSession = {
    id: '1',
    role: 'ADMIN',
  };

  const routerPushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValueOnce({ push: routerPushMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar correctamente con un producto', () => {
    render(<BookingCard booking={bookingMock} user={userMock} />);

    expect(screen.getByText('Mascota:')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Mascota:')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Reserva:')).toBeInTheDocument();
    expect(screen.getByText('Fecha:')).toBeInTheDocument();
    expect(screen.getByText('Hora:')).toBeInTheDocument();
  });

  it('debería navegar a la página de edición cuando se hace clic en el botón de editar', async () => {
    render(<BookingCard booking={bookingMock} user={userMock} />);

    const editButton = screen.getByTestId('boton-editar');
    await act(() => fireEvent.click(editButton));

    expect(routerPushMock).toHaveBeenCalledWith(`/bookings/${bookingMock.idCita}/edit`);
  });

  it('debería llamar a la función deleteById y mostrar un mensaje de éxito al eliminar un producto', async () => {
    render(<BookingCard booking={bookingMock} user={userMock} />);

    const deleteButton = screen.getByTestId('boton-eliminar');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(bookingControllerMock.deleteById).toHaveBeenCalledWith(bookingMock.idCita);
      expect(toast.success).toHaveBeenCalledWith(`Reserva de ${bookingMock.nombreMascota} ha sido eliminado!`, {
        duration: 4000,
      });
    });
  });

  it('debería deshabilitar los botones de acción mientras se ejecutan', async () => {
    render(<BookingCard booking={bookingMock} user={userMock} />);

    const deleteButton = screen.getByTestId('boton-eliminar');

    fireEvent.click(deleteButton);

    waitFor(() => {
      expect(deleteButton).toBeDisabled();
    });
  });
});
