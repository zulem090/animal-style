'use client';

import { MarcaController } from '@/controllers/marcaController';
import { MarcaDto } from '@/dto/marca/marcaDto';
import { useEffect, useMemo, useState } from 'react';

export const useGetMarcas = () => {
  const marcaController = useMemo(() => new MarcaController(), []);

  const [marcas, setMarcas] = useState<MarcaDto[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    marcaController
      .getAll()
      .then((data) => {
        setMarcas(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [marcaController]);

  return { marcas, isLoading, error };
};
