import { usePuntuacionesProducto } from '@/hooks/useGetResenasProduct';
import { Spinner } from '../loaders';
import { Star } from './Star';

interface Props {
  productId: number;
  showPromedio?: boolean;
  showTotalResenas?: boolean;
}

export const ProductRating = ({ productId, showPromedio, showTotalResenas }: Props) => {
  const { puntuaciones, isLoading, error } = usePuntuacionesProducto(productId);

  if (error) {
    return 'Error al cargar la calificación';
  }

  return (
    <>
      {isLoading ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <div className="flex items-center mt-3 mb-5">
          {Array.from({ length: Math.round(puntuaciones?.puntuacionPromedio || 0) }).map((_, i) => (
            <Star key={i} />
          ))}
          {showPromedio && (
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              {(puntuaciones?.puntuacionPromedio || 0).toFixed(2) || 0}
            </span>
          )}

          {showTotalResenas && (
            <span className="text-vino-500 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              {puntuaciones?.numeroResenas || 0} Reseñas
            </span>
          )}
        </div>
      )}
    </>
  );
};
