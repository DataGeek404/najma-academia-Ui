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

function sanitizeTutorPayload(payload: Partial<TutorPayload>) {
  const sanitized: Record<string, unknown> = {};

  if (payload.fullName !== undefined) sanitized.fullName = payload.fullName.trim();
  if (payload.email !== undefined) sanitized.email = payload.email.trim();
  if (payload.subject !== undefined) sanitized.subject = payload.subject.trim();
  if (payload.phone !== undefined) {
    const phone = payload.phone.trim();
    if (phone) sanitized.phone = phone;
  }
  if (payload.bio !== undefined) {
    const bio = payload.bio.trim();
    if (bio) sanitized.bio = bio;
  }
  if (payload.hourlyRate !== undefined) {
    const hourlyRate = Number(payload.hourlyRate);
    if (Number.isFinite(hourlyRate)) sanitized.hourlyRate = hourlyRate;
  }
  if (payload.isActive !== undefined) sanitized.isActive = Boolean(payload.isActive);

  return sanitized;
}

export async function fetchTutors(search = '', page = 1, limit = 10) {
  const { data } = await apiClient.get('/tutors', {
    params: { search, page, limit },
  });
  return data;
}

export async function createTutor(payload: TutorPayload) {
  const { data } = await apiClient.post('/tutors', sanitizeTutorPayload(payload));
  return data;
}

export async function updateTutor(id: number, payload: Partial<TutorPayload>) {
  const { data } = await apiClient.patch(`/tutors/${id}`, sanitizeTutorPayload(payload));
  return data;
}

export async function deleteTutor(id: number) {
  const { data } = await apiClient.delete(`/tutors/${id}`);
  return data;
}
