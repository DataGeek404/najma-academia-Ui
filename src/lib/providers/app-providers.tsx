'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { PropsWithChildren, useState } from 'react';
import { EmotionCacheProvider } from './emotion-cache-provider';
import { appTheme } from '../theme/theme';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <EmotionCacheProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </EmotionCacheProvider>
  );
}
