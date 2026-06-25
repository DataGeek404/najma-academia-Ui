'use client';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
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
import { PropsWithChildren, useMemo, useState } from 'react';
import { getStoredUser } from '@/features/auth/session';
import { logoutUser } from '@/features/auth/logout';

const drawerWidth = 300;

export const studentNavItems = [
  { label: 'Dashboard', caption: 'Bookings and progress', href: '/bookings', icon: <DashboardIcon /> },
  { label: 'Tutors', caption: 'Browse tutor profiles', href: '/tutors', icon: <SchoolIcon /> },
];

export function StudentShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = getStoredUser();

  const userLabel = useMemo(() => user?.email?.split('@')[0] ?? 'student', [user]);

  const handleLogout = () => {
    logoutUser();
    setMobileOpen(false);
    router.push('/login');
  };

  const drawerContent = (
    <Stack sx={{ height: '100%', p: 2.5, justifyContent: 'space-between', overflowY: 'auto', bgcolor: 'background.paper' }} spacing={3}>
      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: 2.25,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)} 0%, ${alpha(theme.palette.secondary.main, 0.14)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
            boxShadow: `0 18px 40px ${alpha(theme.palette.primary.main, 0.08)}`,
          })}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 48, height: 48, fontWeight: 800 }}>{userLabel.charAt(0).toUpperCase()}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={800} color="text.primary" noWrap>
                {userLabel}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user?.email ?? 'student@najma.com'}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Box>
          <Typography variant="overline" sx={{ px: 1.5, color: 'text.secondary', letterSpacing: 1.4, fontWeight: 700 }}>
            Student workspace
          </Typography>
          <List sx={{ py: 1 }}>
            {studentNavItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <ListItemButton
                  key={item.href}
                  component={Link}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  sx={(theme) => ({
                    mb: 1,
                    px: 1.5,
                    py: 1.35,
                    borderRadius: 3.5,
                    alignItems: 'flex-start',
                    border: `1px solid ${isActive ? alpha(theme.palette.primary.main, 0.22) : alpha(theme.palette.divider, 0.5)}`,
                    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.common.white, 0.92),
                    boxShadow: isActive ? `0 12px 30px ${alpha(theme.palette.primary.main, 0.12)}` : `0 8px 20px ${alpha(theme.palette.common.black, 0.04)}`,
                    '&:hover': {
                      bgcolor: isActive ? alpha(theme.palette.primary.main, 0.16) : alpha(theme.palette.primary.main, 0.06),
                    },
                  })}
                >
                  <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 42, mt: 0.25 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    secondary={item.caption}
                    primaryTypographyProps={{ fontWeight: isActive ? 800 : 700, color: 'text.primary' }}
                    secondaryTypographyProps={{ sx: { mt: 0.35, color: 'text.secondary' } }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        <Paper
          elevation={0}
          sx={(theme) => ({
            p: 2,
            borderRadius: 4,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          })}
        >
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <MenuBookIcon color="primary" fontSize="small" />
              <Typography fontWeight={800} color="text.primary">Quick actions</Typography>
            </Stack>
            <Button variant="contained" onClick={() => { setMobileOpen(false); router.push('/bookings'); }}>
              Open dashboard
            </Button>
            <Button variant="outlined" onClick={() => { setMobileOpen(false); router.push('/tutors'); }}>
              Explore tutors
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
          bgcolor: alpha(theme.palette.background.paper, 0.96),
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.05)}`,
        })}
      >
        <Toolbar sx={{ gap: 1.5, minHeight: 80, px: { xs: 2, sm: 3 } }}>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen((open) => !open)} sx={{ display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Avatar sx={(theme) => ({ bgcolor: alpha(theme.palette.primary.main, 0.14), color: 'primary.main', width: 44, height: 44, display: { xs: 'none', sm: 'flex' } })}>
            <AutoAwesomeIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" noWrap component="div" fontWeight={900} color="text.primary">
              Student Learning Hub
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' }, maxWidth: 680 }}>
              Manage bookings, discover tutors, and stay on top of your study plan.
            </Typography>
          </Box>
          <Chip
            label={pathname === '/tutors' ? 'Tutors view' : 'Dashboard view'}
            color="primary"
            variant="filled"
            sx={{ display: { xs: 'none', lg: 'inline-flex' }, fontWeight: 700 }}
          />
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ display: { xs: 'none', md: 'inline-flex' }, color: 'text.primary', fontWeight: 700 }}>
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

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, pt: { xs: 12, sm: 13 }, width: '100%', minWidth: 0, maxWidth: 1600, mx: 'auto' }}>
        {children}
      </Box>
    </Box>
  );
}
