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
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { getAuthErrorMessage, register } from '@/features/auth/api';
import { logoutUser } from '@/features/auth/logout';
import { RegisterFormValues, registerSchema } from '@/features/auth/schemas';
import { showCenteredError, showCenteredSuccess } from '@/lib/sweet-alert';

type ApiErrorResponse = {
  message?: string | string[] | { message?: string[] };
};

type RegistrationResponse = {
  message: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', phone: '', gradeLevel: '' },
  });

  const mutation = useMutation<RegistrationResponse, AxiosError<ApiErrorResponse>, RegisterFormValues>({
    mutationFn: register,
    onSuccess: async (data) => {
      logoutUser();
      await showCenteredSuccess('Registration successful', data.message);
      router.push('/login?registered=1');
    },
    onError: async (requestError: AxiosError<ApiErrorResponse>) => {
      await showCenteredError('Registration failed', getAuthErrorMessage(requestError, 'Registration failed. Please try again.'));
    },
  });

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, md: 6 },
        background: `radial-gradient(circle at top right, ${alpha(theme.palette.secondary.main, 0.18)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 28%, ${theme.palette.background.default} 62%)`,
      })}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={(theme) => ({
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '0.98fr 1.02fr' },
            borderRadius: 6,
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.14)}`,
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
              background: `linear-gradient(145deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
            })}
          >
            <Box
              sx={(theme) => ({
                position: 'absolute',
                top: -90,
                left: -30,
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
                right: -20,
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: alpha(theme.palette.common.white, 0.08),
              })}
            />
            <Stack spacing={3} sx={{ position: 'relative', maxWidth: 520 }}>
              <Chip
                label="Create account"
                sx={(theme) => ({ alignSelf: 'flex-start', color: 'common.white', borderColor: alpha(theme.palette.common.white, 0.35) })}
                variant="outlined"
              />
              <Stack spacing={1.5}>
                <Typography variant="h3" fontWeight={900} sx={{ fontSize: { xs: '2.2rem', md: '3rem' }, lineHeight: 1.05 }}>
                  Start learning with confidence
                </Typography>
                <Typography sx={{ opacity: 0.92, maxWidth: 470 }}>
                  Create your learner account to book tutors, manage sessions, and receive academic support through Najma.
                </Typography>
              </Stack>
              <Stack spacing={1.5}>
                {[
                  'Book tutoring sessions in a few steps',
                  'Track your requests and confirmed sessions',
                  'Verify your email and access your learner workspace securely',
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
                <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 800, letterSpacing: 1.6 }}>
                  Register
                </Typography>
                <Typography variant="h4" fontWeight={900} sx={{ fontSize: { xs: '1.9rem', sm: '2.3rem' } }}>
                  Create your student account
                </Typography>
                <Typography color="text.secondary">
                  Fill in your details below. You will verify your email before signing in.
                </Typography>
              </Stack>

              <Box component="form" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
                <Stack spacing={2.25}>
                  <Controller
                    name="fullName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} label="Full name" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                    )}
                  />
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
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Phone number" fullWidth />}
                  />
                  <Controller
                    name="gradeLevel"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Year of study" fullWidth />}
                  />

                  <Paper
                    elevation={0}
                    sx={(theme) => ({
                      p: 1.75,
                      borderRadius: 4,
                      bgcolor: alpha(theme.palette.secondary.main, 0.04),
                      border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                    })}
                  >
                    <Typography variant="body2" color="text.secondary">
                      After registration, a verification email will be sent to activate your account before login.
                    </Typography>
                  </Paper>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={mutation.isPending}
                    size="large"
                    fullWidth
                    startIcon={mutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ minHeight: 54, fontWeight: 800 }}
                  >
                    {mutation.isPending ? 'Creating account...' : 'Create account'}
                  </Button>

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
                        Already registered?
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sign in to continue managing your tutoring sessions and learner dashboard.
                      </Typography>
                      <Button component={Link} href="/login" fullWidth variant="outlined" sx={{ mt: 0.5 }}>
                        Already have an account? Sign in
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
