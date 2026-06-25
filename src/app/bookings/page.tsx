'use client';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { StudentShell } from '@/components/layout/student-shell';
import { BookingsTable } from '@/components/tables/bookings-table';
import { requireRole, getStoredUser } from '@/features/auth/session';
import { createBooking, fetchMyBookings } from '@/features/bookings/api';
import { fetchTutors } from '@/features/tutors/api';
import { showCenteredError, showCenteredSuccess, showErrorToast, showInfoToast } from '@/lib/sweet-alert';

const initialForm = { tutorId: '', sessionStart: '', sessionEnd: '', notes: '' };

export default function BookingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!requireRole('student')) {
      router.replace('/admin');
      return;
    }

    setIsReady(true);
  }, [router]);

  const user = getStoredUser();

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
    onSuccess: async () => {
      setForm(initialForm);
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      await showCenteredSuccess('Booking submitted', 'Your tutoring request has been sent successfully.');
    },
    onError: async () => {
      await showCenteredError('Booking failed', 'Unable to create booking. Please review the selected tutor and session time.');
    },
  });

  const handleSubmit = async () => {
    if (validationMessage) {
      await showErrorToast('Incomplete booking form', validationMessage);
      return;
    }

    mutation.mutate({
      tutorId: Number(form.tutorId),
      sessionStart: new Date(form.sessionStart).toISOString(),
      sessionEnd: new Date(form.sessionEnd).toISOString(),
      notes: form.notes.trim() || undefined,
    });
  };

  const bookings = bookingsQuery.data ?? [];
  const pendingCount = bookings.filter((booking: any) => booking.status === 'pending').length;
  const completedCount = bookings.filter((booking: any) => booking.status === 'completed').length;
  const confirmedCount = bookings.filter((booking: any) => booking.status === 'confirmed').length;
  const nextBooking = [...bookings]
    .filter((booking: any) => new Date(booking.sessionStart).getTime() > Date.now())
    .sort((a: any, b: any) => new Date(a.sessionStart).getTime() - new Date(b.sessionStart).getTime())[0];

  useEffect(() => {
    if (bookingsQuery.isError) {
      void showInfoToast('Bookings unavailable', 'Unable to load your bookings right now.');
    }
  }, [bookingsQuery.isError]);

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
            color: theme.palette.common.white,
            position: 'relative',
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            boxShadow: `0 28px 60px ${alpha(theme.palette.primary.dark, 0.28)}`,
          })}
        >
          <Box
            sx={(theme) => ({
              position: 'absolute',
              top: -80,
              right: -40,
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: alpha(theme.palette.common.white, 0.12),
            })}
          />
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} justifyContent="space-between" alignItems={{ xs: 'flex-start', lg: 'center' }} sx={{ position: 'relative' }}>
            <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
              <Chip label="Student dashboard" sx={{ color: 'common.white', borderColor: 'rgba(255,255,255,0.35)', alignSelf: 'flex-start' }} variant="outlined" />
              <Typography variant="h3" fontWeight={900} sx={{ fontSize: { xs: '2rem', sm: '2.8rem' } }}>
                Welcome back, {user?.email?.split('@')[0] ?? 'student'}
              </Typography>
              <Typography sx={{ opacity: 0.92, maxWidth: 680 }}>
                Keep your tutoring journey organized with a clearer overview, faster booking flow, and quick access to the tutors you need.
              </Typography>
            </Stack>
            <Stack spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Button component={Link} href="/tutors" variant="contained" color="inherit" endIcon={<ArrowForwardIcon />} sx={{ color: 'primary.main' }}>
                Explore tutors
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => void showInfoToast('Booking form ready', 'Use the booking panel below to request your next session.')} sx={{ borderColor: 'rgba(255,255,255,0.45)' }}>
                Open booking tips
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {[
            { label: 'Available tutors', value: (tutorsQuery.data?.rows ?? []).length, icon: <SchoolIcon />, color: '#1976d2', helper: 'Ready to book' },
            { label: 'Pending requests', value: pendingCount, icon: <ScheduleIcon />, color: '#ed6c02', helper: 'Awaiting review' },
            { label: 'Confirmed sessions', value: confirmedCount, icon: <AutoAwesomeIcon />, color: '#7b1fa2', helper: 'Planned ahead' },
            { label: 'Completed sessions', value: completedCount, icon: <TaskAltIcon />, color: '#2e7d32', helper: 'Progress made' },
          ].map((item) => (
            <Grid key={item.label} size={{ xs: 12, sm: 6, xl: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 5,
                  border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  boxShadow: (theme) => `0 18px 40px ${alpha(theme.palette.common.black, 0.05)}`,
                  height: '100%',
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Avatar sx={{ bgcolor: alpha(item.color, 0.12), color: item.color }}>{item.icon}</Avatar>
                    <Chip label={item.helper} size="small" variant="outlined" />
                  </Stack>
                  <Box>
                    <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                    <Typography variant="h4" fontWeight={900}>{item.value}</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid size={{ xs: 12, xl: 8 }}>
            <Paper
              elevation={0}
              sx={(theme) => ({
                p: { xs: 2.5, md: 3 },
                borderRadius: 5,
                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                boxShadow: `0 18px 40px ${alpha(theme.palette.common.black, 0.05)}`,
                height: '100%',
              })}
            >
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography variant="h5" fontWeight={800}>Book your next session</Typography>
                  <Typography color="text.secondary">
                    Choose a tutor, set your preferred time, and share notes so your session starts with the right context.
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={`${(tutorsQuery.data?.rows ?? []).length} tutors available`} color="primary" variant="outlined" />
                  <Chip label={selectedTutor ? `${selectedTutor.subject} selected` : 'No tutor selected'} variant="outlined" />
                  <Chip label={nextBooking ? `Next session ${new Date(nextBooking.sessionStart).toLocaleDateString()}` : 'No upcoming session'} variant="outlined" />
                </Stack>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
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
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Session Start"
                      type="datetime-local"
                      value={form.sessionStart}
                      onChange={(event) => setForm({ ...form, sessionStart: event.target.value })}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      disabled={mutation.isPending}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Session End"
                      type="datetime-local"
                      value={form.sessionEnd}
                      onChange={(event) => setForm({ ...form, sessionEnd: event.target.value })}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      disabled={mutation.isPending}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                      elevation={0}
                      sx={(theme) => ({
                        p: 2,
                        borderRadius: 4,
                        height: '100%',
                        border: `1px dashed ${alpha(theme.palette.primary.main, 0.24)}`,
                        background: alpha(theme.palette.primary.main, 0.04),
                      })}
                    >
                      <Stack spacing={0.75}>
                        <Typography fontWeight={700}>Booking checklist</Typography>
                        <Typography variant="body2" color="text.secondary">• Choose a tutor that matches your subject.</Typography>
                        <Typography variant="body2" color="text.secondary">• Make sure the end time is later than the start time.</Typography>
                        <Typography variant="body2" color="text.secondary">• Add notes so the tutor can prepare in advance.</Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
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
                  </Grid>
                </Grid>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
                  <Typography variant="body2" color={validationMessage ? 'warning.main' : 'text.secondary'}>
                    {validationMessage || 'Your request will appear in booking history after submission.'}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => void handleSubmit()}
                    disabled={mutation.isPending}
                    startIcon={mutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ minWidth: { sm: 240 }, minHeight: 52 }}
                  >
                    {mutation.isPending ? 'Submitting...' : 'Submit Booking Request'}
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, xl: 4 }}>
            <Stack spacing={2.5}>
              <Paper
                elevation={0}
                sx={(theme) => ({
                  p: 2.5,
                  borderRadius: 5,
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  boxShadow: `0 18px 40px ${alpha(theme.palette.common.black, 0.05)}`,
                })}
              >
                <Stack spacing={1.5}>
                  <Typography variant="h6" fontWeight={800}>Next session</Typography>
                  {nextBooking ? (
                    <>
                      <Typography fontWeight={700}>{nextBooking.tutor?.fullName ?? 'Tutor assigned soon'}</Typography>
                      <Typography color="text.secondary">{new Date(nextBooking.sessionStart).toLocaleString()}</Typography>
                      <Chip label={nextBooking.status} color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                    </>
                  ) : (
                    <Typography color="text.secondary">You do not have an upcoming session yet. Create one from the booking form.</Typography>
                  )}
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={(theme) => ({
                  p: 2.5,
                  borderRadius: 5,
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  boxShadow: `0 18px 40px ${alpha(theme.palette.common.black, 0.05)}`,
                })}
              >
                <Stack spacing={1.5}>
                  <Typography variant="h6" fontWeight={800}>Study momentum</Typography>
                  <Typography color="text.secondary">
                    {completedCount > 0
                      ? `Great work. You have already completed ${completedCount} tutoring session${completedCount > 1 ? 's' : ''}.`
                      : 'Start building momentum by booking your first tutoring session.'}
                  </Typography>
                  <Button component={Link} href="/tutors" variant="outlined" endIcon={<ArrowForwardIcon />}>
                    Find a tutor
                  </Button>
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={(theme) => ({
                  p: 2.5,
                  borderRadius: 5,
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  boxShadow: `0 18px 40px ${alpha(theme.palette.common.black, 0.05)}`,
                })}
              >
                <Stack spacing={1.5}>
                  <Typography variant="h6" fontWeight={800}>Quick guidance</Typography>
                  <Typography color="text.secondary">Use the student menu on small screens to switch between your dashboard and tutor directory.</Typography>
                  <Typography color="text.secondary">Keep notes specific so tutors can prepare before the session starts.</Typography>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 2.5, md: 3 },
            borderRadius: 5,
            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
            boxShadow: `0 18px 40px ${alpha(theme.palette.common.black, 0.05)}`,
          })}
        >
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h5" fontWeight={800}>My booking history</Typography>
              <Typography color="text.secondary">
                Review your upcoming and previous tutoring sessions, including their current approval status.
              </Typography>
            </Stack>

            {bookingsQuery.isLoading ? (
              <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center" sx={{ py: 6 }}>
                <CircularProgress size={26} />
                <Typography color="text.secondary">Loading your bookings...</Typography>
              </Stack>
            ) : bookingsQuery.isError ? (
              <Typography color="error.main">Unable to load your bookings right now.</Typography>
            ) : bookings.length === 0 ? (
              <Typography color="text.secondary">No bookings yet. Your first tutoring request will appear here.</Typography>
            ) : (
              <BookingsTable bookings={bookings} variant="student" />
            )}
          </Stack>
        </Paper>
      </Stack>
    </StudentShell>
  );
}
