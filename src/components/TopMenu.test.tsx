import { render, screen, waitFor } from '@testing-library/react';
import { TopMenu } from '@/components/TopMenu';
import { getUserSession } from '@/helpers/auth/getUserSession';
import { User as UserSession } from 'next-auth';

jest.mock('@/components/products/SearchProduct', () => ({
  SearchProduct: jest.fn(() => <div>Search Product Component</div>),
}));

// Mock de getUserSession
jest.mock('@/helpers/auth/getUserSession', () => ({
  getUserSession: jest.fn(),
}));

// Mock de Link y otros componentes
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    href: string;
    'data-testid': string;
  }) => (
    <a href={href} data-testid={dataTestId}>
      {children}
    </a>
  ),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) => (
    <img src={src} alt={alt} width={width} height={height} />
  ),
}));

jest.mock('@/components/auth/LogoutButton', () => ({
  LogoutButton: () => <button>Logout</button>,
}));

describe('TopMenu', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrar el logo y los elementos del menú', async () => {
    // Mock sin sesión de usuario
    (getUserSession as jest.Mock).mockResolvedValue(undefined);

    render(await TopMenu());

    // Verifica que el logo se renderiza
    const logo = screen.getByAltText('Anymal Style');
    expect(logo).toBeInTheDocument();

    // Verifica que los elementos del menú se renderizan
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
  });

  it('debería mostrar el ícono de login cuando no hay usuario', async () => {
    // Mock sin sesión de usuario
    (getUserSession as jest.Mock).mockResolvedValue(undefined);

    render(await TopMenu());

    // Verifica que el ícono de login se muestra
    expect(screen.getByTestId('login-link')).toBeInTheDocument();
  });

  it('debería mostrar el nombre del usuario y el botón de logout cuando hay usuario', async () => {
    // Mock con sesión de usuario
    const mockUser: UserSession = {
      id: '1',
      role: 'ADMIN',
      name: 'Pepe',
    };

    (getUserSession as jest.Mock).mockResolvedValue(mockUser);

    render(await TopMenu());

    await waitFor(() => {
      // Verifica que el nombre del usuario se muestra
      expect(screen.getByText(/Hola Pepe/i)).toBeInTheDocument();
    });

    // Verifica que el rol de usuario se muestra
    expect(screen.getByText('ADMIN')).toBeInTheDocument();

    // Verifica que el botón de logout se muestra
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('debería mostrar saludo por defecto cuando el usuario logueado no tiene un nombre guardado', async () => {
    // Mock con sesión de usuario
    const mockUser: UserSession = {
      id: '1',
      role: 'ADMIN',
    };

    (getUserSession as jest.Mock).mockResolvedValue(mockUser);

    render(await TopMenu());

    await waitFor(() => {
      // Verifica que el nombre del usuario se muestra
      expect(screen.getByText(/Hola Usuario/i)).toBeInTheDocument();
    });

    // Verifica que el rol de usuario se muestra
    expect(screen.getByText('ADMIN')).toBeInTheDocument();

    // Verifica que el botón de logout se muestra
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
