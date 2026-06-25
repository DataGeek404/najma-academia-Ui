'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { register } from '@/features/auth/api';
import { logoutUser } from '@/features/auth/logout';
import { RegisterFormValues, registerSchema } from '@/features/auth/schemas';

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
  const [error, setError] = useState('');
  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', phone: '', gradeLevel: '' },
  });

  const mutation = useMutation<AuthResponse, AxiosError<ApiErrorResponse>, RegisterFormValues>({
    mutationFn: register,
    onSuccess: () => {
      logoutUser();
      router.push('/login?registered=1');
    },
    onError: (requestError: AxiosError<ApiErrorResponse>) => setError(getErrorMessage(requestError)),
  });

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: { xs: 4, sm: 6 } }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4 }}>
          <Stack spacing={3}>
            <Stack spacing={1} textAlign="center">
              <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.9rem', sm: '2.25rem' } }}>
                Create your student account
              </Typography>
              <Typography color="text.secondary">
                Join CampusConnect to book tutoring sessions, track support appointments, and stay organized this semester.
              </Typography>
            </Stack>
            {error && <Alert severity="error">{error}</Alert>}
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
                <Button type="submit" variant="contained" disabled={mutation.isPending} size="large" fullWidth>
                  Register
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
