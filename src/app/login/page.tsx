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
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { getAuthErrorMessage, login } from '@/features/auth/api';
import { LoginFormValues, loginSchema } from '@/features/auth/schemas';
import { showCenteredError, showCenteredSuccess } from '@/lib/sweet-alert';

type ApiErrorResponse = {
  message?: string | string[] | { message?: string[] };
};

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (searchParams.get('registered') === '1') {
      void showCenteredSuccess('Account created', 'Your student account is ready. Sign in to continue.');
    }
  }, [searchParams]);

  const mutation = useMutation<any, AxiosError<ApiErrorResponse>, LoginFormValues>({
    mutationFn: login,
    onSuccess: async (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      await showCenteredSuccess('Login successful', 'Welcome back to your tutoring workspace.');
      router.push(data.user.role === 'admin' ? '/admin' : '/bookings');
    },
    onError: async (error: AxiosError<ApiErrorResponse>) => {
      await showCenteredError('Login failed', getAuthErrorMessage(error, 'Please check your credentials and try again.'));
    },
  });

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, sm: 6 },
        background: `radial-gradient(circle at top, ${alpha(theme.palette.primary.main, 0.14)} 0%, ${theme.palette.background.default} 42%)`,
      })}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 3, sm: 4 },
            borderRadius: 5,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            boxShadow: `0 24px 60px ${alpha(theme.palette.common.black, 0.08)}`,
            overflow: 'hidden',
            position: 'relative',
          })}
        >
          <Box
            sx={(theme) => ({
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 38%)`,
              pointerEvents: 'none',
            })}
          />
          <Stack spacing={3} sx={{ position: 'relative' }}>
            <Stack spacing={1} textAlign="center">
              <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.9rem', sm: '2.25rem' } }}>
                Welcome back
              </Typography>
              <Typography color="text.secondary">
                Sign in to manage your university tutoring sessions and academic support bookings.
              </Typography>
            </Stack>
            <Box component="form" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
              <Stack spacing={2}>
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
                <Button
                  component={Link}
                  href="/forgot-password"
                  sx={{ alignSelf: 'flex-end', px: 0, minWidth: 'auto' }}
                >
                  Forgot password?
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={mutation.isPending}
                  size="large"
                  fullWidth
                  startIcon={mutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{ minHeight: 52 }}
                >
                  {mutation.isPending ? 'Signing in...' : 'Sign In'}
                </Button>
                <Button component={Link} href="/register" fullWidth>
                  Create student account
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
