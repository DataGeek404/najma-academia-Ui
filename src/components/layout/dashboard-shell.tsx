'use client';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import TuneIcon from '@mui/icons-material/Tune';
import {
  alpha,
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { PropsWithChildren, useState } from 'react';
import { logoutUser } from '@/features/auth/logout';

const drawerWidth = 300;

const navGroups = [
  {
    label: 'Workspace',
    items: [
      { label: 'Overview', caption: 'Platform summary', href: '/admin', icon: <DashboardIcon /> },
      { label: 'Bookings', caption: 'Operations and approvals', href: '/booking-management', icon: <MenuBookIcon /> },
    ],
  },
  {
    label: 'Admin Sections',
    items: [
      { label: 'Tutors', caption: 'Roster and profiles', href: '/admin/tutors', icon: <SchoolIcon /> },
      { label: 'Students', caption: 'Insights and activity', href: '/admin/students', icon: <PeopleIcon /> },
    ],
  },
];

export function DashboardShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setMobileOpen(false);
    router.push('/login');
  };

  const isNavItemActive = (href: string) => {
    const [basePath] = href.split('#');
    return pathname === basePath;
  };

  const drawerContent = (
    <Stack sx={{ height: '100%', p: 2.5, justifyContent: 'space-between', overflowY: 'auto' }} spacing={3}>
      <Stack spacing={3} sx={{ minHeight: 0 }}>
        <Stack spacing={2} sx={{ py: 2 }}>
          {navGroups.map((group) => (
            <Box key={group.label}>
              <Typography variant="overline" sx={{ px: 1.5, color: 'text.secondary', letterSpacing: 1.4 }}>
                {group.label}
              </Typography>
              <List sx={{ py: 1 }}>
                {group.items.map((item) => {
                  const isActive = isNavItemActive(item.href);

                  return (
                    <ListItemButton
                      key={item.href}
                      component={Link}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      sx={(theme) => ({
                        mb: 1,
                        px: 1.5,
                        py: 1.25,
                        borderRadius: 3.5,
                        alignItems: 'flex-start',
                        border: `1px solid ${isActive ? alpha(theme.palette.primary.main, 0.18) : 'transparent'}`,
                        bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                        boxShadow: isActive ? `0 12px 30px ${alpha(theme.palette.primary.main, 0.12)}` : 'none',
                      })}
                    >
                      <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 42, mt: 0.25 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        secondary={item.caption}
                        primaryTypographyProps={{ fontWeight: isActive ? 800 : 700 }}
                        secondaryTypographyProps={{ sx: { mt: 0.25 } }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>
          ))}
        </Stack>

        <Paper elevation={0} sx={{ p: 2, borderRadius: 4, bgcolor: 'grey.50', border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.8)}` }}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TuneIcon color="primary" fontSize="small" />
              <Typography fontWeight={800}>Quick actions</Typography>
            </Stack>
            <Button variant="contained" onClick={() => router.push('/admin')}>
              Open overview
            </Button>
            <Button variant="outlined" onClick={() => router.push('/booking-management')}>
              Review bookings
            </Button>
          </Stack>
        </Paper>
      </Stack>

      <Box sx={{ pt: 1.5 }}>
        <Divider sx={{ mb: 2 }} />
        <Button fullWidth variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={(theme) => ({
          zIndex: 1201,
          backdropFilter: 'blur(18px)',
          bgcolor: alpha(theme.palette.background.paper, 0.9),
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        })}
      >
        <Toolbar sx={{ gap: 1.5, minHeight: 80 }}>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen((open) => !open)} sx={{ display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Avatar sx={(theme) => ({ bgcolor: alpha(theme.palette.primary.main, 0.12), color: 'primary.main', width: 44, height: 44, display: { xs: 'none', sm: 'flex' } })}>
            <AutoAwesomeIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" noWrap component="div" fontWeight={900}>
              Admin Navigation Hub
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              A cleaner navbar for faster tutor, booking, and student management.
            </Typography>
          </Box>
          <Chip
            label={pathname === '/booking-management' ? 'Bookings view' : pathname === '/admin/tutors' ? 'Tutors view' : pathname === '/admin/students' ? 'Students view' : 'Overview view'}
            color="primary"
            variant="outlined"
            sx={{ display: { xs: 'none', lg: 'inline-flex' } }}
          />
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          [`& .MuiDrawer-paper`]: {
            width: 'min(300px, 100vw)',
            maxWidth: '100vw',
            height: '100dvh',
            boxSizing: 'border-box',
            bgcolor: '#fff',
            overflow: 'hidden',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0,0,0,0.06)',
            bgcolor: '#fff',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, mt: 11, width: '100%', minWidth: 0 }}>
        {children}
      </Box>
    </Box>
  );
}
