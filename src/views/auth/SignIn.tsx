'use client';

import { Formik } from 'formik';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/loaders';

const requiredMessage = 'este campo es requerido';

const formValidations = yup.object({
  email: yup.string().required(requiredMessage),
  password: yup.string().required(requiredMessage),
});

interface SignInForm {
  email: string;
  password: string;
}

export const SignIn = () => {
  const router = useRouter();
  const initialValues: SignInForm = {
    email: '',
    password: '',
  };

  const onSubmit = async (values: SignInForm) => {
    try {
      const { email, password } = values;

      const response = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (response?.ok) {
        router.push('/');
        router.refresh();
      } else {
        toast.error('Correo o contraseña incorrectos!');
      }
    } catch (error: any) {
      toast.error(error);
      console.error(error.message);
    }
  };

  return (
    <div className="bg-slate-100 flex justify-center items-center h-100">
      {/* <!-- Left: Image --> */}
      <div className="w-1/2 h-screen hidden lg:block">
        <Image
          src="/images/login.svg"
          width={800}
          height={800}
          alt="Placeholder Image"
          className="object-cover w-full h-full"
        />
      </div>
      {/* <!-- Right: Login Form --> */}
      <div className="lg:p-0 xl:p-15 2xl:p-36 p-8 w-full lg:w-1/2 flex justify-center items-center">
        <div className="w-1/2">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-8">Inicio de Sesión</h1>
          </div>
          <Formik initialValues={initialValues} validationSchema={formValidations} onSubmit={onSubmit}>
            {({ values, errors, touched, handleSubmit, handleChange, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                {/* <!-- Correo Input --> */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-600">
                    Usuario ó correo electrónico
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-vino-500"
                    autoComplete="off"
                    onChange={handleChange}
                    value={values.email}
                  />
                  <div className="text-vino-700">{errors.email && touched.email && errors.email}</div>
                </div>
                {/* <!-- Password Input --> */}
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-600">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-vino-500"
                    autoComplete="off"
                    onChange={handleChange}
                    value={values.password}
                  />
                  <div className="text-vino-700">{errors.password && touched.password && errors.password}</div>
                </div>
                {/* <!-- Remember Me Checkbox --> */}
                <div className="mb-4 flex items-center">
                  <input type="checkbox" id="remember" name="remember" className="text-vino-500" />
                  <label htmlFor="remember" className="text-gray-600 ml-2">
                    Recuérdame
                  </label>
                </div>
                {/* <!-- Forgot Password Link --> */}
                <div className="mb-6 text-vino-500">
                  <Link href="#" className="hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                {/* <!-- Login Button --> */}
                <button
                  type="submit"
                  className=" bg-vino-500 hover:bg-vino-600 text-white font-semibold rounded-md py-2 px-4 w-full disabled:bg-slate-100 disabled:hover:bg-slate-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Spinner size={40} /> : 'Ingresar'}
                </button>
              </form>
            )}
          </Formik>
          {/* <!-- Sign up  Link --> */}
          <div className="mt-6 text-vino-500 text-center">
            <Link href="/signup" className="hover:underline">
              Regístrate Aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
