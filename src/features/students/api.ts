import { apiClient } from '@/lib/api/client';
import { StudentSummary } from '@/types';

export type StudentPayload = {
  phone?: string;
  gradeLevel?: string;
  notes?: string;
};

export async function fetchStudents(): Promise<StudentSummary[]> {
  const { data } = await apiClient.get<StudentSummary[]>('/students');
  return data;
}

export async function updateStudent(id: number, payload: StudentPayload) {
  const { data } = await apiClient.patch(`/students/${id}`, payload);
  return data;
}

export async function deleteStudent(id: number) {
  const { data } = await apiClient.delete(`/students/${id}`);
  return data;
}
