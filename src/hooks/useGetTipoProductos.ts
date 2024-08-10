import { TipoProductController } from '@/controllers/tipoProductoController';
import { TipoProductoDto } from '@/dto/tipoProducto/tipoProductoDto';
import { useEffect, useMemo, useState } from 'react';

export const useGetTipoProductos = () => {
  const tipoProductoController = useMemo(() => new TipoProductController(), []);

  const [tipoProductos, setTipoProductos] = useState<TipoProductoDto[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    tipoProductoController
      .getAll()
      .then((data) => {
        setTipoProductos(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [tipoProductoController]);

  return { tipoProductos, isLoading, error };
};
