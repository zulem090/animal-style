import { render, screen } from '@testing-library/react';
import { TopMenuItem } from '@/components/TopMenuItem';
import { usePathname } from 'next/navigation';

// Mock de usePathname
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock de next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe('TopMenuItem', () => {
  const mockTitle = 'Inicio';
  const mockPath = '/';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería aplicar la clase "text-blue-600" cuando la ruta coincide', () => {
    // Simula que la ruta actual es "/"
    (usePathname as jest.Mock).mockReturnValue(mockPath);

    render(<TopMenuItem title={mockTitle} path={mockPath} />);

    // Verifica que el enlace contiene el texto proporcionado
    const linkElement = screen.getByText(mockTitle);
    expect(linkElement).toBeInTheDocument();

    // Verifica que se aplica la clase "text-blue-600" cuando la ruta coincide
    expect(linkElement).toHaveClass('text-vino-600 font-semibold text-lg');
  });

  it('debería aplicar la clase "text-black" cuando la ruta no coincide', () => {
    // Simula que la ruta actual es "/about"
    (usePathname as jest.Mock).mockReturnValue('/about');

    render(<TopMenuItem title={mockTitle} path={mockPath} />);

    // Verifica que el enlace contiene el texto proporcionado
    const linkElement = screen.getByText(mockTitle);
    expect(linkElement).toBeInTheDocument();

    // Verifica que se aplica la clase "text-black" cuando la ruta no coincide
    expect(linkElement).toHaveClass('text-black');
  });

  it('debería renderizar el enlace correctamente con el href correcto', () => {
    // Simula que la ruta actual es "/"
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<TopMenuItem title={mockTitle} path={mockPath} />);

    // Verifica que el enlace tiene el atributo href correcto
    const linkElement = screen.getByRole('link', { name: mockTitle });
    expect(linkElement).toHaveAttribute('href', mockPath);
  });
});
