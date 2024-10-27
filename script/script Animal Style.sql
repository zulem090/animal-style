create database animal_style_db;

use animal_style_db;

CREATE TABLE sucursal(
direccion VARCHAR(200) PRIMARY KEY,
nombre VARCHAR(200) NOT NULL,
telefono BIGINT NOT NULL);

CREATE TABLE empleado(
cedula BIGINT PRIMARY KEY,
nombre VARCHAR(200) NOT NULL,
cargo VARCHAR(50) NOT NULL,
sueldo DECIMAL NOT NULL);

CREATE TABLE especialista(
id_especialista BIGINT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(200) NOT NULL,
especialidad VARCHAR(30) NOT NULL,
descripcion TEXT NOT NULL,
contacto VARCHAR(200) NOT NULL);

CREATE TABLE ciudad(
codigo_postal INT PRIMARY KEY,
nombre VARCHAR(200) NOT NULL);

CREATE TABLE proveedor(
nit BIGINT PRIMARY KEY,
nombre VARCHAR(200) NOT NULL,
contacto VARCHAR(200) NOT NULL,
direccion VARCHAR(200) NOT NULL);

CREATE TABLE insumo(
id_insumo BIGINT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(200) NOT NULL,
tipo VARCHAR(50) NOT NULL,
descripcion TEXT);

CREATE TABLE sucursal_virtual(
id_sucursal_virtual BIGINT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(200) NOT NULL,
correo VARCHAR(200) NOT NULL);

CREATE TABLE inventario(
id_inventario BIGINT AUTO_INCREMENT PRIMARY KEY,
cantidad INT NOT NULL,
tipo VARCHAR(50) NOT NULL,
precio DECIMAL NOT NULL,
descripcion TEXT NOT NULL);

CREATE TABLE usuario(
id_usuario VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
cedula BIGINT NOT NULL UNIQUE,
nombre VARCHAR(200) NOT NULL,
apellido VARCHAR(200),
telefono BIGINT,
correo VARCHAR(200) NOT NULL UNIQUE,
usuario VARCHAR(30) NOT NULL UNIQUE,
role VARCHAR(20) NOT NULL DEFAULT('ADMIN'),
direccion VARCHAR(200),
contrasena VARCHAR(255) NOT NULL);

CREATE TABLE cuenta(
id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
type VARCHAR(200) NOT NULL,
provider VARCHAR(200) NOT NULL,
provider_account_id VARCHAR(200) NOT NULL,
refresh_token TEXT,
access_token TEXT,
expires_at BIGINT,
token_type VARCHAR(200),
scope VARCHAR(200),
id_token TEXT,
session_state VARCHAR(200));

CREATE TABLE cita(
id_cita BIGINT AUTO_INCREMENT PRIMARY KEY,
fecha_hora_cita DATETIME NOT NULL,
estado VARCHAR(30) NOT NULL,
nombre_mascota VARCHAR(30) NOT NULL,
tipo_mascota VARCHAR(30) NOT NULL,
tipo_cita VARCHAR(255) NOT NULL,
observaciones VARCHAR(255));

CREATE TABLE paciente(
id_paciente BIGINT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(50) NOT NULL,
identificacion BIGINT NOT NULL,
edad INT NOT NULL,
especie VARCHAR(10) NOT NULL,
historial_medico VARCHAR(255) NOT NULL); 

CREATE TABLE marca(
id_marca BIGINT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(30));

CREATE TABLE tipo_producto(
id_tipo_producto BIGINT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(30));

CREATE TABLE producto(
id_producto BIGINT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(150) NOT NULL,
precio DECIMAL NOT NULL,
cantidad INT NOT NULL,
descripcion TEXT,
estado VARCHAR(30) NOT NULL DEFAULT('ACTIVO'),
imagen LONGBLOB
);

CREATE TABLE promocion(
id_promocion BIGINT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(150) NOT NULL,
descuento DECIMAL NOT NULL,
descripcion TEXT NOT NULL,
fecha_inicio DATE NOT NULL,
fecha_fin DATE NOT NULL);

CREATE TABLE factura(
id_factura BIGINT AUTO_INCREMENT PRIMARY KEY,
fecha DATE NOT NULL,
total DECIMAL NOT NULL);

