'use client';

import { useQuery } from '@tanstack/react-query';
import {
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StudentShell } from '@/components/layout/student-shell';
import { requireRole } from '@/features/auth/session';
import { fetchTutors } from '@/features/tutors/api';

export default function TutorsPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!requireRole('student')) {
      router.replace('/admin');
      return;
    }

    setIsReady(true);
  }, [router]);

  const { data } = useQuery({
    queryKey: ['tutors', search],
    queryFn: () => fetchTutors(search),
    enabled: isReady,
  });

  const tutors = data?.rows ?? [];

  if (!isReady) {
    return null;
  }

  return (
    <StudentShell>
      <Stack spacing={{ xs: 3, md: 4 }}>
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 3, md: 4 },
            borderRadius: 6,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          })}
        >
          <Stack spacing={1.5}>
            <Chip label="Tutor directory" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
            <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: '1.9rem', sm: '2.4rem' } }}>
              Explore tutors
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Browse available tutors by subject, compare profiles, and find the right academic support for your next session.
            </Typography>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 2.5, md: 3 },
            borderRadius: 5,
            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
            boxShadow: `0 18px 40px ${alpha(theme.palette.common.black, 0.05)}`,
          })}
        >
          <Stack spacing={2.5}>
            <TextField
              label="Search tutors by name or subject"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              fullWidth
            />
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {tutors.map((tutor: any) => (
                <Grid size={{ xs: 12, md: 6 }} key={tutor.id}>
                  <Card sx={{ height: '100%', borderRadius: 4, boxShadow: 'none', border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.8)}` }}>
                    <CardContent>
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="flex-start">
                          <Box>
                            <Typography variant="h6" fontWeight={700}>{tutor.fullName}</Typography>
                            <Typography color="text.secondary">{tutor.subject}</Typography>
                          </Box>
                          <Chip label={`$${tutor.hourlyRate}/hr`} color="primary" variant="outlined" />
                        </Stack>
                        <Typography sx={{ wordBreak: 'break-word' }}>{tutor.bio || 'This tutor has not added a bio yet.'}</Typography>
                        <Typography variant="body2" color="text.secondary">Contact: {tutor.email}</Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Paper>
      </Stack>
    </StudentShell>
  );
}
