import Image from 'next/image';
import Link from 'next/link';

export const Inicio = () => {
  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0">
        <Image
          src="/images/landing-page-image.png"
          alt="Anymal Style"
          layout="fill"
          objectFit="cover"
          className="opacity-80 blur-md"
          priority
        />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-black">
        <div className="bg-transparent">
          <div className="mb-64">
            <p className="text-5xl">¡Hola! Bienvenido al lugar perfecto para tu mascota!</p>
          </div>
          <div className="mb-20">
            <Link
              href={'/products'}
              className="cursor-pointer text-4xl font-semibold text-vino-500 hover:text-vino-700"
            >
              Ir a productos!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
