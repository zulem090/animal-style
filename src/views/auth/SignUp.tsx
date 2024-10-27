'use client';

import { AuthController } from '@/controllers/authController';
import { Formik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { Spinner } from '@/components/loaders';
import { useRouter } from 'next/navigation';

const requiredMessage = 'este campo es requerido';

const formValidations = yup.object({
  nombre: yup.string().required(requiredMessage),
  apellido: yup.string().optional(),
  cedula: yup.number().required(requiredMessage).min(1, 'Unidades mínima: 1'),
  telefono: yup.number().optional().min(1, 'Unidades mínima: 1'),
  email: yup.string().email('debe ser un correo váldio').required(requiredMessage),
  usuario: yup.string().required(requiredMessage),
  password: yup.string().required(requiredMessage).length(6, 'Contraseña debe de tener mínimo 6 caracteres'),
});

export const SignUp = () => {
  const authController = useMemo(() => new AuthController(), []);
  const router = useRouter();

  const initialValues = {
    nombre: undefined,
    apellido: undefined,
    cedula: undefined,
    telefono: undefined,
    email: undefined,
    usuario: undefined,
    password: undefined,
  };

  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const onSubmit = async (values: any) => {
    const { error } = await authController.createUser(values, false);

    if (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    } else {
      toast.success('Usuario creado correctamente!', { duration: 4000 });
      router.push('/signin');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      {/* <!-- Left: Image --> */}
      <div className="hidden h-screen w-1/2 lg:block">
        <Image
          src="/images/signup.svg"
          width={923}
          height={923}
          alt="Placeholder Image"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="lg:p-18 md:p-30 sm:20 flex w-full items-center justify-center p-8 lg:w-1/2">
        <div>
          <div className="text-center">
            <h1 className="mb-8 text-2xl font-semibold">Registro</h1>
          </div>
          <Formik initialValues={initialValues} validationSchema={formValidations} onSubmit={onSubmit}>
            {({ values, errors, touched, handleSubmit, handleChange, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  {/* <!-- Nombre Input --> */}
                  <div className="mb-4">
                    <label htmlFor="nombre" className="block text-gray-600">
                      Nombre
                      <span className="text-vino-700">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                      autoComplete="off"
                      onChange={handleChange}
                      value={values.nombre}
                    />
                    <div className="text-vino-700">{errors.nombre && touched.nombre && errors.nombre}</div>
                  </div>
                  {/* <!-- Apellido Input --> */}
                  <div className="mb-4">
                    <label htmlFor="apellido" className="block text-gray-600">
                      Apellido
                    </label>
                    <input
                      type="apellido"
                      id="apellido"
                      name="apellido"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                      autoComplete="off"
                      onChange={handleChange}
                      value={values.apellido}
                    />
                  </div>
                </div>
                <div className="2 mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {/* <!-- Cédula Input --> */}
                  <div>
                    <label htmlFor="cedula" className="block text-gray-600">
                      Cédula de Ciudadanía
                      <span className="text-vino-700">*</span>
                    </label>
                    <input
                      type="number"
                      id="cedula"
                      name="cedula"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                      autoComplete="off"
                      onChange={handleChange}
                      value={values.cedula}
                    />
                    <div className="text-vino-700">{errors.cedula && touched.cedula && errors.cedula}</div>
                  </div>
                  {/* <!-- Celular Input --> */}
                  <div>
                    <label htmlFor="telefono" className="block text-gray-600">
                      Celular
                    </label>
                    <input
                      type="number"
                      id="telefono"
                      name="telefono"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                      autoComplete="off"
                      onChange={handleChange}
                      value={values.telefono}
                    />
                    <div className="text-vino-700">{errors.telefono && touched.telefono && errors.telefono}</div>
                  </div>
                </div>
                <div className="mb-4">
                  {/* <!-- Correo Electrónco Input --> */}
                  <label htmlFor="email" className="block text-gray-600">
                    Correo electrónico
                    <span className="text-vino-700">*</span>
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                    autoComplete="off"
                    onChange={handleChange}
                    value={values.email}
                  />
                  <div className="text-vino-700">{errors.email && touched.email && errors.email}</div>
                </div>
                <div className="mb-4">
                  {/* <!-- Usuario Input --> */}
                  <label htmlFor="usuario" className="block text-gray-600">
                    Usuario
                    <span className="text-vino-700">*</span>
                  </label>
                  <input
                    type="text"
                    id="usuario"
                    name="usuario"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                    autoComplete="off"
                    onChange={handleChange}
                    value={values.usuario}
                  />
                  <div className="text-vino-700">{errors.usuario && touched.usuario && errors.usuario}</div>
                </div>
                {/* <!-- Password Input --> */}
                <div className="mb-8">
                  <label htmlFor="password" className="block text-gray-600">
                    Contraseña
                    <span className="text-vino-700">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                    autoComplete="off"
                    onChange={handleChange}
                    value={values.password}
                  />
                  <div className="text-vino-700">{errors.password && touched.password && errors.password}</div>
                </div>
                <div className="text-vino-700">{errorMessage}</div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-vino-500 px-4 py-2 font-semibold text-white hover:bg-vino-600 disabled:bg-slate-100 disabled:hover:bg-slate-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Spinner /> : 'Registrarse'}
                </button>
              </form>
            )}
          </Formik>
          <div className="mt-6 text-center text-vino-500">
            <Link href="/signin" className="hover:underline">
              Inicia Sesión Aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
