'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Formik } from 'formik';
import Image from 'next/image';
import * as yup from 'yup';
import { ProductController } from '@/controllers/productController';
import { CreateProductoDto } from '@/dto/producto/createProductoDto';
import { ProductoDto } from '@/dto/producto/productoDto';
import { Spinner } from '@/components/loaders';
import toast from 'react-hot-toast';
import { MarcaDto } from '@/dto/marca/marcaDto';
import { TipoProductoDto } from '@/dto/tipoProducto/tipoProductoDto';
import { useGetMarcas } from '@/hooks/useGetMarcas';
import { useGetTipoProductos } from '@/hooks/useGetTipoProductos';
import Dinero from 'dinero.js';

interface Props {
  productId?: number;
}

interface ProductoForm {
  nombre?: string;
  descripcion?: string;
  cantidad?: string | number;
  precio?: string | number;
  imagen?: string;
  idTipo?: string | number;
  idMarca?: string | number;
}

const requiredMessage = 'este campo es requerido';

const formValidations = yup.object({
  nombre: yup.string().required(requiredMessage),
  precio: yup.number().required(requiredMessage).min(1, 'Precio mínimo: 500'),
  cantidad: yup.number().required(requiredMessage).min(1, 'Unidades mínima: 1'),
  descripcion: yup.string().optional().max(1000, 'Descripción de máximo 1000 caracteres'),
  idTipo: yup.number().optional(),
  idMarca: yup.number().optional(),
  imagen: yup.string().optional(),
});

