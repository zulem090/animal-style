import { useGetResenasProducto } from '@/hooks/useGetResenasProduct';
import { Spinner } from '../loaders';
import { Star } from './Star';

interface Props {
  productId: number;
  showPromedio?: boolean;
  showTotalResenas?: boolean;
}

export const ProductRating = ({ productId, showPromedio, showTotalResenas }: Props) => {
  const { resenas, isLoading, error } = useGetResenasProducto(productId);

  if (error) {
    return 'Error al cargar la calificación';
  }

  return (
    <>
      {isLoading ? (
        <div>
          <Spinner data-testid='simbolo-carga-producto-rating' />
        </div>
      ) : (
        <div className="flex items-center mt-3 mb-5">
          {Array.from({ length: Math.round(resenas?.puntuacionPromedio || 0) }).map((_, i) => (
            <Star key={i} />
          ))}
          {showPromedio && (
            <span data-testid="puntuacion-promedio" className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              {(resenas?.puntuacionPromedio || 0).toFixed(2)}
            </span>
          )}

          {showTotalResenas && (
            <span className="text-vino-500 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              {resenas?.numeroResenas || 0} Reseñas
            </span>
          )}
        </div>
      )}
    </>
  );
};
