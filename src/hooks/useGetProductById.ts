'use client';

import { ProductController } from '@/controllers/productController';
import { ProductoDto } from '@/dto/producto/productoDto';
import { useEffect, useMemo, useState } from 'react';

export const useGetProductById = (productId: number) => {
  const productController = useMemo(() => new ProductController(), []);

  const [product, setProduct] = useState<ProductoDto | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    productController
      .getById(productId)
      .then((data) => {
        setProduct(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [productController, productId]);

  return { product, isLoading, error };
};
