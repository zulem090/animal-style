'use client';

import { Formik } from 'formik';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { Spinner } from '@/components/loaders';
import { BookingController } from '@/controllers/bookingController';
import { BookingDto } from '@/dto/booking/bookingDto';
import { User as UserSession } from 'next-auth';
import toast from 'react-hot-toast';
import { CreateBookingDto } from '@/dto/booking/createBookingDto';
import Dinero from 'dinero.js';
import { UserController } from '@/controllers/userController';
import { useRouter } from 'next/navigation';

interface Props {
  bookingId?: number;
  user: UserSession;
  readOnly?: boolean;
}

interface BookingForm {
  nombre?: string;
  apellido?: string;
  tipoDocumento?: string;
  documento?: string | number;
  tipoReserva?: string;
  direccion?: string;
  telefono?: string | number;
  correo?: string;
  nombreMascota?: string;
  tipoMascota?: string;
  fechaHoraReserva?: string;
}

const requiredMessage = 'este campo es requerido';

const formValidations = yup.object({
  nombre: yup.string().required(requiredMessage),
  apellido: yup.string().optional(),
  tipoReserva: yup.string().required(requiredMessage),
  tipoDocumento: yup.string().required(requiredMessage),
  tipoMascota: yup.string().required(requiredMessage),
  documento: yup.number().required(requiredMessage).min(1, 'Unidades mínima: 1'),
  nombreMascota: yup.string().required(requiredMessage),
  direccion: yup.string().required(requiredMessage),
  telefono: yup.number().required().min(1, 'Unidades mínima: 1'),
  correo: yup.string().email('debe ser un correo váldio').required(requiredMessage),
  fechaHoraReserva: yup
    .date()
    .required(requiredMessage)
    .min(new Date(), 'Fecha Mínima: Hoy')
    .max(new Date(new Date().setDate(new Date().getDate() + 31)), 'No mas de 30 días de diferencia'),
});

const formatToISOGMTDate = (date?: Date): string | undefined => {
  if (!date) return;

  const timeOffset = new Date().getTimezoneOffset(); // Diferencia horaria en minutos
  const localDate = new Date(date.getTime() - timeOffset * 60000); // Ajusta la diferencia horaria

  return localDate.toISOString().slice(0, 16);
};

