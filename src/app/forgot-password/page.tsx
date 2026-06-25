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
import { Controller, useForm } from 'react-hook-form';
import { forgotPassword, getAuthErrorMessage } from '@/features/auth/api';
import { ForgotPasswordFormValues, forgotPasswordSchema } from '@/features/auth/schemas';
import { showCenteredError, showCenteredSuccess } from '@/lib/sweet-alert';

type ApiErrorResponse = {
  message?: string | string[] | { message?: string[] };
};

export default function ForgotPasswordPage() {
  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const mutation = useMutation<{ message: string }, AxiosError<ApiErrorResponse>, ForgotPasswordFormValues>({
    mutationFn: forgotPassword,
    onSuccess: async (data: { message: string }) => {
      await showCenteredSuccess('Reset email sent', data.message);
    },
    onError: async (error: AxiosError<ApiErrorResponse>) => {
      await showCenteredError('Unable to send reset email', getAuthErrorMessage(error, 'Please try again.'));
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
          })}
        >
          <Stack spacing={3}>
            <Stack spacing={1} textAlign="center">
              <Typography variant="h4" fontWeight={700}>Forgot password</Typography>
              <Typography color="text.secondary">
                Enter your email address and a password reset link will be sent if your account exists.
              </Typography>
            </Stack>
            <Box component="form" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
              <Stack spacing={2}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField {...field} label="Email" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                  )}
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
                  {mutation.isPending ? 'Sending...' : 'Send reset link'}
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