CREATE TABLE detalles_factura(
id_detalles BIGINT AUTO_INCREMENT PRIMARY KEY,
precio DECIMAL NOT NULL,
cantidad INT NOT NULL,
estado VARCHAR(30) NOT NULL);

CREATE TABLE envio(
codigo_envio BIGINT AUTO_INCREMENT PRIMARY KEY,
direccion_destino VARCHAR(200) NOT NULL,
direccion_origen VARCHAR(200) NOT NULL,
fecha_envio DATE NOT NULL,
estado VARCHAR(30) NOT NULL);

CREATE TABLE devolucion(
id_devolucion BIGINT AUTO_INCREMENT PRIMARY KEY,
fecha_devolucion DATE NOT NULL,
motivo VARCHAR(255) NOT NULL,
estado VARCHAR(30) NOT NULL);

CREATE TABLE metodo_pago(
id_pago BIGINT AUTO_INCREMENT PRIMARY KEY,
tipo_tarjeta VARCHAR(10) NOT NULL,
numero_tarjeta BIGINT NOT NULL,
nombre_titular VARCHAR(200) NOT NULL,
fecha_vencimiento DATE NOT NULL,
codigo_seguridad INT NOT NULL);

CREATE TABLE foro(
id_foro BIGINT AUTO_INCREMENT PRIMARY KEY,
nombre_foro VARCHAR(200) NOT NULL,
categoria VARCHAR(30) NOT NULL,
descripcion TEXT NOT NULL,
fecha_creacion DATE NOT NULL);

CREATE TABLE resena(
id_resena BIGINT AUTO_INCREMENT PRIMARY KEY,
comentario VARCHAR(255) NOT NULL,
puntuacion DECIMAL(2, 1) NOT NULL,
fecha_resena DATE NOT NULL);

-- RELACION ENTIDADES 1 a N / 1 a 1

ALTER TABLE sucursal 
ADD id_ciudad INT;

ALTER TABLE sucursal
ADD FOREIGN KEY(id_ciudad) REFERENCES ciudad(codigo_postal) ON DELETE CASCADE;

ALTER TABLE especialista
ADD id_empleado BIGINT;

ALTER TABLE especialista
ADD FOREIGN KEY(id_empleado) REFERENCES empleado(cedula) ON DELETE CASCADE;

ALTER TABLE empleado
ADD id_sucursal VARCHAR(200);

ALTER TABLE empleado
ADD FOREIGN KEY(id_sucursal) REFERENCES sucursal(direccion) ON DELETE CASCADE;

ALTER TABLE insumo
ADD id_proveedor BIGINT;

ALTER TABLE insumo
ADD FOREIGN KEY(id_proveedor) REFERENCES proveedor(nit) ON DELETE CASCADE;

-- EL TIPO DEL NUEVO ATRIBUTO PARA SER FK (ID_SURCURSAL VIRTUAL) DEBE SER DEL MISMO TIPO DE LA PK DE LA TABLA QUE SE VA A UNIR (INVENTARIO)
ALTER TABLE inventario
ADD id_sucursal_virtual BIGINT;
-- ACA SE PONE EL ATRIBUTO RECIEN CREADO (id_sucursal_virtual) para convertirlo en un Foreign Key (fk) Y LUEGO RFERENCIARLO A TABLA QUE SE VA UNIR MEDIANTE SU ATRIBUTO PK (PRIMARY KEY)
ALTER TABLE inventario                                       -- (nombre del atr que es PK de la tabla)
ADD FOREIGN KEY(id_sucursal_virtual) REFERENCES sucursal_virtual(id_sucursal_virtual) ON DELETE CASCADE;

ALTER TABLE metodo_pago
ADD id_usuario VARCHAR(36);

ALTER TABLE metodo_pago
ADD FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE;

ALTER TABLE usuario
ADD id_sucursal_virtual BIGINT;

ALTER TABLE usuario
ADD FOREIGN KEY(id_sucursal_virtual) REFERENCES sucursal_virtual(id_sucursal_virtual) ON DELETE CASCADE;

ALTER TABLE factura
ADD id_usuario VARCHAR(36);

ALTER TABLE factura
ADD FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE;

ALTER TABLE factura
ADD id_envio BIGINT;

ALTER TABLE factura
ADD FOREIGN KEY(id_envio) REFERENCES envio(codigo_envio) ON DELETE CASCADE;

