import { render, screen } from '@testing-library/react';
import { User as UserSession } from 'next-auth';
import { BookingsList } from './BookingsList';
import { BookingDto } from '@/dto/booking/bookingDto';


jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/bookings', () => ({
  ...jest.requireActual('@/components/bookings'),
  BookingCard: jest.fn(() => <div>Un reserva</div>),
}));

describe('BookingsList', () => {
  const userMock: UserSession = {
    id: 1,
    cedula: 1,
    name: 'Zule',
    apellido: 'Muñoz',
    usuario: 'zule1',
    password: 'pass1',
    role: 'ADMIN',
    email: 'zule@gmail.com',
    direccion: 'Calle 1',
    telefono: 3000000000,
  } as unknown as UserSession;

  const bookingMock: BookingDto = {
    idCita: 1,
    tipoCita: 'Spa',
    tipoMascota: 'Felino',
    nombreMascota: 'Copito',
    estado: 'ACTIVO',
    idUsuario: userMock.id,
    fechaHoraCita: new Date(new Date().setDate(new Date().getDate() + 10)),
    observaciones: '',
  };
  const bookingMock2: BookingDto = {
    idCita: 2,
    tipoCita: 'Adiestramiento',
    tipoMascota: 'Canino',
    nombreMascota: 'Rex',
    estado: 'ACTIVO',
    idUsuario: userMock.id,
    fechaHoraCita: new Date(new Date().setDate(new Date().getDate() + 5)),
    observaciones: '',
  };
  const mockBookings: BookingDto[] = [bookingMock, bookingMock2];

  const mockUserAdmin: UserSession = {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
  } as UserSession;

  const mockUserNonAdmin: UserSession = {
    name: 'Regular User',
    email: 'user@example.com',
    role: 'USER',
  } as UserSession;

  it('renderiza un botón de crear un reserva si el usuario es un admin', () => {
    render(<BookingsList user={mockUserAdmin} bookings={mockBookings} />);

    const createButton = screen.getByRole('button', { name: /crear reserva/i });
    expect(createButton).toBeInTheDocument();
  });

  it('no renderiza el boton de crear si no hay usuario', () => {
    render(<BookingsList user={undefined} bookings={mockBookings} />);

    const createButton = screen.queryByRole('button', { name: /crear reserva/i });
    expect(createButton).toBeNull();
  });

  it('renderiza un reserva cuando los reservas estan disponible', () => {
    render(<BookingsList user={mockUserNonAdmin} bookings={mockBookings} />);

    const productCards = screen.getAllByText(/Un reserva/i);
    expect(productCards.length).toBe(2); // Dado que hay dos reservas en la lista
  });

  it('renderiza un mensaje cuando no hay reservas disponibles', () => {
    render(<BookingsList user={mockUserNonAdmin} bookings={[]} />);

    const noBookingsMessage = screen.getByText(/no hay o no se encontró reservas/i);
    expect(noBookingsMessage).toBeInTheDocument();
  });
});
