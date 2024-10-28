import Link from 'next/link';

export const Inicio = () => {
  return (
    <>
      <div className="mb-10">
        <p className="text-3xl">Hola! Bienvenido al lugar perfecto para tu mascota!</p>
      </div>

      <Link className="cursor-pointer text-xl font-semibold text-vino-500 hover:text-vino-700" href={'/products'}>
        Ir a productos!
      </Link>
    </>
  );
};