export const BookingTemplateEditor = ({ bookingId, user, readOnly }: Props) => {
  const isEditing: boolean = !!bookingId;
  const [booking, setBooking] = useState<BookingDto | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const bookingController = useMemo(() => new BookingController(), []);
  const userController = useMemo(() => new UserController(), []);

  useEffect(() => {
    if (isEditing) {
      if (!booking) {
        bookingController.getById(bookingId!).then((res: BookingDto) => {
          setBooking(res);
          setIsLoading(false);
        });
      }
    } else {
      setIsLoading(false);
    }
  }, [isEditing, booking, bookingController, bookingId]);

  let initialValues: BookingForm;

  if (isEditing) {
    initialValues = {
      nombre: user.name || undefined,
      apellido: user.apellido || undefined,
      tipoDocumento: 'Cédula de Ciudadanía',
      documento: Number(user.cedula),
      tipoReserva: booking?.tipoCita || undefined,
      direccion: user.direccion || undefined,
      telefono: Number(user.telefono) || undefined,
      correo: user.email || undefined,
      nombreMascota: booking?.nombreMascota || undefined,
      tipoMascota: booking?.tipoMascota || undefined,
      fechaHoraReserva: formatToISOGMTDate(booking?.fechaHoraCita),
    };
  } else {
    initialValues = {
      nombre: user.name || undefined,
      apellido: user.apellido || undefined,
      tipoDocumento: 'Cédula de Ciudadanía',
      documento: Number(user.cedula),
      tipoReserva: undefined,
      direccion: user.direccion || undefined,
      telefono: Number(user.telefono) || undefined,
      correo: user.email || undefined,
      nombreMascota: undefined,
      tipoMascota: undefined,
      fechaHoraReserva: undefined,
    };
  }

  const onSubmit = async (values: any) => {
    try {
      toast.loading(`${isEditing ? 'Actualizando' : 'Creando'} reserva...`, { id: 'save' });

      const booking: CreateBookingDto = {
        tipoCita: values.tipoReserva,
        nombreMascota: values.nombreMascota,
        tipoMascota: values.tipoMascota,
        fechaHoraCita: values.fechaHoraReserva,
        estado: 'ACTIVO',
        idUsuario: user.id,
        observaciones: '',
      };

      if (isEditing) {
        await bookingController.update({ idCita: bookingId!, ...booking });
        await userController.changePersonalInfo({ direccion: values.direccion, telefono: values.telefono });
        toast.remove('save');
        toast.success(`Reserva de ${booking.nombreMascota} actualizada!`, { duration: 4000 });
      } else {
        await bookingController.create(booking);
        await userController.changePersonalInfo({ direccion: values.direccion, telefono: values.telefono });
        toast.success(`Reserva de ${booking.nombreMascota} creada correctamente!`, { duration: 4000 });
        toast.remove('save');
      }
    } catch (error: any) {
      toast.remove('save');
      toast.error('Error desconocido al intentar crear la reserba, inténtalo nuevamente.', { duration: 4000 });
      console.error(error.message);
    }
  };

  if (isLoading) {
    return <Spinner data-testid="simbolo-carga-detalle-producto" dog className="mx-auto -mt-96 size-1/6 h-screen" />;
  }

  if (!isLoading && isEditing && booking?.idUsuario !== user.id) {
    router.push('/bookings');
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="lg:p-18 md:p-30 sm:20 flex w-full items-center justify-center p-8 lg:w-1/2">
        <div>
          <div className="text-center">
            <h1 className="mb-8 text-2xl font-semibold">
              {readOnly && 'Información de la Reserva'}
              {!readOnly && (isEditing ? 'Editar Reserva' : 'Nueva Reserva')}
            </h1>
          </div>
          <Formik initialValues={initialValues} validationSchema={formValidations} onSubmit={onSubmit}>
            {({ values, errors, touched, handleSubmit, handleChange, isSubmitting, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label htmlFor="nombre" className="block text-gray-600">
                      Nombre
                      <span className="text-vino-700">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      className="w-full cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                      autoComplete="off"
                      onChange={handleChange}
                      disabled
                      value={values.nombre}
                    />
                    <div className="text-vino-700">{errors.nombre && touched.nombre && errors.nombre}</div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="apellido" className="block text-gray-600">
                      Apellido
                    </label>
                    <input
                      type="apellido"
                      id="apellido"
                      name="apellido"
                      className="w-full cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                      autoComplete="off"
                      disabled
                      onChange={handleChange}
                      value={values.apellido}
                    />
                    <div className="text-vino-700">{errors.apellido && touched.apellido && errors.apellido}</div>
                  </div>
                </div>
                <div className="2 mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <div>
                    <label htmlFor="tipoDocumento" className="block text-gray-600">
                      Tipo de Documento
                      <span className="text-vino-700">*</span>
                    </label>
                    <select
                      name="tipoDocumento"
                      className="w-full cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                      onChange={handleChange}
                      value={values.tipoDocumento}
                      disabled
                    >
                      <option value={values.tipoDocumento}>{values.tipoDocumento}</option>
                    </select>
                    <div className="text-vino-700">
                      {errors.tipoDocumento && touched.tipoDocumento && errors.tipoDocumento}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="documento" className="block text-gray-600">
                      Documento
                      <span className="text-vino-700">*</span>
                    </label>
                    <input
                      type="text"
                      id="documento"
                      name="documento"
                      className="w-full cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                      autoComplete="off"
                      disabled
                      onChange={(event) => {
                        const value = event.target.value;
                        const number = value.replaceAll(/[.,]/g, '');

                        setFieldValue('documento', parseInt(number));
                      }}
                      value={
                        values.documento
                          ? Dinero({ amount: Number(values.documento), precision: 0 })
                              .toFormat('0,0')
                              .replaceAll(',', '.')
                          : undefined
                      }
                    />
                    <div className="text-vino-700">{errors.documento && touched.documento && errors.documento}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="tipoReserva" className="block text-gray-600">
                    Tipo de Reserva
                    <span className="text-vino-700">*</span>
                  </label>
                  <select
                    name="tipoReserva"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                    onChange={handleChange}
                    value={values.tipoReserva}
                    style={readOnly ? { cursor: 'not-allowed' } : undefined}
                    disabled={readOnly}
                  >
                    <option value={undefined}>Seleccione Tipo de Reserva</option>
                    <option value="Psicologia">Psicología</option>
                    <option value="Veterinaria">Veterinaria</option>
                    <option value="Adiestramiento">Adiestramiento</option>
                    <option value="Spa">Spa</option>
                    <option value="Fisioterapia">Fisioterapia</option>
                  </select>
                  <div className="text-vino-700">{errors.tipoReserva && touched.tipoReserva && errors.tipoReserva}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="direccion" className="block text-gray-600">
                    Dirección
                    <span className="text-vino-700">*</span>
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                    autoComplete="off"
                    onChange={handleChange}
                    value={values.direccion}
                    style={readOnly ? { cursor: 'not-allowed' } : undefined}
                    disabled={readOnly}
                  />
                  <div className="text-vino-700">{errors.direccion && touched.direccion && errors.direccion}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="celular" className="block text-gray-600">
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
                    style={readOnly ? { cursor: 'not-allowed' } : undefined}
                    disabled={readOnly}
                  />
                  <div className="text-vino-700">{errors.telefono && touched.telefono && errors.telefono}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="correo" className="block text-gray-600">
                    Correo Electrónico
                    <span className="text-vino-700">*</span>
                  </label>
                  <input
                    type="text"
                    id="correo"
                    name="correo"
                    className="w-full cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                    autoComplete="off"
                    onChange={handleChange}
                    value={values.correo}
                    disabled
                  />
                  <div className="text-vino-700">{errors.correo && touched.correo && errors.correo}</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="nombreMascota" className="block text-gray-600">
                    Nombre Mascota
                    <span className="text-vino-700">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombreMascota"
                    name="nombreMascota"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                    autoComplete="off"
                    onChange={handleChange}
                    value={values.nombreMascota}
                    style={readOnly ? { cursor: 'not-allowed' } : undefined}
                    disabled={readOnly}
                  />
                  <div className="text-vino-700">
                    {errors.nombreMascota && touched.nombreMascota && errors.nombreMascota}
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="tipoMascota" className="block text-gray-600">
                    Tipo de Mascota
                    <span className="text-vino-700">*</span>
                  </label>
                  <select
                    name="tipoMascota"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                    onChange={handleChange}
                    value={values.tipoMascota}
                    style={readOnly ? { cursor: 'not-allowed' } : undefined}
                    disabled={readOnly}
                  >
                    <option value={undefined}>Seleccione Tipo de Mascota</option>
                    <option value="Canino">Canino</option>
                    <option value="Felino">Felino</option>
                  </select>
                  <div className="text-vino-700">{errors.tipoMascota && touched.tipoMascota && errors.tipoMascota}</div>
                </div>
                <div className="mb-8">
                  <label htmlFor="fechaHoraReserva" className="block text-gray-600">
                    Fecha y Hora Reserva
                    <span className="text-vino-700">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="fechaHoraReserva"
                    name="fechaHoraReserva"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-vino-500 focus:outline-none"
                    autoComplete="off"
                    style={readOnly ? { cursor: 'not-allowed' } : undefined}
                    onChange={handleChange}
                    disabled={readOnly}
                    value={values.fechaHoraReserva}
                  />
                  <div className="text-vino-700">
                    {errors.fechaHoraReserva && touched.fechaHoraReserva && errors.fechaHoraReserva}
                  </div>
                </div>
                {!readOnly && (
                  <button
                    type="submit"
                    className="w-full rounded-md bg-vino-500 px-4 py-2 font-semibold text-white hover:bg-vino-600 disabled:bg-slate-100 disabled:hover:bg-slate-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Spinner /> : 'Solicitar'}
                  </button>
                )}
              </form>
            )}
          </Formik>
        </div>
      </div>
      <div className="hidden h-screen w-1/2 lg:block">
        <Image
          src="/images/pet-services.svg"
          width={600}
          height={600}
          alt="Placeholder Image"
          className="h-full w-full"
        />
      </div>
    </div>
  );
};
