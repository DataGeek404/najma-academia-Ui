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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { login } from '@/features/auth/api';
import { LoginFormValues, loginSchema } from '@/features/auth/schemas';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push(data.user.role === 'admin' ? '/admin' : '/bookings');
    },
    onError: () => setError('Login failed. Please check your credentials.'),
  });

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: { xs: 4, sm: 6 } }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4 }}>
          <Stack spacing={3}>
            <Stack spacing={1} textAlign="center">
              <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.9rem', sm: '2.25rem' } }}>
                Welcome back
              </Typography>
              <Typography color="text.secondary">
                Sign in to manage your university tutoring sessions and academic support bookings.
              </Typography>
            </Stack>
            {error && <Alert severity="error">{error}</Alert>}
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
                <Button type="submit" variant="contained" disabled={mutation.isPending} size="large" fullWidth>
                  Sign In
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
