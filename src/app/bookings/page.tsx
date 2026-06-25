'use client';

import MenuIcon from '@mui/icons-material/Menu';
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
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { BookingsTable } from '@/components/tables/bookings-table';
import { logoutUser } from '@/features/auth/logout';
import { getStoredUser, requireRole } from '@/features/auth/session';
import { createBooking, fetchMyBookings } from '@/features/bookings/api';
import { fetchTutors } from '@/features/tutors/api';
import { showCenteredError, showCenteredSuccess, showErrorToast, showInfoToast } from '@/lib/sweet-alert';

const initialForm = { tutorId: '', sessionStart: '', sessionEnd: '', notes: '' };

export default function BookingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!requireRole('student')) {
      router.replace('/admin');
      return;
    }

    setIsReady(true);
  }, [router]);

  const user = getStoredUser();

  const handleLogout = () => {
    logoutUser();
    setMobileMenuOpen(false);
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

  const mobileMenu = (
    <Stack sx={{ height: '100%', p: 3, justifyContent: 'space-between' }} spacing={3}>
      <Stack spacing={3}>
        <Stack spacing={1.5}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>{user?.email?.charAt(0).toUpperCase() ?? 'S'}</Avatar>
          <Box>
            <Typography variant="h6" fontWeight={800}>Student Menu</Typography>
            <Typography variant="body2" color="text.secondary">{user?.email ?? 'student@campusconnect.edu'}</Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={1.25}>
          <Button variant="contained" onClick={() => setMobileMenuOpen(false)}>
            Dashboard overview
          </Button>
          <Button
            variant="outlined"
            onClick={async () => {
              setMobileMenuOpen(false);
              await showInfoToast('Booking form ready', 'Scroll down to create a new tutoring request.');
            }}
          >
            New booking
          </Button>
          <Button
            variant="outlined"
            onClick={async () => {
              setMobileMenuOpen(false);
              await showInfoToast('History section', 'Your booking history is available below on this page.');
            }}
          >
            Booking history
          </Button>
        </Stack>
      </Stack>
      <Button variant="outlined" color="inherit" onClick={handleLogout}>
        Logout
      </Button>
    </Stack>
  );

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${theme.palette.grey[50]} 28%, ${theme.palette.background.default} 100%)`,
      })}
    >
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          [`& .MuiDrawer-paper`]: {
            width: 'min(320px, 100vw)',
          },
        }}
      >
        {mobileMenu}
      </Drawer>

      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 3, md: 5 },
        }}
      >
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
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ position: 'relative' }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <IconButton
                    onClick={() => setMobileMenuOpen(true)}
                    sx={{
                      display: { xs: 'inline-flex', md: 'none' },
                      color: 'common.white',
                      border: '1px solid rgba(255,255,255,0.28)',
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Chip label="Student workspace" sx={{ color: 'common.white', borderColor: 'rgba(255,255,255,0.35)' }} variant="outlined" />
                </Stack>
                <Typography variant="h3" fontWeight={900} sx={{ fontSize: { xs: '2rem', sm: '2.8rem' }, maxWidth: 760 }}>
                  Welcome back, {user?.email?.split('@')[0] ?? 'student'}
                </Typography>
                <Typography sx={{ maxWidth: 760, opacity: 0.92 }}>
                  Plan tutoring sessions faster, monitor your progress, and keep every academic support request in one polished dashboard.
                </Typography>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <Button variant="contained" color="inherit" sx={{ color: 'primary.main' }} onClick={() => setMobileMenuOpen(true)}>
                  Menu
                </Button>
                <Button variant="outlined" color="inherit" onClick={handleLogout} sx={{ borderColor: 'rgba(255,255,255,0.45)' }}>
                  Logout
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {[
              { label: 'Available tutors', value: (tutorsQuery.data?.rows ?? []).length, icon: <SchoolIcon />, tone: 'primary.main' },
              { label: 'Pending requests', value: pendingCount, icon: <ScheduleIcon />, tone: 'warning.main' },
              { label: 'Completed sessions', value: completedCount, icon: <TaskAltIcon />, tone: 'success.main' },
              { label: 'Total bookings', value: bookings.length, icon: <TrendingUpIcon />, tone: 'secondary.main' },
            ].map((item) => (
              <Grid key={item.label} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Paper
                  elevation={0}
                  sx={(theme) => ({
                    p: 2.5,
                    borderRadius: 5,
                    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                    boxShadow: `0 18px 40px ${alpha(theme.palette.common.black, 0.05)}`,
                  })}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                      <Typography variant="h4" fontWeight={900}>{item.value}</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha(item.tone === 'warning.main' ? '#ed6c02' : item.tone === 'success.main' ? '#2e7d32' : item.tone === 'secondary.main' ? '#9c27b0' : '#1976d2', 0.12), color: item.tone }}>
                      {item.icon}
                    </Avatar>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid size={{ xs: 12, lg: 8 }}>
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
                    <Typography variant="h5" fontWeight={800}>Book a New Session</Typography>
                    <Typography color="text.secondary">
                      Pick a tutor, choose a time slot, and add notes about the topic, assignment, or exam prep you need support with.
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

            <Grid size={{ xs: 12, lg: 4 }}>
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
                  <Stack spacing={1}>
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
                  <Stack spacing={1}>
                    <Typography variant="h6" fontWeight={800}>Study momentum</Typography>
                    <Typography color="text.secondary">
                      {completedCount > 0
                        ? `Great work. You have already completed ${completedCount} tutoring session${completedCount > 1 ? 's' : ''}.`
                        : 'Start building momentum by booking your first tutoring session.'}
                    </Typography>
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
                <Typography variant="h5" fontWeight={800}>My Booking History</Typography>
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
      </Container>
    </Box>
  );
}
