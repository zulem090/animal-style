import { render, screen, fireEvent } from '@testing-library/react';
import { signOut } from 'next-auth/react';
import { LogoutButton } from './LogoutButton';

jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
}));

describe('LogoutButton', () => {
  it('debería renderizar el botón de cerrar sesión', () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button', { name: /cerrar sesión/i });
    expect(button).toBeInTheDocument();
  });

  it('debería llamar a signOut cuando se hace clic en el botón', () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button', { name: /cerrar sesión/i });

    fireEvent.click(button);

    expect(signOut).toHaveBeenCalled();
  });
});
