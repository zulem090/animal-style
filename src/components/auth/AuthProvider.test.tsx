import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from './AuthProvider';

jest.mock('next-auth/react', () => ({
  SessionProvider: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('AuthProvider', () => {
  it('debería renderizar sus hijos dentro de SessionProvider', () => {
    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    );

    const childElement = screen.getByText(/Test Child/i);
    expect(childElement).toBeInTheDocument();
  });

  it('debería usar el SessionProvider correctamente', () => {
    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    );

    expect(SessionProvider).toHaveBeenCalled();
  });
});
