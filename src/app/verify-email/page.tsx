'use client';

import { useMutation } from '@tanstack/react-query';
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import type { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api/client';
import { getAuthErrorMessage } from '@/features/auth/api';
import { showCenteredError, showCenteredSuccess } from '@/lib/sweet-alert';

type ApiErrorResponse = {
  message?: string | string[] | { message?: string[] };
};

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const hasTriggered = useRef(false);

  const mutation = useMutation<{ message: string }, AxiosError<ApiErrorResponse>, string>({
    mutationFn: async (submittedToken: string) => {
      const { data } = await apiClient.post('/auth/verify-email', { token: submittedToken });
      return data;
    },
    onSuccess: async (data) => {
      await showCenteredSuccess('Email verified', data.message);
      router.push('/login?verified=1');
    },
    onError: async (error) => {
      await showCenteredError('Verification failed', getAuthErrorMessage(error, 'Please request a new verification email.'));
    },
  });

  useEffect(() => {
    if (!token || hasTriggered.current) {
      return;
    }

    hasTriggered.current = true;
    mutation.mutate(token);
  }, [mutation, token]);

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
          <Stack spacing={3} textAlign="center">
            <Typography variant="h4" fontWeight={700}>Verify email</Typography>
            {!token ? (
              <>
                <Typography color="error.main">
                  This verification link is missing a token or is incomplete.
                </Typography>
                <Button component={Link} href="/login" variant="contained" fullWidth size="large" sx={{ minHeight: 52 }}>
                  Back to login
                </Button>
              </>
            ) : mutation.isPending ? (
              <Stack spacing={2} alignItems="center">
                <CircularProgress />
                <Typography color="text.secondary">Verifying your email address...</Typography>
              </Stack>
            ) : (
              <Button component={Link} href="/login" variant="contained" fullWidth size="large" sx={{ minHeight: 52 }}>
                Continue to login
              </Button>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
