'use client';

import { ProductController } from '@/controllers/productController';
import { ProductoDto } from '@/dto/producto/productoDto';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineDisabledVisible } from 'react-icons/md';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { IoTrashOutline } from 'react-icons/io5';
import { User as UserSession } from 'next-auth';
import { useMemo, useState } from 'react';
import { Spinner } from '../loaders';
import { ProductRating } from './ProductRating';
import { titleFormat } from '@/helpers/shared/titleFormat';

interface Props {
  user?: UserSession;
  producto: ProductoDto;
}

export const ProductCard = ({ producto, user }: Props) => {
  const router = useRouter();
  const productController = useMemo(() => new ProductController(), []);

  const [loadEdit, setLoadEdit] = useState<boolean>(false);
  const [loadDelete, setLoadDelete] = useState<boolean>(false);
  const [loadStatus, setLoadStatus] = useState<boolean>(false);

  const isActivo: boolean = producto.estado === 'ACTIVO';

  const statusIcon = isActivo ? <IoCheckmarkCircleOutline size={20} /> : <MdOutlineDisabledVisible size={20} />;

  const handleEdit = () => {
    setLoadEdit(true);
    router.push(`/products/${producto.idProducto}/edit`);
  };

  const handleDeleteProduct = async () => {
    setLoadDelete(true);

    toast.loading(`Eliminando ${producto.nombre}...`, { id: 'loadingDelete' });
    try {
      await productController.deleteById(producto.idProducto);
      toast.remove('loadingDelete');
      toast.success(`${producto.nombre} ha sido eliminado!`, { duration: 4000 });
    } catch (error) {
      console.error(error);
      toast.remove('loadingDelete');
      toast.error(`Error inesperado al eliminar ${producto.nombre}, inténtelo nuevamente`, { duration: 4000 });
    }
  };

  const handleActiveProduct = async () => {
    setLoadStatus(true);

    toast.loading(`Activando ${producto.nombre}...`, { id: 'loadingStatus' });
    try {
      await productController.activeById(producto.idProducto);
      toast.remove('loadingStatus');
      toast.success(`${producto.nombre} ha sido activado!`, { duration: 3000 });
      setLoadStatus(false);
    } catch (error) {
      console.error(error);
      toast.remove('loadingStatus');
      toast.error(`Error inesperado al activar ${producto.nombre}, inténtelo nuevamente`, { duration: 3000 });
      setLoadStatus(false);
    }
  };

  const handleInactiveProduct = async () => {
    setLoadStatus(true);

    toast.loading(`Inactivando ${producto.nombre}...`, { id: 'loadingStatus' });
    try {
      await productController.inactiveById(producto.idProducto);
      toast.remove('loadingStatus');
      toast.success(`${producto.nombre} ha sido inactivado!`, { duration: 3000 });
      setLoadStatus(false);
    } catch (error) {
      console.error(error);
      toast.remove('loadingStatus');
      toast.error(`Error inesperado al inactivar ${producto.nombre}, inténtelo nuevamente`, { duration: 3000 });
      setLoadStatus(false);
    }
  };

  return (
    <div className="flex max-w-sm flex-wrap justify-between rounded-lg border p-4 shadow-md">
      <div className="flex flex-wrap content-start">
        <div className="h-fit w-full">
          <Image
            src={producto.imagen || '/images/no-image-found.jpg'}
            alt={producto.nombre}
            className="h-48 w-full rounded-md object-cover"
            height={100}
            width={100}
          />
        </div>
        <div className="flex w-full flex-wrap justify-between px-1 py-4">
          <div>
            <div className="mb-2 text-xl font-bold text-vino-500">
              <p>
                {producto.nombre}
                {user?.role === 'ADMIN' && (
                  <span className={`ml-2 text-xs ${isActivo ? 'text-blue-400' : 'text-red-400'}`}>
                    {titleFormat(producto.estado)}
                  </span>
                )}
              </p>
            </div>
            <ProductRating productId={producto.idProducto} />
            <div className="w-full">
              <p className="mb-8 min-h-[120px] text-base text-slate-600">
                {producto.descripcion?.length! > 150
                  ? `${producto.descripcion?.substring(0, 150)}...`
                  : producto.descripcion}
              </p>
            </div>
          </div>

          <div className="flex min-h-20 w-full flex-wrap">
            <div className="w-full self-end">
              <p className="text-base text-slate-600">
                <span className="font-bold">Tipo:</span> {producto.tipo}
              </p>
              <p className="mb-6 text-base text-slate-600">
                <span className="font-bold">Marca:</span> {producto.marca}
              </p>
              <p className="text-base font-bold text-vino-700">$ {producto.precio.toLocaleString()}</p>
              <p className="text-base text-slate-600">En stock: {producto.cantidad.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between self-end px-1 py-4">
        <div className="self-center">
          <Link href={`/products/${producto.idProducto}`} className="text-vino-500 hover:text-vino-700 hover:underline">
            Leer más
          </Link>
        </div>
        {user && user.role === 'ADMIN' && (
          <div>
            <button
              data-testid="boton-editar"
              className="mr-2 rounded-lg bg-vino-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-vino-600 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleEdit}
              disabled={loadEdit}
            >
              {loadEdit ? <Spinner className="text-white" /> : <FaRegEdit size={20} />}
            </button>
            <button
              data-testid="boton-cambiar-estado"
              className={`text-white ${
                isActivo ? 'bg-blue-400 hover:bg-blue-600' : 'bg-gray-400 hover:bg-gray-600'
              } mr-2 rounded-lg px-5 py-2.5 text-center text-sm font-medium focus:ring-4 focus:ring-blue-300`}
              onClick={isActivo ? handleInactiveProduct : handleActiveProduct}
              disabled={loadStatus}
            >
              {loadStatus ? <Spinner className="text-white" /> : statusIcon}
            </button>
            <button
              data-testid="boton-eliminar"
              className="rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-blue-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              onClick={handleDeleteProduct}
              disabled={loadDelete}
            >
              {loadDelete ? <Spinner className="text-white" /> : <IoTrashOutline size={20} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
