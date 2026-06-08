export interface Booking {
  id: string;
  fieldId: string;
  fieldName: string;
  fieldImage: string;
  userId: string; // user email
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM - HH:MM
  price: number;
  paymentStatus: 'unpaid' | 'paid' | 'cancelled';
  paymentMethod?: 'click' | 'payme' | 'cash';
  transactionId?: string;
  createdAt: string;
}

export interface BookingContextType {
  bookings: Booking[];
  bookField: (fieldId: string, fieldName: string, fieldImage: string, date: string, timeSlot: string, price: number) => Promise<{ success: boolean; booking: Booking; message: string }>;
  payBooking: (bookingId: string, method: 'click' | 'payme' | 'cash') => Promise<{ success: boolean; message: string }>;
  cancelBooking: (bookingId: string) => Promise<{ success: boolean; message: string }>;
  getAvailableTimeSlots: (fieldId: string, date: string) => string[];
  getUserBookings: (userId: string) => Booking[];
}
