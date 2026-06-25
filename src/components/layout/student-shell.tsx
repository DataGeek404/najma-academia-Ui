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

const navItems = [
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
    <Stack sx={{ height: '100%', p: 2.5, justifyContent: 'space-between', overflowY: 'auto' }} spacing={3}>
      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: 2,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.secondary.main, 0.12)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          })}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>{userLabel.charAt(0).toUpperCase()}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={800} noWrap>
                {userLabel}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user?.email ?? 'student@najma.com'}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Box>
          <Typography variant="overline" sx={{ px: 1.5, color: 'text.secondary', letterSpacing: 1.4 }}>
            Student workspace
          </Typography>
          <List sx={{ py: 1 }}>
            {navItems.map((item) => {
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
                    slotProps={{
                      primary: { fontWeight: isActive ? 800 : 700 },
                      secondary: { sx: { mt: 0.25 } },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        <Paper elevation={0} sx={{ p: 2, borderRadius: 4, bgcolor: 'grey.50', border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.8)}` }}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <MenuBookIcon color="primary" fontSize="small" />
              <Typography fontWeight={800}>Quick actions</Typography>
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
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" noWrap component="div" fontWeight={900}>
              Student Learning Hub
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Manage bookings, discover tutors, and stay on top of your study plan.
            </Typography>
          </Box>
          <Chip
            label={pathname === '/tutors' ? 'Tutors view' : 'Dashboard view'}
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