ALTER TABLE detalles_factura
ADD id_factura BIGINT;

ALTER TABLE detalles_factura
ADD FOREIGN KEY(id_factura) REFERENCES factura(id_factura) ON DELETE CASCADE;

ALTER TABLE devolucion
ADD id_factura BIGINT;

ALTER TABLE devolucion
ADD FOREIGN KEY(id_factura) REFERENCES factura(id_factura) ON DELETE CASCADE;

ALTER TABLE foro
ADD id_usuario VARCHAR(36);

ALTER TABLE foro
ADD FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE;

ALTER TABLE cita 
ADD id_usuario VARCHAR(36);

ALTER TABLE cita
ADD FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE;

ALTER TABLE cita
ADD id_paciente BIGINT;

ALTER TABLE cita
ADD FOREIGN KEY(id_paciente) REFERENCES paciente(id_paciente) ON DELETE CASCADE;

ALTER TABLE resena
ADD id_usuario VARCHAR(36) NOT NULL;

ALTER TABLE resena
ADD FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE;

ALTER TABLE resena
ADD id_producto BIGINT NOT NULL;

ALTER TABLE resena
ADD FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE;

ALTER TABLE resena
ADD UNIQUE `unique_resena`(`id_usuario`, `id_producto`);

ALTER TABLE sucursal
ADD id_sucursal_virtual BIGINT;

ALTER TABLE sucursal
ADD FOREIGN KEY (id_sucursal_virtual) REFERENCES sucursal_virtual(id_sucursal_virtual) ON DELETE CASCADE;

ALTER TABLE producto
ADD id_tipo BIGINT;

ALTER TABLE producto
ADD FOREIGN KEY (id_tipo) REFERENCES tipo_producto(id_tipo_producto) ON DELETE CASCADE;

ALTER TABLE producto
ADD id_marca BIGINT;

ALTER TABLE producto
ADD FOREIGN KEY (id_marca) REFERENCES marca(id_marca) ON DELETE CASCADE;

ALTER TABLE cuenta
ADD id_usuario VARCHAR(36);

ALTER TABLE cuenta
ADD FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE;

-- RELACION ENTIDADES MUCHOS A MUCHO N a N

-- Vamos a relacionar proveedor a sucursal

-- Paso 1: createmos una entidad nueva intermedia entre ambas que se llamaria como una fusion de ambas
-- proveedores_sucursal
CREATE TABLE suministro(
    direccion VARCHAR(200),
    nit BIGINT,
    PRIMARY KEY(direccion, nit)
);

ALTER TABLE suministro
ADD FOREIGN KEY(direccion) REFERENCES sucursal(direccion) ON DELETE CASCADE;

ALTER TABLE suministro
ADD FOREIGN KEY(nit) REFERENCES proveedor(nit) ON DELETE CASCADE;


-- usuario_compraProducto
CREATE TABLE carrito(
    id_usuario VARCHAR(36),
    compra BIGINT,
    PRIMARY KEY(id_usuario, compra)
);

ALTER TABLE carrito
ADD FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE;

ALTER TABLE carrito
ADD FOREIGN KEY(compra) REFERENCES producto(id_producto) ON DELETE CASCADE;

-- compraProducto_promocion
CREATE TABLE oferta(
id_compra BIGINT,
id_promocion BIGINT,
PRIMARY KEY (id_compra, id_promocion)
);

ALTER TABLE oferta
ADD FOREIGN KEY(id_compra) REFERENCES producto(id_producto) ON DELETE CASCADE;

ALTER TABLE oferta
ADD FOREIGN KEY(id_promocion) REFERENCES promocion(id_promocion) ON DELETE CASCADE;

-- INDICES (Para indexar busqueda por algun atributo y así ser mas rápida)

CREATE UNIQUE INDEX email
  ON usuario(correo);

CREATE UNIQUE INDEX compound_id
  ON cuenta(id);

CREATE INDEX provider_account_id
  ON cuenta(provider_account_id);

CREATE INDEX provider_id
  ON cuenta(provider);

CREATE INDEX user_id
  ON cuenta(id_usuario);

CREATE INDEX resena_index 
  ON resena(id_usuario, id_producto);

CREATE INDEX resena_index_producto 
  ON resena(id_producto);