jest.mock('dotenv', () => ({
  config: (...args: unknown[]) => mockConfig(...args),
}));

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({})),
}));

const mockConfig = jest.fn();

describe('prisma', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules(); // Reiniciar el caché de módulos
  });

  it('debe crear una instancia de PrismaClient en ambiente de Producción', () => {
    process.env.NODE_ENV = 'production';
    jest.doMock('@prisma/client', () => ({
      PrismaClient: jest.fn(),
    }));
    require('./prisma'); // Importar después de configurar el mock

    expect(require('@prisma/client').PrismaClient).toHaveBeenCalledTimes(1);
    expect(mockConfig).not.toHaveBeenCalled();
  });

  it('debe de usar la instancia global de PrismaClient en ambiente no productivo', () => {
    process.env.NODE_ENV = 'development';
    jest.doMock('@prisma/client', () => ({
      PrismaClient: jest.fn(),
    }));
    (global as any).prisma = {};
    require('./prisma'); // Importar después de configurar el mock

    expect(require('@prisma/client').PrismaClient).toHaveBeenCalledTimes(0); // No hay instancias creadas
    expect(mockConfig).toHaveBeenCalledWith({ path: '/.env.development' });
  });

  it('debe crear una instancia de PrismaClient en ambiente no productivo si la instancia global no existe', () => {
    process.env.NODE_ENV = 'development';
    jest.doMock('@prisma/client', () => ({
      PrismaClient: jest.fn(),
    }));
    (global as any).prisma = undefined;
    require('./prisma'); // Importar después de configurar el mock

    expect(require('@prisma/client').PrismaClient).toHaveBeenCalledTimes(1);
    expect(mockConfig).toHaveBeenCalledWith({ path: '/.env.development' });
  });
});
