import { apiClient } from '@/lib/api/client';
import { LoginFormValues, RegisterFormValues } from './schemas';

export async function login(payload: LoginFormValues) {
  const { data } = await apiClient.post('/auth/login', payload);
  return data;
}

export async function register(payload: RegisterFormValues) {
  const { data } = await apiClient.post('/auth/register', payload);
  return data;
}

