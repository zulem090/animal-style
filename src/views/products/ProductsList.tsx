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
    <div className="w-fit h-fit mx-auto">
      <div className="flex justify-end mb-4">
        {user && user.role === 'ADMIN' && (
          <Link href="/products/new">
            <button className="bg-vino-500 hover:bg-vino-600 text-white font-semibold rounded-md py-2 px-4 w-50">
              Crear Producto
            </button>
          </Link>
        )}
      </div>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-10">
          {products?.length
            ? products!.map((product) => <ProductCard key={product.idProducto} producto={product} user={user} />)
            : 'No hay o no se encontró productos'}
        </div>
      </div>
    </div>
  );
};
