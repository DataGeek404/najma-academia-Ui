'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logoutUser } from '@/features/auth/logout';
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

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

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
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={{ xs: 3, md: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: '1.9rem', sm: '2.4rem' } }}>
              Explore Tutors
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Browse available tutors by subject and find the right academic support for your next session.
            </Typography>
          </Stack>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
        <TextField
          label="Search tutors by name or subject"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
        />
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {tutors.map((tutor: any) => (
            <Grid size={{ xs: 12, md: 6 }} key={tutor.id}>
              <Card sx={{ height: '100%', borderRadius: 4 }}>
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
    </Container>
  );
}
