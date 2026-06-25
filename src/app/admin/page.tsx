'use client';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FolderIcon from '@mui/icons-material/Folder';
import Groups2Icon from '@mui/icons-material/Groups2';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import TodayIcon from '@mui/icons-material/Today';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  alpha,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { StatCard } from '@/components/common/stat-card';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { BookingsTable } from '@/components/tables/bookings-table';
import { fetchAllBookings } from '@/features/bookings/api';
import { fetchDashboardStats } from '@/features/dashboard/api';
import { getStoredUser, requireRole } from '@/features/auth/session';

export default function AdminPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!requireRole('admin')) {
      router.replace('/bookings');
      return;
    }

    setIsReady(true);
  }, [router]);

  const statsQuery = useQuery({ queryKey: ['dashboard-stats'], queryFn: fetchDashboardStats, enabled: isReady });
  const bookingsQuery = useQuery({ queryKey: ['admin-bookings'], queryFn: () => fetchAllBookings('', 1, 8), enabled: isReady });

  const stats = statsQuery.data ?? {
    totalStudents: 0,
    totalTutors: 0,
    totalBookings: 0,
    upcomingSessions: 0,
  };

  const adminUser = useMemo(() => getStoredUser(), []);

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
            color: theme.palette.common.white,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary?.main || theme.palette.primary.main} 100%)`,
            overflow: 'hidden',
            position: 'relative',
          })}
        >
          <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="overline" sx={{ letterSpacing: 1.6, opacity: 0.8 }}>
              ADMIN OVERVIEW
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ maxWidth: 760, fontSize: { xs: '2rem', md: '3rem' } }}>
              Run the platform from one overview dashboard.
            </Typography>
            <Typography sx={{ maxWidth: 760, opacity: 0.88 }}>
              Welcome back {adminUser?.email ?? 'Admin'}. Use the dedicated tutor and student modules for management, and keep this page focused on platform-wide visibility.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" color="inherit" startIcon={<SchoolIcon />} onClick={() => router.push('/admin/tutors')}>
                Open Tutors Module
              </Button>
              <Button variant="outlined" color="inherit" startIcon={<Groups2Icon />} onClick={() => router.push('/admin/students')}>
                Open Students Module
              </Button>
            </Stack>
          </Stack>
          <AutoAwesomeIcon sx={{ position: 'absolute', right: 24, bottom: 24, fontSize: 120, opacity: 0.12 }} />
        </Paper>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard label="Total Students" value={stats.totalStudents} icon={<Groups2Icon />} accent="#7ec8e3" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard label="Total Tutors" value={stats.totalTutors} icon={<SchoolIcon />} accent="#c79bf2" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard label="Total Bookings" value={stats.totalBookings} icon={<MenuBookIcon />} accent="#f2c66d" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard label="Upcoming Sessions" value={stats.upcomingSessions} icon={<TodayIcon />} accent="#d3a6f5" />
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 0, md: 3 },
                borderRadius: { xs: 0, md: 5 },
                border: (theme) => ({ xs: 'none', md: `1px solid ${alpha(theme.palette.divider, 0.8)}` }),
                backgroundColor: { xs: 'transparent', md: 'background.paper' },
                height: '100%',
                boxShadow: 'none',
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h5" fontWeight={800}>Tutors Module</Typography>
                <Typography color="text.secondary">
                  Manage tutor profiles, add new tutors, and maintain the teaching roster from a dedicated page.
                </Typography>
                <Button variant="contained" onClick={() => router.push('/admin/tutors')}>
                  Go to Tutors
                </Button>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 0, md: 3 },
                borderRadius: { xs: 0, md: 5 },
                border: (theme) => ({ xs: 'none', md: `1px solid ${alpha(theme.palette.divider, 0.8)}` }),
                backgroundColor: { xs: 'transparent', md: 'background.paper' },
                height: '100%',
                boxShadow: 'none',
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h5" fontWeight={800}>Students Module</Typography>
                <Typography color="text.secondary">
                  Review all registered students from a separate admin page built specifically for student visibility.
                </Typography>
                <Button variant="contained" onClick={() => router.push('/admin/students')}>
                  Go to Students
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

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
          <Stack spacing={2.5}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="h5" fontWeight={800}>Recent Booking Activity</Typography>
                <Typography color="text.secondary">
                  Admin-only booking visibility with student details and session notes.
                </Typography>
              </Box>
              <Button variant="outlined" onClick={() => router.push('/booking-management')}>
                Open Booking Management
              </Button>
            </Stack>
            {bookingsQuery.isError ? <Alert severity="error">Unable to load recent bookings right now.</Alert> : <BookingsTable bookings={bookingsQuery.data?.rows ?? []} variant="admin" />}
          </Stack>
        </Paper>
      </Stack>
    </DashboardShell>
  );
}
