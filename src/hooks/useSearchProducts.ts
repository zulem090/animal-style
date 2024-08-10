'use client';

import { ProductController } from '@/controllers/productController';
import { ProductoDto } from '@/dto/producto/productoDto';
import { useEffect, useMemo, useState } from 'react';

export const useSearchProducts = (searchTerm: string = '') => {
  const productController = useMemo(() => new ProductController(), []);

  const [products, setProducts] = useState<ProductoDto[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      setIsLoading(true);

      productController
        .getAll(0, 100, searchTerm)
        .then((data) => {
          setProducts(data);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    }
  }, [productController, searchTerm]);

  return { products, isLoading, error };
};
