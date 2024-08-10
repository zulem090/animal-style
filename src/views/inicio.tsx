import Link from "next/link";

export const Inicio = () => {
  return (
    <>
      <div className="mb-10">
        <p className="text-3xl">Hola! Bienvenido al lugar perfecto para tu mascota!</p>
      </div>

      <Link className="text-xl font-semibold cursor-pointer text-vino-500 hover:text-vino-700" href={'/products'}>Ir a productos!</Link>
    </>
  );
};
