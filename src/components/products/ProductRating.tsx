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
          <Spinner data-testid="simbolo-carga-producto-rating" />
        </div>
      ) : (
        <div className="mb-5 mt-3 flex items-center">
          {Array.from({ length: Math.round(resenas?.puntuacionPromedio || 0) }).map((_, i) => (
            <Star key={i} />
          ))}
          {showPromedio && (
            <span
              data-testid="puntuacion-promedio"
              className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800"
            >
              {(resenas?.puntuacionPromedio || 0).toFixed(2)}
            </span>
          )}

          {showTotalResenas && (
            <span className="mr-2 rounded px-2.5 py-0.5 text-xs font-semibold text-vino-500">
              {resenas?.numeroResenas || 0} Reseñas
            </span>
          )}
        </div>
      )}
    </>
  );
};
