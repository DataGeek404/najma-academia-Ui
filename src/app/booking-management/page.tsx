'use client';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  alpha,
  Box,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { BookingsTable } from '@/components/tables/bookings-table';
import { fetchAllBookings, updateBookingStatus } from '@/features/bookings/api';
import { requireRole } from '@/features/auth/session';
import { Booking } from '@/types';

export default function BookingManagementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!requireRole('admin')) {
      router.replace('/bookings');
      return;
    }

    setIsReady(true);
  }, [router]);

  const bookingsQuery = useQuery({
    queryKey: ['booking-management', status],
    queryFn: () => fetchAllBookings(status),
    enabled: isReady,
  });

  const mutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: number; nextStatus: Booking['status'] }) => updateBookingStatus(id, nextStatus),
    onSuccess: () => {
      setFeedback({ type: 'success', message: 'Booking status updated successfully.' });
      queryClient.invalidateQueries({ queryKey: ['booking-management'] });
    },
    onError: () => {
      setFeedback({ type: 'error', message: 'Unable to update booking status right now.' });
    },
  });

  const handleStatusChange = (booking: Booking, nextStatus: Booking['status']) => {
    if (booking.status === nextStatus) {
      return;
    }

    setFeedback(null);
    mutation.mutate({ id: booking.id, nextStatus });
  };

  if (!isReady) {
    return null;
  }

  return (
    <DashboardShell>
      <Stack spacing={{ xs: 3, md: 4 }}>
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 3, md: 4 },
            borderRadius: 6,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.secondary?.main || theme.palette.primary.light, 0.12)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          })}
        >
          <Stack spacing={1.5}>
            <Typography variant="h4" fontWeight={800}>Booking Operations</Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              This admin-only workspace is separate from the student booking dashboard. Review all requests, filter by status, and update session outcomes directly from the booking list.
            </Typography>
          </Stack>
        </Paper>

        <Stack direction={{ xs: 'column', xl: 'row' }} spacing={3}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 0, md: 3 },
              borderRadius: { xs: 0, md: 5 },
              border: (theme) => ({ xs: 'none', md: `1px solid ${alpha(theme.palette.divider, 0.8)}` }),
              backgroundColor: { xs: 'transparent', md: 'background.paper' },
              boxShadow: 'none',
              flex: 1,
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <FilterAltIcon color="primary" />
                <Typography variant="h6" fontWeight={800}>Filter bookings</Typography>
              </Stack>
              <TextField select label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} fullWidth>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 0, md: 3 },
              borderRadius: { xs: 0, md: 5 },
              border: (theme) => ({ xs: 'none', md: `1px solid ${alpha(theme.palette.divider, 0.8)}` }),
              backgroundColor: { xs: 'transparent', md: 'background.paper' },
              boxShadow: 'none',
              flex: 1.2,
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PublishedWithChangesIcon color="primary" />
                <Typography variant="h6" fontWeight={800}>Smooth status updates</Typography>
              </Stack>
              <Typography color="text.secondary">
                Use the status dropdown inside each booking row to update requests instantly. No manual booking ID entry is needed.
              </Typography>
            </Stack>
          </Paper>
        </Stack>

        {feedback ? <Alert severity={feedback.type}>{feedback.message}</Alert> : null}
        {bookingsQuery.isError ? <Alert severity="error">Unable to load booking operations right now.</Alert> : null}

        <Paper
          elevation={0}
          sx={{
            p: { xs: 0, md: 3 },
            borderRadius: { xs: 0, md: 5 },
            border: (theme) => ({ xs: 'none', md: `1px solid ${alpha(theme.palette.divider, 0.8)}` }),
            backgroundColor: { xs: 'transparent', md: 'background.paper' },
            boxShadow: 'none',
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={800}>All Booking Requests</Typography>
              <Typography color="text.secondary">
                Admin view includes student details, notes, and inline status controls for faster decisions.
              </Typography>
            </Box>
            <BookingsTable
              bookings={bookingsQuery.data?.rows ?? []}
              variant="admin"
              onStatusChange={handleStatusChange}
              updatingBookingId={mutation.isPending ? mutation.variables?.id ?? null : null}
            />
          </Stack>
        </Paper>
      </Stack>
    </DashboardShell>
  );
}
