import { apiClient } from '@/lib/api/client';

export async function createBooking(payload: {
  tutorId: number;
  sessionStart: string;
  sessionEnd: string;
  notes?: string;
}) {
  const { data } = await apiClient.post('/bookings', payload);
  return data;
}

export async function fetchMyBookings() {
  const { data } = await apiClient.get('/bookings/me');
  return data;
}

export async function fetchAllBookings(status = '', page = 1, limit = 10) {
  const { data } = await apiClient.get('/bookings', {
    params: { status, page, limit },
  });
  return data;
}

export async function updateBookingStatus(id: number, status: string) {
  const { data } = await apiClient.patch(`/bookings/${id}/status`, { status });
  return data;
}

