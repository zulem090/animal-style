import { BookingDto } from '@/dto/booking/bookingDto';
import { CreateBookingDto } from '@/dto/booking/createBookingDto';
import { UpdateBookingDto } from '@/dto/booking/editBookingDto';

import { getAllBookings, createBooking, getBookingById, deleteBookingById, updateBooking } from '@/models/bookingModel';

export class BookingController {
  async getById(productId: number): Promise<BookingDto> {
    return getBookingById(productId);
  }

  async getAll(offset: number, limit: number, nombre?: string): Promise<BookingDto[]> {
    return getAllBookings(offset, limit, nombre);
  }

  async create(product: CreateBookingDto): Promise<void> {
    await createBooking(product);
  }

  async update(product: UpdateBookingDto): Promise<void> {
    await updateBooking(product);
  }

  async deleteById(productId: number): Promise<void> {
    await deleteBookingById(productId);
  }
}
