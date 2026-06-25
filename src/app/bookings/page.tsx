'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Chip,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { BookingsTable } from '@/components/tables/bookings-table';
import { createBooking, fetchMyBookings } from '@/features/bookings/api';
import { logoutUser } from '@/features/auth/logout';
import { requireRole } from '@/features/auth/session';
import { fetchTutors } from '@/features/tutors/api';

const initialForm = { tutorId: '', sessionStart: '', sessionEnd: '', notes: '' };

export default function BookingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  const tutorsQuery = useQuery({ queryKey: ['tutors-booking'], queryFn: () => fetchTutors(), enabled: isReady });
  const bookingsQuery = useQuery({ queryKey: ['my-bookings'], queryFn: fetchMyBookings, enabled: isReady });

  const selectedTutor = useMemo(
    () => (tutorsQuery.data?.rows ?? []).find((tutor: any) => String(tutor.id) === form.tutorId),
    [form.tutorId, tutorsQuery.data],
  );

  const validationMessage = useMemo(() => {
    if (!form.tutorId || !form.sessionStart || !form.sessionEnd) {
      return 'Choose a tutor and both session times to continue.';
    }

    const start = new Date(form.sessionStart);
    const end = new Date(form.sessionEnd);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 'Enter valid session dates and times.';
    }

    if (end <= start) {
      return 'Session end time must be later than the start time.';
    }

    return '';
  }, [form]);

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      setFeedback({ type: 'success', message: 'Booking submitted successfully. You can track updates in your booking history.' });
      setForm(initialForm);
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: () => {
      setFeedback({ type: 'error', message: 'Unable to create booking. Please review the selected tutor and session time.' });
    },
  });

  const handleSubmit = () => {
    if (validationMessage) {
      setFeedback({ type: 'error', message: validationMessage });
      return;
    }

    setFeedback(null);
    mutation.mutate({
      tutorId: Number(form.tutorId),
      sessionStart: new Date(form.sessionStart).toISOString(),
      sessionEnd: new Date(form.sessionEnd).toISOString(),
      notes: form.notes.trim() || undefined,
    });
  };

  const bookings = bookingsQuery.data ?? [];

  if (!isReady) {
    return null;
  }

  return (
    <Container
      maxWidth="lg"
      disableGutters
      sx={{
        px: { xs: 0, sm: 3 },
        py: { xs: 3, md: 6 },
      }}
    >
      <Stack spacing={{ xs: 3, md: 4 }}>
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 3, md: 4 },
            borderRadius: { xs: 0, sm: 6 },
            color: theme.palette.common.white,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || theme.palette.primary.dark} 100%)`,
          })}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Stack spacing={1}>
              <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>
                Student Booking Dashboard
              </Typography>
              <Typography sx={{ maxWidth: 760, opacity: 0.9 }}>
                Request tutoring sessions, review your personal booking history, and stay focused on your academic goals. This page is separate from the admin booking workspace.
              </Typography>
            </Stack>
            <Button variant="outlined" color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Paper>

        {feedback && <Alert severity={feedback.type}>{feedback.message}</Alert>}

        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ px: { xs: 2, sm: 0 } }}>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 0, sm: 3 },
                borderRadius: { xs: 0, sm: 4 },
                backgroundColor: { xs: 'transparent', sm: 'background.paper' },
                border: 'none',
                boxShadow: 'none',
                height: '100%',
              }}
            >
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.35rem', sm: '1.5rem' } }}>
                    Book a New Session
                  </Typography>
                  <Typography color="text.secondary">
                    Pick a tutor, choose a time slot, and add any notes about the course or topic you need help with.
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={`${(tutorsQuery.data?.rows ?? []).length} tutors available`} color="primary" variant="outlined" />
                  <Chip label={`${bookings.length} bookings tracked`} variant="outlined" />
                </Stack>

                <Stack spacing={2}>
                  <TextField
                    select
                    label="Tutor"
                    value={form.tutorId}
                    onChange={(event) => setForm({ ...form, tutorId: event.target.value })}
                    fullWidth
                    helperText={selectedTutor ? `${selectedTutor.subject} • $${selectedTutor.hourlyRate}/hour` : 'Select the tutor you want to book.'}
                    disabled={tutorsQuery.isLoading || mutation.isPending}
                  >
                    {(tutorsQuery.data?.rows ?? []).map((tutor: any) => (
                      <MenuItem key={tutor.id} value={tutor.id}>
                        {tutor.fullName} - {tutor.subject}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Session Start"
                    type="datetime-local"
                    value={form.sessionStart}
                    onChange={(event) => setForm({ ...form, sessionStart: event.target.value })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    disabled={mutation.isPending}
                  />

                  <TextField
                    label="Session End"
                    type="datetime-local"
                    value={form.sessionEnd}
                    onChange={(event) => setForm({ ...form, sessionEnd: event.target.value })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    disabled={mutation.isPending}
                  />

                  <TextField
                    label="Notes"
                    multiline
                    minRows={4}
                    value={form.notes}
                    onChange={(event) => setForm({ ...form, notes: event.target.value })}
                    fullWidth
                    placeholder="Example: Need help with calculus revision, assignment prep, or exam practice."
                    disabled={mutation.isPending}
                  />
                </Stack>

                {validationMessage && <Alert severity="warning">{validationMessage}</Alert>}

                <Button variant="contained" fullWidth size="large" onClick={handleSubmit} disabled={mutation.isPending || !!validationMessage}>
                  {mutation.isPending ? 'Submitting...' : 'Submit Booking Request'}
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 0, sm: 3 },
                borderRadius: { xs: 0, sm: 4 },
                backgroundColor: { xs: 'transparent', sm: 'background.paper' },
                border: 'none',
                boxShadow: 'none',
                height: '100%',
              }}
            >
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.35rem', sm: '1.5rem' } }}>
                    My Booking History
                  </Typography>
                  <Typography color="text.secondary">
                    Review your upcoming and previous tutoring sessions, including their current approval status.
                  </Typography>
                </Stack>

                {bookingsQuery.isLoading ? (
                  <Alert severity="info">Loading your bookings...</Alert>
                ) : bookingsQuery.isError ? (
                  <Alert severity="error">Unable to load your bookings right now.</Alert>
                ) : (
                  <BookingsTable bookings={bookings} variant="student" />
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
