'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function BookingsPage() {
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
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2 flex justify-center items-center">
        <div className="w-1/2">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-8">Inicio de Sesión</h1>
          </div>
          <form action="#" method="POST">
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600">
                Correo electrónico
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-vino-500"
                autoComplete="off"
              />
            </div>
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
              />
            </div>
            <div className="mb-4 flex items-center">
              <input type="checkbox" id="remember" name="remember" className="text-vino-500" />
              <label htmlFor="remember" className="text-gray-600 ml-2">
                Recuérdame
              </label>
            </div>
            <div className="mb-6 text-vino-500">
              <a href="#" className="hover:underline">
                Olvidaste Contraseña?
              </a>
            </div>
            <button
              type="submit"
              className="bg-vino-500 hover:bg-vino-600 text-white font-semibold rounded-md py-2 px-4 w-full"
            >
              Ingresar
            </button>
          </form>
          <div className="mt-6 text-vino-500 text-center">
            <Link href="/signup" className="hover:underline">
              Regístrate Aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
