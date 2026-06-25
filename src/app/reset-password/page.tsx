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
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { getAuthErrorMessage, resetPassword } from '@/features/auth/api';
import { ResetPasswordFormValues, resetPasswordSchema } from '@/features/auth/schemas';
import { showCenteredError, showCenteredSuccess } from '@/lib/sweet-alert';

type ApiErrorResponse = {
  message?: string | string[] | { message?: string[] };
};

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: '' },
  });

  const mutation = useMutation<{ message: string }, AxiosError<ApiErrorResponse>, ResetPasswordFormValues>({
    mutationFn: resetPassword,
    onSuccess: async (data: { message: string }) => {
      await showCenteredSuccess('Password updated', data.message);
    },
    onError: async (error: AxiosError<ApiErrorResponse>) => {
      await showCenteredError('Reset failed', getAuthErrorMessage(error, 'Please request a new reset link.'));
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
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.12)}`,
            boxShadow: `0 24px 60px ${alpha(theme.palette.common.black, 0.08)}`,
          })}
        >
          <Stack spacing={3}>
            <Stack spacing={1} textAlign="center">
              <Typography variant="h4" fontWeight={700}>Reset password</Typography>
              <Typography color="text.secondary">
                Enter your new password to complete the reset process.
              </Typography>
            </Stack>
            <Box component="form" onSubmit={handleSubmit((values) => mutation.mutate({ ...values, token }))}>
              <Stack spacing={2}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField {...field} type="password" label="New password" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                  )}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={mutation.isPending || !token}
                  size="large"
                  fullWidth
                  startIcon={mutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{ minHeight: 52 }}
                >
                  {mutation.isPending ? 'Updating...' : 'Reset password'}
                </Button>
                <Button component={Link} href="/login" fullWidth>
                  Back to login
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
