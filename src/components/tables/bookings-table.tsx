'use client';

import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import {
  alpha,
  Box,
  Chip,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Booking } from '@/types';

type BookingsTableProps = {
  bookings: Booking[];
  variant?: 'admin' | 'student';
  onStatusChange?: (booking: Booking, status: Booking['status']) => void;
  updatingBookingId?: number | null;
};

const statusColorMap: Record<Booking['status'], 'warning' | 'success' | 'info' | 'default'> = {
  pending: 'warning',
  confirmed: 'info',
  completed: 'success',
  cancelled: 'default',
};

const bookingStatuses: Booking['status'][] = ['pending', 'confirmed', 'completed', 'cancelled'];

export function BookingsTable({ bookings, variant = 'student', onStatusChange, updatingBookingId }: BookingsTableProps) {
  const showAdminActions = variant === 'admin' && Boolean(onStatusChange);

  return (
    <>
      <Stack spacing={1.5} sx={{ display: { xs: 'flex', md: 'none' } }}>
        {bookings.map((booking) => (
          <Paper
            key={booking.id}
            elevation={0}
            sx={(theme) => ({
              position: 'relative',
              overflow: 'hidden',
              p: 2,
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
              background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.14)} 0%, ${alpha(theme.palette.background.paper, 0.96)} 42%, ${theme.palette.background.paper} 100%)`,
              boxShadow: `0 12px 30px ${alpha(theme.palette.common.black, 0.08)}`,
            })}
          >
            <Box
              sx={(theme) => ({
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.14)} 1.2px, transparent 1.2px)`,
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
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0)} 70%)`,
                pointerEvents: 'none',
              })}
            />

            <Stack spacing={1.75} sx={{ position: 'relative', zIndex: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                <Box
                  sx={(theme) => ({
                    width: 42,
                    height: 42,
                    borderRadius: 2.5,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.common.white, 0.32),
                    backdropFilter: 'blur(4px)',
                  })}
                >
                  <EventAvailableIcon />
                </Box>
                <Chip label={booking.status} color={statusColorMap[booking.status]} variant="outlined" size="small" />
              </Stack>

              <Stack spacing={0.5}>
                <Typography fontWeight={800} sx={{ fontSize: '1.05rem' }}>Booking #{booking.id}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {booking.tutor?.fullName ?? 'N/A'}
                </Typography>
              </Stack>

              {variant === 'admin' ? (
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="caption" color="text.secondary">Student</Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ textAlign: 'right' }}>
                    {booking.student?.user?.fullName ?? booking.student?.fullName ?? 'Student'}
                  </Typography>
                </Stack>
              ) : null}

              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="caption" color="text.secondary">Start</Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ textAlign: 'right' }}>{new Date(booking.sessionStart).toLocaleString()}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="caption" color="text.secondary">End</Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ textAlign: 'right' }}>{new Date(booking.sessionEnd).toLocaleString()}</Typography>
                </Stack>
              </Stack>

              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">Notes</Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.notes?.trim() || 'No notes added for this booking.'}
                </Typography>
              </Stack>

              {showAdminActions ? (
                <Stack spacing={0.75} sx={{ pt: 0.5, borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.8)}` }}>
                  <Typography variant="caption" color="text.secondary">Update status</Typography>
                  <Select
                    size="small"
                    fullWidth
                    value={booking.status}
                    disabled={updatingBookingId === booking.id}
                    onChange={(event) => onStatusChange?.(booking, event.target.value as Booking['status'])}
                  >
                    {bookingStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              ) : null}
            </Stack>
          </Paper>
        ))}
      </Stack>

      <TableContainer component={Paper} sx={{ display: { xs: 'none', md: 'block' }, overflowX: 'auto', borderRadius: 4, boxShadow: 'none' }}>
        <Table sx={{ minWidth: 760 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              {variant === 'admin' ? <TableCell>Student</TableCell> : null}
              <TableCell>Tutor</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              {showAdminActions ? <TableCell>Update Status</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id} hover>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{booking.id}</TableCell>
                {variant === 'admin' ? (
                  <TableCell sx={{ minWidth: 180 }}>
                    <Typography fontWeight={600}>{booking.student?.user?.fullName ?? booking.student?.fullName ?? 'Student'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {booking.student?.user?.email ?? 'No email'}
                    </Typography>
                  </TableCell>
                ) : null}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{booking.tutor?.fullName ?? 'N/A'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{new Date(booking.sessionStart).toLocaleString()}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{new Date(booking.sessionEnd).toLocaleString()}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Chip label={booking.status} color={statusColorMap[booking.status]} variant="outlined" />
                </TableCell>
                <TableCell sx={{ minWidth: 220 }}>{booking.notes?.trim() || '—'}</TableCell>
                {showAdminActions ? (
                  <TableCell sx={{ minWidth: 180 }}>
                    <Select
                      size="small"
                      fullWidth
                      value={booking.status}
                      disabled={updatingBookingId === booking.id}
                      onChange={(event) => onStatusChange?.(booking, event.target.value as Booking['status'])}
                    >
                      {bookingStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
