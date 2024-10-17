import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { AuthController } from '@/controllers/authController';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { SignUp } from './SignUp';

// Mock de las dependencias
jest.mock('@/controllers/authController', () => ({
  AuthController: jest.fn().mockImplementation(() => ({
    createUser: jest.fn(),
  })),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('SignUp Component', () => {
  const mockPush = jest.fn();
  const mockCreateUser = jest.fn();

  beforeEach(() => {
    (AuthController as jest.Mock).mockImplementation(() => ({
      createUser: mockCreateUser,
    }));

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    jest.clearAllMocks();
  });

  it('debería renderizar correctamente el formulario de registro', () => {
    render(<SignUp />);

    // Verificamos que los campos principales estén presentes
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cédula de ciudadanía/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByText(/registrarse/i)).toBeInTheDocument();
  });

  it('debería mostrar errores de validación si se intenta enviar el formulario vacío', async () => {
    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/Celular/i), {
      target: { value: 0 },
    });
    fireEvent.click(screen.getByText(/registrarse/i));

    await waitFor(() => {
      expect(screen.getAllByText(/este campo es requerido/i)).toHaveLength(5);
      expect(screen.getAllByText(/Unidades mínima: 1/i)).toHaveLength(1);
    });
  });

  it('debería llamar a createUser con los valores correctos cuando el formulario es válido', async () => {
    render(<SignUp />);

    // Simulamos el llenado del formulario
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Juan' },
    });
    fireEvent.change(screen.getByLabelText(/apellido/i), {
      target: { value: 'Pérez' },
    });
    fireEvent.change(screen.getByLabelText(/cédula de ciudadanía/i), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText(/Celular/i), {
      target: { value: '3000000000' },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: 'usuarioTest' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    });

    // Mock de createUser para simular una respuesta exitosa
    mockCreateUser.mockResolvedValue({ error: null });

    fireEvent.click(screen.getByText(/registrarse/i));

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(
        {
          nombre: 'Juan',
          apellido: 'Pérez',
          cedula: 123456,
          telefono: 3000000000,
          email: 'test@test.com',
          usuario: 'usuarioTest',
          password: 'password123',
        },
        false,
      );
    });

    // Verificamos que se muestre el mensaje de éxito y se haga el push a /signin
    expect(toast.success).toHaveBeenCalledWith('Usuario creado correctamente!', { duration: 4000 });
    expect(mockPush).toHaveBeenCalledWith('/signin');
  });

  it('debería mostrar un mensaje de error si createUser devuelve un error', async () => {
    render(<SignUp />);

    // Simulamos el llenado del formulario
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Juan' },
    });
    fireEvent.change(screen.getByLabelText(/apellido/i), {
      target: { value: 'Velez' },
    });
    fireEvent.change(screen.getByLabelText(/cédula de ciudadanía/i), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText(/celular/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: 'usuarioTest' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    });

    // Mock de createUser para simular un error
    const errorMessage = 'Este usuario ya existe';
    mockCreateUser.mockResolvedValue({ error: { message: errorMessage } });

    fireEvent.click(screen.getByText(/registrarse/i));

    await waitFor(() => {
      // Verificamos que se haya llamado al toast con el error
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      // Verificamos que el error se haya mostrado en pantalla
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Verificamos que no se redirigió
    expect(mockPush).not.toHaveBeenCalled();
  });
});
