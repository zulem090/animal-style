export const dynamic = 'force-dynamic'; // Para prevenir que next ejecute la ruta en el build (o sea en modo estático)

import { CreateUsuarioDto } from '@/dto/auth/CreateUsuarioDto';
import { signUpUser } from '@/models/authModel';
import prisma from '@/orm/prisma';
import { NextResponse } from 'next/server';
import { Faker, es, es_MX } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const base64ToBuffer = (base64String: string): Buffer => {
  const base64Data = base64String.replace(/^data:image\/.*?;base64,/, ''); // Ej: data:image/svg+xml;base64,PHN2ZyB4bW
  return Buffer.from(base64Data, 'base64');
};

const localPathToBuffer = (imagePath: string): Buffer => {
  const rootDir = process.cwd();

  const file: Buffer = fs.readFileSync(path.join(rootDir, imagePath.replace('_next', '.next')));

  return file;
};

const getImages = (): Buffer[] => {
  const rootDir = process.cwd();

  const productoImagesFolderPath = path.join(rootDir, '/public/images/productos');
  const testImagesFolderPath = path.join(rootDir, '/public/test');

  const imgs: Buffer[] = [];

  fs.readdirSync(productoImagesFolderPath).forEach((fileName: string) => {
    const imgPath = path.join(productoImagesFolderPath, fileName);
    const file: Buffer = fs.readFileSync(imgPath);

    imgs.push(file);
  });

  fs.readdirSync(testImagesFolderPath).forEach((fileName: string) => {
    const imgPath = path.join(testImagesFolderPath, fileName);
    const file: Buffer = fs.readFileSync(imgPath);

    imgs.push(file);
  });

  return imgs;
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

  const marcas = await prisma.marca.createMany({
    data: Array.from({ length: 20 }).map((_, i) => ({ idMarca: i + 1, nombre: faker.commerce.department() })),
  });

  // console.log('marcas :>> ', marcas);

  const tipos = await prisma.tipoProducto.createMany({
    data: Array.from({ length: 20 }).map((_, i) => ({ idTipoProducto: i + 1, nombre: faker.commerce.product() })),
  });

  const estadoProbability: string[] = [
    'ACTIVO',
    'ACTIVO',
    'ACTIVO',
    'ACTIVO',
    'ACTIVO',
    'ACTIVO',
    'ACTIVO',
    'INACTIVO',
    'INACTIVO',
    'INACTIVO',
    'INACTIVO',
  ];

  const imgs: Buffer[] = getImages();

  const imgProbability: Buffer[] = [...imgs];

  await prisma.producto.createMany({
    data: Array.from({ length: 20 }).map((_, i) => ({
      idProducto: i + 1,
      nombre: faker.commerce.product(),
      descripcion: faker.lorem.sentences({ min: 3, max: 20 }),
      cantidad: faker.number.int({ min: 1, max: 2000 }),
      precio: faker.commerce.price({ min: 500, max: 1000000 }),
      idMarca: faker.number.int({ min: 1, max: marcas.count }),
      estado: estadoProbability[Math.floor(Math.random() * estadoProbability.length)],
      idTipo: faker.number.int({ min: 1, max: tipos.count }),
      // imagen: faker.image.dataUri({ width: 640, height: 480, type: 'svg-base64', color: faker.color.rgb() }),
      imagen: imgProbability[Math.floor(Math.random() * imgProbability.length)],
    })),
    // .map((producto) => ({ ...producto, imagen: base64ToBuffer(producto.imagen) })),
    // .map((producto) => ({ ...producto, imagen: localPathToBuffer(producto.imagen) })),
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
        // email: faker.internet.email({
        //   firstName: nombre,
        //   lastName: apellido,
        //   allowSpecialCharacters: true,
        //   provider: 'mail.com',
        // }),
        email: `${i + 1}@m.com`,
        password: bcrypt.hashSync('123', 10),
        // usuario: `${faker.internet.userName({ firstName: nombre, lastName: apellido })}${i + 1}`,
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

  // console.log('users :>> ', users.length);
  // console.log('products :>> ', products.length);

  const puntuacionRangeProbability: number[] = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 2, 2.5, 3, 3.5, 3.5, 3.5, 3.5, 4, 4.5, 5, 4, 4.5, 5, 4, 4.5, 5, 4, 4.5, 5, 4, 4.5,
    5, 4, 4.5, 5, 4, 4.5, 5, 5, 5, 5,
  ];

  const res = await prisma.resena.createMany({
    data: users
      .map((user) =>
        products.map((product) => ({
          idUsuario: user.id,
          idProducto: Number(product.idProducto),
          puntuacion: puntuacionRangeProbability[Math.floor(Math.random() * puntuacionRangeProbability.length)],
          comentario: faker.lorem.sentences({ min: 1, max: 2 }),
          fechaResena: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2025-01-01T00:00:00.000Z' }),
        })),
      )
      .flat(),
  });

  // console.log('Reseñas creadas :>> ', res);

  return NextResponse.json({ message: 'Ejecutado' });
}
