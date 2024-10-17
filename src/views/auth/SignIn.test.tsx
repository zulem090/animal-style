import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { SignIn } from './SignIn';

// Mock de las dependencias
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('SignIn Component', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    // Mockeamos el router con sus métodos
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });

    jest.clearAllMocks();
  });

  it('debería renderizar correctamente el formulario de inicio de sesión', () => {
    render(<SignIn />);

    // Validamos que los elementos principales estén presentes
    expect(screen.getByLabelText(/usuario ó correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByText(/ingresar/i)).toBeInTheDocument();
    expect(screen.getByText(/¿olvidaste tu contraseña\?/i)).toBeInTheDocument();
  });

  it('debería mostrar errores de validación si se intenta enviar el formulario vacío', async () => {
    render(<SignIn />);

    // Disparamos el submit sin llenar el formulario
    fireEvent.click(screen.getByText(/ingresar/i));

    await waitFor(() => {
      // Validamos que los mensajes de error de validación aparezcan
      expect(screen.getAllByText(/este campo es requerido/i)).toHaveLength(2);
    });
  });

  it('debería llamar a signIn con las credenciales correctas', async () => {
    render(<SignIn />);

    // Simulamos el llenado del formulario
    fireEvent.change(screen.getByLabelText(/usuario ó correo electrónico/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password' },
    });

    // Mockeamos el retorno de signIn
    (signIn as jest.Mock).mockResolvedValue({ ok: true });

    // Disparamos el submit
    fireEvent.click(screen.getByText(/ingresar/i));

    await waitFor(() => {
      // Validamos que signIn fue llamado con las credenciales correctas
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@test.com',
        password: 'password',
        redirect: false,
      });
    });

    // Verificamos si se redirigió a la página principal y refrescó
    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('debería mostrar un error si las credenciales son incorrectas', async () => {
    render(<SignIn />);

    // Simulamos el llenado del formulario
    fireEvent.change(screen.getByLabelText(/usuario ó correo electrónico/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'wrongpassword' },
    });

    // Mockeamos el retorno de signIn para simular un error
    (signIn as jest.Mock).mockResolvedValue({ ok: false });

    // Disparamos el submit
    fireEvent.click(screen.getByText(/ingresar/i));

    await waitFor(() => {
      // Validamos que se muestra un mensaje de error
      expect(toast.error).toHaveBeenCalledWith('Correo o contraseña incorrectos!');
    });

    // Verificamos que no se redirigió
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('debería mostrar un error si ocurre una excepción durante el inicio de sesión', async () => {
    render(<SignIn />);

    // Simulamos el llenado del formulario
    fireEvent.change(screen.getByLabelText(/usuario ó correo electrónico/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password' },
    });

    // Mockeamos el retorno de signIn para simular una excepción
    (signIn as jest.Mock).mockRejectedValue(new Error('Error insperado al hacer login'));

    // Disparamos el submit
    fireEvent.click(screen.getByText(/ingresar/i));

    await waitFor(() => {
      // Validamos que se muestra un mensaje de error genérico
      expect(toast.error).toHaveBeenCalledWith(new Error('Error insperado al hacer login'));
    });

    // Verificamos que no se redirigió
    expect(mockPush).not.toHaveBeenCalled();
  });
});
