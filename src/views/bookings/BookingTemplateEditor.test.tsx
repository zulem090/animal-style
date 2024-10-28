import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingTemplateEditor } from './BookingTemplateEditor';
import { BookingController } from '@/controllers/bookingController';
import { UserController } from '@/controllers/userController';

import Dinero from 'dinero.js';
import toast from 'react-hot-toast';
import { BookingDto } from '@/dto/booking/bookingDto';
import { User } from '@prisma/client';

jest.mock('@/controllers/bookingController');
jest.mock('@/controllers/userController');
jest.mock('react-hot-toast');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.URL.createObjectURL = jest.fn();

describe('BookingTemplateEditor Component', () => {
  const mockedBookingController = BookingController as jest.Mock;
  const userController = UserController as jest.Mock;

  const userMock: User = {
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
  } as unknown as User;

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

  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza loading spinner cuando data esté loading', () => {
    mockedBookingController.prototype.getById = jest.fn().mockResolvedValue(bookingMock);

    render(<BookingTemplateEditor bookingId={bookingMock.idCita} user={userMock} />);
    expect(screen.getByTestId('simbolo-carga-reserva-editor')).not.toBeNull();
  });

  it('renderiza form fields cuando loading esté complete', async () => {
    render(<BookingTemplateEditor bookingId={undefined} user={userMock} />);

    await waitFor(() => {
      expect(screen.getByText('Nueva Reserva')).not.toBeNull();
    });

    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Apellido')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Documento')).toBeInTheDocument();
    expect(screen.getByText('Documento')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Reserva')).toBeInTheDocument();
    expect(screen.getByText('Dirección')).toBeInTheDocument();
    expect(screen.getByText('Celular')).toBeInTheDocument();
    expect(screen.getByText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByText('Nombre Mascota')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Mascota')).toBeInTheDocument();
    expect(screen.getByText('Fecha y Hora Reserva')).toBeInTheDocument();
    expect(screen.getByText('Solicitar')).toBeInTheDocument();
  });

  it('renderiza form fields cuando es readOnly', async () => {
    render(<BookingTemplateEditor bookingId={bookingMock.idCita} user={userMock} readOnly />);

    await waitFor(() => {
      expect(screen.getByText('Información de la Reserva')).not.toBeNull();
    });

    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Apellido')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Documento')).toBeInTheDocument();
    expect(screen.getByText('Documento')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Reserva')).toBeInTheDocument();
    expect(screen.getByText('Dirección')).toBeInTheDocument();
    expect(screen.getByText('Celular')).toBeInTheDocument();
    expect(screen.getByText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByText('Nombre Mascota')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Mascota')).toBeInTheDocument();
    expect(screen.getByText('Fecha y Hora Reserva')).toBeInTheDocument();
    expect(screen.queryByText('Solicitar')).not.toBeInTheDocument();
  });

  it('muestra la validación de errores cuando los campos requeridos están vacíos', async () => {
    render(<BookingTemplateEditor bookingId={undefined} user={userMock} />);

    const submitButton = screen.getByRole('button', { name: /Solicitar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('este campo es requerido')).toHaveLength(4);
    });
  });

  it('muestra el mensaje del toast exitoso despues de la creación de la reserva', async () => {
    mockedBookingController.prototype.create = jest.fn().mockResolvedValue({});
    render(<BookingTemplateEditor bookingId={undefined} user={userMock} />);

    fireEvent.change(screen.getByTestId('tipo-reserva-input'), { target: { value: 'Veterinaria' } });
    fireEvent.change(screen.getByTestId('nombre-mascota-input'), { target: { value: bookingMock.nombreMascota } });
    fireEvent.change(screen.getByTestId('tipo-mascota-input'), { target: { value: 'Canino' } });
    fireEvent.change(screen.getByTestId('fecha-hora-input'), {
      target: { value: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().slice(0, 16) },
    });

    const submitButton = screen.getByRole('button', { name: /Solicitar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(`Reserva de ${bookingMock.nombreMascota} creada correctamente!`, {
        duration: 4000,
      });
    });
  });

  it('actualiza la reserva exitosamente', async () => {
    mockedBookingController.prototype.getById = jest.fn().mockResolvedValue(bookingMock);
    mockedBookingController.prototype.update = jest.fn().mockResolvedValue({});
    userController.prototype.changePersonalInfo = jest.fn().mockResolvedValue({});

    render(<BookingTemplateEditor bookingId={bookingMock.idCita} user={userMock} />);

    await waitFor(() => {
      expect(screen.getByTestId('telefono-input').getAttribute('value')).toBe(String(userMock.telefono));
    });

    fireEvent.change(screen.getByTestId('telefono-input'), { target: { value: 3219000000 } });

    const submitButton = screen.getByRole('button', { name: /Editar Reserva/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(`Reserva de ${bookingMock.nombreMascota} actualizada!`, {
        duration: 4000,
      });
    });
  });
});
