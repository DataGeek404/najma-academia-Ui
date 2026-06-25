'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { register } from '@/features/auth/api';
import { logoutUser } from '@/features/auth/logout';
import { RegisterFormValues, registerSchema } from '@/features/auth/schemas';
import { showCenteredError, showCenteredSuccess } from '@/lib/sweet-alert';

type ApiErrorResponse = {
  message?: string | string[] | { message?: string[] };
};

type AuthResponse = {
  accessToken: string;
  user: unknown;
};

function getErrorMessage(error: AxiosError<ApiErrorResponse>) {
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

  return 'Registration failed. Please try again.';
}

export default function RegisterPage() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', phone: '', gradeLevel: '' },
  });

  const mutation = useMutation<AuthResponse, AxiosError<ApiErrorResponse>, RegisterFormValues>({
    mutationFn: register,
    onSuccess: async () => {
      logoutUser();
      await showCenteredSuccess('Registration successful', 'Your account has been created. You can now sign in.');
      router.push('/login?registered=1');
    },
    onError: async (requestError: AxiosError<ApiErrorResponse>) => {
      await showCenteredError('Registration failed', getErrorMessage(requestError));
    },
  });

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, sm: 6 },
        background: `radial-gradient(circle at top, ${alpha(theme.palette.secondary.main, 0.14)} 0%, ${theme.palette.background.default} 42%)`,
      })}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 3, sm: 4 },
            borderRadius: 5,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.14)}`,
            boxShadow: `0 24px 60px ${alpha(theme.palette.common.black, 0.08)}`,
            overflow: 'hidden',
            position: 'relative',
          })}
        >
          <Box
            sx={(theme) => ({
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, ${alpha(theme.palette.secondary.main, 0.08)} 0%, transparent 38%)`,
              pointerEvents: 'none',
            })}
          />
          <Stack spacing={3} sx={{ position: 'relative' }}>
            <Stack spacing={1} textAlign="center">
              <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.9rem', sm: '2.25rem' } }}>
                Create your student account
              </Typography>
              <Typography color="text.secondary">
                Join CampusConnect to book tutoring sessions, track support appointments, and stay organized this semester.
              </Typography>
            </Stack>
            <Box component="form" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
              <Stack spacing={2}>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField {...field} label="Full Name" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField {...field} label="University Email" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField {...field} type="password" label="Password" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                  )}
                />
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => <TextField {...field} label="Phone" fullWidth />}
                />
                <Controller
                  name="gradeLevel"
                  control={control}
                  render={({ field }) => <TextField {...field} label="Year of Study" fullWidth />}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={mutation.isPending}
                  size="large"
                  fullWidth
                  startIcon={mutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{ minHeight: 52 }}
                >
                  {mutation.isPending ? 'Creating account...' : 'Register'}
                </Button>
                <Button component={Link} href="/login" fullWidth>
                  Already have an account? Sign in
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
