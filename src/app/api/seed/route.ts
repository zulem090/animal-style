export const dynamic = 'force-dynamic'; // Para prevenir que next ejecute la ruta en el build (o sea en modo estático)

import { CreateUsuarioDto } from '@/dto/auth/CreateUsuarioDto';
import { signUpUser } from '@/models/authModel';
import prisma from '@/orm/prisma';
import { NextResponse } from 'next/server';
import { Faker, es, es_MX } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

import agility from '@/../public/images/productos/agility.jpg';
import cama from '@/../public/images/productos/cama.webp';
import churu from '@/../public/images/productos/churuuu.webp';
import equilibrio from '@/../public/images/productos/equilibrio.jpg';
import path from 'path';

import fs from 'fs';

const base64ToBuffer = (base64String: string): Buffer => {
  const base64Data = base64String.replace(/^data:image\/.*?;base64,/, ''); // Ej: data:image/svg+xml;base64,PHN2ZyB4bW
  return Buffer.from(base64Data, 'base64');
};

const localPathToBuffer = (imagePath: string): Buffer => {
  const rootDir = process.cwd();

  const file: Buffer = fs.readFileSync(path.join(rootDir, imagePath.replace('_next', '.next')));

  return file;
};

export async function GET() {
  const faker = new Faker({
    locale: [es_MX, es],
  });

  await prisma.marca.deleteMany();
  await prisma.tipoProducto.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.resena.deleteMany();

  await prisma.tipoProducto.createMany({
    data: [
      { idTipoProducto: 1, nombre: 'Juguete' },
      { idTipoProducto: 2, nombre: 'Comida' },
      { idTipoProducto: 3, nombre: 'Gimnasios' },
      { idTipoProducto: 4, nombre: 'Camas' },
    ],
  });

  await prisma.marca.createMany({
    data: [
      { idMarca: 1, nombre: 'Dogchow' },
      { idMarca: 2, nombre: 'Hills' },
      { idMarca: 3, nombre: 'Besties' },
      { idMarca: 4, nombre: 'Pro Plan' },
      { idMarca: 5, nombre: 'Guamba' },
      { idMarca: 6, nombre: 'Equilibrio' },
      { idMarca: 7, nombre: 'Inaba Premium' },
      { idMarca: 8, nombre: 'Agility Gold' },
    ],
  });

  console.log('CREANDO PRODUCTOS!');

  await prisma.producto.createMany({
    data: [
      {
        nombre: 'Churu inaba',
        descripcion:
          '¡Estos sabrosos snacks para gatos se hacen con atún silvestre o pollo criado en granjas puro y natural! Disponibles en nueve variedades deliciosas, los Churu® Purés tienen el alto contenido de humedad necesario para la salud de los felinos.',
        precio: 24000,
        cantidad: 90,
        idMarca: 7,
        idTipo: 2,
        imagen: churu.src,
      },
      {
        nombre: 'Equilibrio Gato Adulto Castrado +7 Años 1.5 Kg',
        descripcion:
          'Equilibrio Gato Adulto Castrado +7 Años 1.5 Kg es un alimento completo para gatos mayores de 7 años. Combina ingredientes que colaboran al control del peso, previene  la acumulación de pelotas de pelo en el tracto digestivo, auxilia en el mantenimiento de la salud del tracto urinario.',
        precio: 90000,
        cantidad: 70,
        idMarca: 6,
        idTipo: 2,
        imagen: equilibrio.src,
      },
      {
        nombre: 'Cama para perro antiestrés tipo Donut',
        descripcion:
          'Gracias a su forma redonda, la cama para perros tipo donut de alta calidad es ideal para las mascotas a las que les encanta acurrucarse. El borde elevado de esta cama para perros crea una sensación de seguridad y proporciona soporte para la cabeza y el cuello.',
        precio: 120000,
        cantidad: 100,
        idMarca: 5,
        idTipo: 4,
        imagen: cama.src,
      },
      {
        nombre: 'Cama para perro antiestrés tipo Donut',
        descripcion:
          'Agility Gold - Pouch Trozos De Cordero Cachorro contiene 70% de carne y 30% de salsa en forma de trozos, con todos los nutrientes que requieren los perros para su óptima nutrición. Esta alternativa de alimentación beneficia la hidratación que requieren los perros diariamente. Es un alimento húmedo sin conservantes artificiales, es apto para perros de todas las razas, es hipo alergénico con nutrientes de alta calidad.',
        precio: 6000,
        cantidad: 40,
        idMarca: 8,
        idTipo: 2,
        imagen: agility.src,
      },
    ].map((producto) => ({ ...producto, imagen: localPathToBuffer(producto.imagen) })),
  });

  const rolesProbability: string[] = [
    'ADMIN',
    'ADMIN',
    'ADMIN',
    'ADMIN',
    'ADMIN',
    'ADMIN',
    'ADMIN',
    'USER',
    'USER',
    'USER',
  ];

  await prisma.user.createMany({
    data: Array.from({ length: 50 }).map((_, i) => {
      const nombre = faker.person.firstName();
      const apellido = faker.person.lastName();

      return {
        nombre,
        apellido,
        cedula: faker.number.bigInt({ min: 1000000000, max: 1999999999 }),

        email: `${i + 1}@m.com`,
        password: bcrypt.hashSync('123', 10),
        usuario: i === 0 ? 'user1' : `${nombre}${i + 1}`,
        role: i === 0 ? 'ADMIN' : rolesProbability[Math.floor(Math.random() * rolesProbability.length)],
        telefono: faker.number.bigInt({ min: 3000000000, max: 3009099999 }),
        direccion: faker.location.streetAddress(),
      };
    }),
  });

  const userAdmin: CreateUsuarioDto = {
    nombre: 'Juan',
    apellido: 'Perez',
    cedula: 1000000,
    email: 'admin@mail.com',
    password: '123',
    usuario: 'admin',
    role: 'ADMIN',
    telefono: 3000000000,
    direccion: null,
  };

  const user: CreateUsuarioDto = {
    nombre: 'Andrés',
    apellido: 'Posada',
    cedula: 1000001,
    email: 'user@mail.com',
    password: '123',
    usuario: 'user',
    role: 'USER',
    telefono: 3000000001,
    direccion: null,
  };

  await signUpUser(userAdmin, false);
  await signUpUser(user, false);

  const users = await prisma.user.findMany({ select: { id: true } });
  const products = await prisma.producto.findMany({ select: { idProducto: true } });

  console.log('users :>> ', users.length);
  console.log('products :>> ', products.length);

  const puntuacionRangeProbabilityZule: number[] = [
    4, 4.5, 5, 4, 4.5, 5, 4, 4.5, 5, 4, 4.5, 5, 4, 4.5, 5, 4, 4.5, 5, 4, 4.5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  ];

  const res = await prisma.resena.createMany({
    data: users
      .map((user) =>
        products.map((product) => ({
          idUsuario: user.id,
          idProducto: Number(product.idProducto),
          puntuacion: puntuacionRangeProbabilityZule[Math.floor(Math.random() * puntuacionRangeProbabilityZule.length)],
          comentario: faker.lorem.sentences({ min: 1, max: 2 }),
          fechaResena: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2025-01-01T00:00:00.000Z' }),
        })),
      )
      .flat(),
  });

  console.log('Reseñas creadas :>> ', res);

  return NextResponse.json({ message: 'Ejecutado' });
}