export const ProductTemplateEditor = ({ productId }: Props) => {
  const isEditing: boolean = !!productId;
  const [product, setProducto] = useState<ProductoDto | undefined>(undefined);
  const [image, setImage] = useState<Blob | null>(null);
  const [imageSize, setImageSize] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const productController = useMemo(() => new ProductController(), []);

  const { marcas, isLoading: loadingMarcas } = useGetMarcas();
  const { tipoProductos, isLoading: loadingTipoProductos } = useGetTipoProductos();

  useEffect(() => {
    if (isEditing) {
      if (!product) {
        productController.getById(productId!).then((res: ProductoDto) => {
          setProducto(res);
          setIsLoading(false);
        });
      } else {
        setImagePreview(product.imagen || null);
      }
    } else {
      setIsLoading(false);
    }
  }, [isEditing, product, productController, productId]);

  let initialValues: ProductoForm;

  if (isEditing) {
    initialValues = {
      nombre: product?.nombre || undefined,
      descripcion: product?.descripcion || undefined,
      cantidad: product?.cantidad || undefined,
      precio: product?.precio || undefined,
      imagen: product?.imagen || undefined,
      idTipo: product?.idTipo || undefined,
      idMarca: product?.idMarca || undefined,
    };
  } else {
    initialValues = {
      nombre: undefined,
      descripcion: undefined,
      cantidad: undefined,
      precio: undefined,
      imagen: undefined,
      idTipo: undefined,
      idMarca: undefined,
    };
  }

  const onSubmit = async (values: any) => {
    try {
      toast.loading(`${isEditing ? 'Actualizando' : 'Guardando'} producto...`, { id: 'save' });
      let imageRaw: string | undefined;

      if (image) {
        const arrayBuffer: ArrayBuffer = await image.arrayBuffer();
        imageRaw = Buffer.from(arrayBuffer).toString('binary');
      }

      const product: CreateProductoDto = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        cantidad: parseInt(values.cantidad),
        precio: Number(values.precio),
        imagen: imageRaw,
        estado: 'ACTIVO',
        idTipo: values.idTipo ? parseInt(values.idTipo) : undefined,
        idMarca: values.idMarca ? parseInt(values.idMarca) : undefined,
      };

      if (isEditing) {
        await productController.update({ idProducto: productId!, ...product });
        toast.remove('save');
        toast.success(`${product.nombre} actualizado!`, { duration: 4000 });
      } else {
        await productController.create(product);
        toast.success(`${product.nombre} guardado correctamente!`, { duration: 4000 });
        toast.remove('save');
      }
    } catch (error: any) {
      toast.remove('save');
      toast.error('Error desconocido al intentar guardar, inténtalo nuevamente.', { duration: 4000 });
      console.error(error.message);
    }
  };

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      setImagePreview(URL.createObjectURL(event.target.files[0]));
      setImageSize((event.target.files[0].size / 1000000).toFixed(2));
    }
  };

  return (
    <div className="mx-auto w-fit">
      {isLoading ? (
        <Spinner data-testid="simbolo-carga-producto-editor" dog className="mx-auto -mt-80 size-1/6 h-screen" />
      ) : (
        <div className="flex justify-items-center rounded-lg bg-white shadow-md">
          <div className="w-1/2">
            {
              <Image
                className="rounded-t-lg p-8"
                width={800}
                height={800}
                src={imagePreview || '/images/no-image-found.jpg'}
                alt="product image"
              />
            }
          </div>
          <div className="w-1/2 divide-y divide-dashed divide-vino-700 px-5 pb-5 pt-6">
            <div className="pb-8">
              <span className="text-3xl font-bold text-vino-500">
                {isEditing ? 'Edición del Producto' : 'Creación del Producto'}
              </span>
            </div>

            <div className="py-4">
              <Formik initialValues={initialValues} validationSchema={formValidations} onSubmit={onSubmit}>
                {({ values, errors, touched, handleSubmit, handleChange, isSubmitting, setFieldValue }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                      <label htmlFor="nombre" className="block text-gray-600">
                        Nombre del producto
                        <span className="text-vino-700">*</span>
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        data-testid="nombre-input"
                        name="nombre"
                        className="required:* w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                        autoComplete="off"
                        onChange={handleChange}
                        value={values.nombre}
                      />
                      <div className="text-vino-700">{errors.nombre && touched.nombre && errors.nombre}</div>
                    </div>
                    <div className="mb-2">
                      <label htmlFor="descripcion" className="block text-gray-600">
                        Descripción
                      </label>
                      <textarea
                        id="descripcion"
                        name="descripcion"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                        autoComplete="off"
                        onChange={handleChange}
                        value={values.descripcion}
                      />
                      <div className="text-vino-700">
                        {errors.descripcion && touched.descripcion && errors.descripcion}
                      </div>
                    </div>
                    <div className="mb-2 flex justify-between">
                      <div className="w-1/3">
                        <label htmlFor="idTipo" className="block text-gray-600">
                          Tipo
                        </label>
                        {loadingTipoProductos ? (
                          <Spinner className="text-gray-500" />
                        ) : (
                          <select
                            name="idTipo"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                            onChange={handleChange}
                            value={values.idTipo}
                            disabled={loadingTipoProductos}
                          >
                            <option value={undefined}>Seleccionar</option>
                            {tipoProductos?.map((tipo: TipoProductoDto) => (
                              <option key={tipo.idTipoProducto} value={tipo.idTipoProducto}>
                                {tipo.nombre}
                              </option>
                            ))}
                          </select>
                        )}
                        <div className="text-vino-700">{errors.idTipo && touched.idTipo && errors.idTipo}</div>
                      </div>
                      <div className="w-2/4">
                        <label htmlFor="precio" className="block text-gray-600">
                          Precio
                          <span className="text-vino-700">*</span>
                        </label>
                        <input
                          type="text"
                          id="precio"
                          data-testid="precio-input"
                          name="precio"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                          autoComplete="off"
                          onChange={(event) => {
                            const value = event.target.value;
                            const number = value.replace(/\$|,|\./g, '');

                            setFieldValue('precio', parseInt(number));
                          }}
                          value={Dinero({ amount: Number(values.precio || 0), precision: 0 }).toFormat('$0,0')}
                        />
                        <div className="text-vino-700">{errors.precio && touched.precio && errors.precio}</div>
                      </div>
                    </div>
                    <div className="mb-2 flex justify-between">
                      <div className="w-1/3">
                        <label htmlFor="idMarca" className="block text-gray-600">
                          Marca
                        </label>
                        {loadingMarcas ? (
                          <Spinner className="text-gray-500" />
                        ) : (
                          <select
                            name="idMarca"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                            onChange={handleChange}
                            value={values.idMarca}
                            disabled={loadingMarcas}
                          >
                            <option value={undefined}>Seleccionar</option>
                            {marcas?.map((marca: MarcaDto) => (
                              <option key={marca.idMarca} value={marca.idMarca}>
                                {marca.nombre}
                              </option>
                            ))}
                          </select>
                        )}
                        <div className="text-vino-700">{errors.idMarca && touched.idMarca && errors.idMarca}</div>
                      </div>
                      <div className="w-2/4">
                        <label htmlFor="cantidad" className="block text-gray-600">
                          Unidades
                          <span className="text-vino-700">*</span>
                        </label>
                        <input
                          type="text"
                          id="cantidad"
                          data-testid="cantidad-input"
                          name="cantidad"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                          autoComplete="off"
                          onChange={(event) => {
                            const value = event.target.value;
                            const number = value.replace(/\$|,|\./g, '');

                            setFieldValue('cantidad', parseInt(number));
                          }}
                          value={Dinero({ amount: Number(values.cantidad || 0), precision: 0 }).toFormat('0,0')}
                        />
                        <div className="text-vino-700">{errors.cantidad && touched.cantidad && errors.cantidad}</div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="imagen" className="block text-gray-600">
                        Subir Imagen
                      </label>
                      <input
                        type="file"
                        id="imagen"
                        data-testid="subir-imagen-input"
                        name="imagen"
                        accept="image/*"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                        autoComplete="off"
                        onChange={onImageChange}
                      />
                      <div>{imageSize && `Peso: ${imageSize} MB`}</div>
                      <div className="text-vino-700">{errors.imagen && touched.imagen && errors.imagen}</div>
                    </div>

                    <div id="secondSection" className="flex items-center justify-between py-8">
                      <button
                        type="submit"
                        className="w-full rounded-md bg-vino-500 px-4 py-2 font-semibold text-white hover:bg-vino-600 disabled:bg-white disabled:hover:bg-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting && <Spinner />}
                        {isEditing && !isSubmitting && 'Actualizar Producto'}
                        {!isEditing && !isSubmitting && 'Guardar Producto'}
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
