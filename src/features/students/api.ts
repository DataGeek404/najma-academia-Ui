import { apiClient } from '@/lib/api/client';
import { StudentSummary } from '@/types';

export async function fetchStudents(): Promise<StudentSummary[]> {
  const { data } = await apiClient.get<StudentSummary[]>('/students');
  return data;
}
