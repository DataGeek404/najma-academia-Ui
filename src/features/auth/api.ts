import type { AxiosError } from 'axios';
import { apiClient } from '@/lib/api/client';
import { ForgotPasswordFormValues, LoginFormValues, RegisterFormValues, ResetPasswordFormValues } from './schemas';

type ApiErrorResponse = {
  message?: string | string[] | { message?: string[] };
};

export function getAuthErrorMessage(error: AxiosError<ApiErrorResponse>, fallback = 'Something went wrong. Please try again.') {
  const payload = error.response?.data?.message;

  if (Array.isArray(payload)) {
    return payload.join(' ');
  }

  if (typeof payload === 'string') {
    return payload;
  }

  if (payload && Array.isArray(payload.message)) {
    return payload.message.join(' ');
  }

  return fallback;
}

export async function login(payload: LoginFormValues) {
  const { data } = await apiClient.post('/auth/login', payload);
  return data;
}

export async function register(payload: RegisterFormValues) {
  const { data } = await apiClient.post('/auth/register', payload);
  return data;
}

export async function verifyEmail(token: string) {
  const { data } = await apiClient.post('/auth/verify-email', { token });
  return data;
}

export async function resendVerification(email: string) {
  const { data } = await apiClient.post('/auth/resend-verification', { email });
  return data;
}

export async function forgotPassword(payload: ForgotPasswordFormValues) {
  const { data } = await apiClient.post('/auth/forgot-password', payload);
  return data;
}

export async function resetPassword(payload: ResetPasswordFormValues) {
  const { data } = await apiClient.post('/auth/reset-password', payload);
  return data;
}
