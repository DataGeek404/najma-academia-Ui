import { apiClient } from '@/lib/api/client';

export type TutorPayload = {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  bio?: string;
  hourlyRate: number;
  isActive?: boolean;
};

export async function fetchTutors(search = '', page = 1, limit = 10) {
  const { data } = await apiClient.get('/tutors', {
    params: { search, page, limit },
  });
  return data;
}

export async function createTutor(payload: TutorPayload) {
  const { data } = await apiClient.post('/tutors', payload);
  return data;
}

export async function updateTutor(id: number, payload: Partial<TutorPayload>) {
  const { data } = await apiClient.patch(`/tutors/${id}`, payload);
  return data;
}

export async function deleteTutor(id: number) {
  const { data } = await apiClient.delete(`/tutors/${id}`);
  return data;
}
