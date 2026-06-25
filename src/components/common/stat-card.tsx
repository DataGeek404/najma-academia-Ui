'use client';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { alpha, Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: number | string;
  helperText?: string;
  icon?: ReactNode;
  accent?: string;
};

export function StatCard({ label, value, helperText, icon, accent }: StatCardProps) {
  return (
    <Card
      elevation={0}
      sx={(theme) => {
        const accentColor = accent ?? theme.palette.primary.main;

        return {
          position: 'relative',
          overflow: 'hidden',
          minHeight: 170,
          borderRadius: 4,
          border: `1px solid ${alpha(accentColor, 0.12)}`,
          background: `linear-gradient(135deg, ${alpha(accentColor, 0.14)} 0%, ${alpha(accentColor, 0.08)} 100%)`,
          boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.06)}`,
        };
      }}
    >
      <Box
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(${alpha(accent ?? theme.palette.primary.main, 0.14)} 1.2px, transparent 1.2px)`,
          backgroundSize: '10px 10px',
          opacity: 0.55,
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 55%)',
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 55%)',
          pointerEvents: 'none',
        })}
      />
      <Box
        sx={(theme) => ({
          position: 'absolute',
          left: -18,
          bottom: -18,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(accent ?? theme.palette.primary.main, 0.12)} 0%, ${alpha(accent ?? theme.palette.primary.main, 0)} 70%)`,
          pointerEvents: 'none',
        })}
      />
      <CardContent sx={{ p: 2.5, height: '100%', position: 'relative', zIndex: 1 }}>
        <Stack justifyContent="space-between" sx={{ height: '100%', minHeight: 120 }}>
          <Box
            sx={(theme) => ({
              width: 42,
              height: 42,
              borderRadius: 2.5,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accent ?? theme.palette.primary.main,
              backgroundColor: alpha(accent ?? theme.palette.common.white, 0.28),
              backdropFilter: 'blur(4px)',
            })}
          >
            {icon ?? <TrendingUpIcon />}
          </Box>

          <Stack spacing={0.75}>
            <Typography variant="body1" fontWeight={600} sx={{ color: 'text.primary' }}>
              {label}
            </Typography>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ lineHeight: 1.1, color: 'text.primary' }}
            >
              {value}
            </Typography>
            {helperText ? (
              <Typography variant="body2" color="text.secondary">
                {helperText}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
