import { ProductCard } from '@/components/products';
import { ProductoDto } from '@/dto/producto/productoDto';
import { User as UserSession } from 'next-auth';
import Link from 'next/link';

interface Props {
  user?: UserSession;
  products?: ProductoDto[];
}

export const ProductsList = ({ user, products }: Props) => {
  return (
    <div className="mx-auto h-fit w-fit">
      <span className="text-4xl font-bold text-vino-500">Productos</span>
      <div className="mb-4 flex justify-end">
        {user && user.role === 'ADMIN' && (
          <Link href="/products/new">
            <button className="w-50 rounded-md bg-vino-500 px-4 py-2 font-semibold text-white hover:bg-vino-600">
              Crear Producto
            </button>
          </Link>
        )}
      </div>
      <div>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {products?.length
            ? products!.map((product) => <ProductCard key={product.idProducto} producto={product} user={user} />)
            : 'No hay o no se encontró productos'}
        </div>
      </div>
    </div>
  );
};
