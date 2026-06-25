'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  alpha,
  Box,
  Button,
  Chip,
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
import { getAuthErrorMessage, login, resendVerification } from '@/features/auth/api';
import { LoginFormValues, loginSchema } from '@/features/auth/schemas';
import { showCenteredError, showCenteredSuccess } from '@/lib/sweet-alert';

type ApiErrorResponse = {
  message?: string | string[] | { message?: string[] };
};

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { control, handleSubmit, getValues } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (searchParams.get('registered') === '1') {
      void showCenteredSuccess('Account created', 'Your account has been created. Please verify your email before signing in.');
    }

    if (searchParams.get('verified') === '1') {
      void showCenteredSuccess('Email verified', 'Your email has been verified. You can now sign in.');
    }
  }, [searchParams]);

  const resendMutation = useMutation<{ message: string }, AxiosError<ApiErrorResponse>, string>({
    mutationFn: resendVerification,
    onSuccess: async (data) => {
      await showCenteredSuccess('Verification email sent', data.message);
    },
    onError: async (error) => {
      await showCenteredError('Unable to resend verification', getAuthErrorMessage(error, 'Please try again later.'));
    },
  });

  const mutation = useMutation<any, AxiosError<ApiErrorResponse>, LoginFormValues>({
    mutationFn: login,
    onSuccess: async (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      await showCenteredSuccess('Login successful', 'Welcome back to your tutoring workspace.');
      router.push(data.user.role === 'admin' ? '/admin' : '/bookings');
    },
    onError: async (error: AxiosError<ApiErrorResponse>) => {
      const message = getAuthErrorMessage(error, 'Please check your credentials and try again.');
      await showCenteredError('Login failed', message);

      if (message.toLowerCase().includes('verify your email')) {
        const email = getValues('email').trim();
        if (email) {
          resendMutation.mutate(email);
        }
      }
    },
  });

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, md: 6 },
        background: `radial-gradient(circle at top left, ${alpha(theme.palette.primary.main, 0.18)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 28%, ${theme.palette.background.default} 62%)`,
      })}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={(theme) => ({
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.05fr 0.95fr' },
            borderRadius: 6,
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            boxShadow: `0 28px 70px ${alpha(theme.palette.common.black, 0.1)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.94),
            backdropFilter: 'blur(14px)',
          })}
        >
          <Box
            sx={(theme) => ({
              position: 'relative',
              p: { xs: 3, sm: 4, lg: 5 },
              color: theme.palette.common.white,
              background: `linear-gradient(145deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
            })}
          >
            <Box
              sx={(theme) => ({
                position: 'absolute',
                top: -80,
                right: -40,
                width: 220,
                height: 220,
                borderRadius: '50%',
                background: alpha(theme.palette.common.white, 0.12),
              })}
            />
            <Box
              sx={(theme) => ({
                position: 'absolute',
                bottom: -70,
                left: -30,
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: alpha(theme.palette.common.white, 0.08),
              })}
            />
            <Stack spacing={3} sx={{ position: 'relative', maxWidth: 520 }}>
              <Chip label="Learner access" sx={{ alignSelf: 'flex-start', color: 'common.white', borderColor: alpha(theme.palette.common.white, 0.35) }} variant="outlined" />
              <Stack spacing={1.5}>
                <Typography variant="h3" fontWeight={900} sx={{ fontSize: { xs: '2.2rem', md: '3rem' }, lineHeight: 1.05 }}>
                  Welcome back to Najma
                </Typography>
                <Typography sx={{ opacity: 0.92, maxWidth: 460 }}>
                  Sign in to manage bookings, connect with tutors, and keep your learning journey organized from one place.
                </Typography>
              </Stack>
              <Stack spacing={1.5}>
                {[
                  'Track your tutoring sessions and booking history',
                  'Access tutors and learning support faster',
                  'Continue from where you left off securely',
                ].map((item) => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'common.white', flexShrink: 0 }} />
                    <Typography sx={{ opacity: 0.95 }}>{item}</Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 3, sm: 4, lg: 5 } }}>
            <Stack spacing={3.5}>
              <Stack spacing={1}>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 1.6 }}>
                  Sign in
                </Typography>
                <Typography variant="h4" fontWeight={900} sx={{ fontSize: { xs: '1.9rem', sm: '2.3rem' } }}>
                  Access your account
                </Typography>
                <Typography color="text.secondary">
                  Use your registered email and password to continue to your dashboard.
                </Typography>
              </Stack>

              <Box component="form" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
                <Stack spacing={2.25}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} label="Email address" placeholder="you@example.com" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                    )}
                  />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} type="password" label="Password" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                    )}
                  />

                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Verified learners only can sign in.
                    </Typography>
                    <Button component={Link} href="/forgot-password" sx={{ px: 0, minWidth: 'auto' }}>
                      Forgot password?
                    </Button>
                  </Stack>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={mutation.isPending || resendMutation.isPending}
                    size="large"
                    fullWidth
                    startIcon={mutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ minHeight: 54, fontWeight: 800 }}
                  >
                    {mutation.isPending ? 'Signing in...' : 'Sign In'}
                  </Button>

                  {resendMutation.isPending ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Sending a new verification email...
                    </Typography>
                  ) : null}

                  <Paper
                    elevation={0}
                    sx={(theme) => ({
                      p: 2,
                      borderRadius: 4,
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    })}
                  >
                    <Stack spacing={1} alignItems="center" textAlign="center">
                      <Typography fontWeight={800} color="text.primary">
                        New to Najma?
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Create a learner account to book sessions and access tutor support.
                      </Typography>
                      <Button component={Link} href="/register" fullWidth variant="outlined" sx={{ mt: 0.5 }}>
                        Create student account
                      </Button>
                    </Stack>
                  </Paper>
                </Stack>
              </Box>
            </Stack>
          </Box>
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
