'use client';

import { ResenaController } from '@/controllers/resenaController';
import { ResenaDto } from '@/dto/resena/resenaDto';
import { useEffect, useMemo, useState } from 'react';

export const usePuntuacionesProducto = (productId: number) => {
  const resenaController = useMemo(() => new ResenaController(), []);

  const [puntuaciones, setResenas] = useState<ResenaDto | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    resenaController
      .getResenasProducto(productId)
      .then((data) => {
        setResenas(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [resenaController, productId]);

  return { puntuaciones, isLoading, error };
};
