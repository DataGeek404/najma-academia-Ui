'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { Suspense } from 'react';

function ResetPasswordRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const target = token ? `/create-new-password?token=${encodeURIComponent(token)}` : '/create-new-password';
    router.replace(target);
  }, [router, token]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3 }}>
      <Stack spacing={2} alignItems="center">
        <CircularProgress />
        <Typography color="text.secondary">Redirecting to create new password...</Typography>
      </Stack>
    </Box>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordRedirectContent />
    </Suspense>
  );
}
