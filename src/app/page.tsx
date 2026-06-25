'use client';

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
const highlights = [
  {
    title: 'Book trusted tutors fast',
    description: 'Browse academic support sessions, compare tutors, and reserve time slots without the back-and-forth.',
    icon: <CalendarMonthRoundedIcon fontSize="small" />,
  },
  {
    title: 'Built for focused learning',
    description: 'Keep coursework moving with a calm dashboard for bookings, progress, and tutor coordination.',
    icon: <SchoolRoundedIcon fontSize="small" />,
  },
  {
    title: 'Designed for modern campuses',
    description: 'A polished experience for students, tutors, and admins across desktop and mobile.',
    icon: <AutoAwesomeRoundedIcon fontSize="small" />,
  },
];
const showcaseCards = [
  {
    title: 'Personal study rhythm',
    description: 'Students can discover support that fits their pace, schedule, and academic goals.',
    image: '/undraw_reading_6jjr.png',
  },
  {
    title: 'Tutor-led clarity',
    description: 'Tutors present concepts visually and guide learners through difficult topics with confidence.',
    image: '/undraw_professor_d7zn.png',
  },
  {
    title: 'Collaborative progress',
    description: 'Learning becomes easier when students and tutors share a clear plan and consistent follow-up.',
    image: '/undraw_working-together_r43a.png',
  },
];
export default function HomePage() {
  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        background: `radial-gradient(circle at top left, ${alpha(theme.palette.primary.main, 0.12)} 0%, transparent 28%), radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 24%), linear-gradient(180deg, ${theme.palette.grey[50]} 0%, ${theme.palette.background.default} 100%)`,
      })}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: { xs: 5, md: 7 }, flexWrap: 'wrap' }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={(theme) => ({
                width: 42,
                height: 42,
                borderRadius: 3,
                display: 'grid',
                placeItems: 'center',
                color: theme.palette.common.white,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.92)})`,
                boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.28)}`,
              })}
            >
              <SchoolRoundedIcon />
            </Box>
            <Box>
              <Typography fontWeight={800}>Najma Academia</Typography>
              <Typography variant="caption" color="text.secondary">
                Academic support, beautifully organized
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Button color="inherit">Login</Button>
            </Link>
            <Link href="/register" style={{ textDecoration: 'none' }}>
              <Button variant="contained">Get Started</Button>
            </Link>
          </Stack>
        </Stack>
        <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
            <Stack spacing={2.5}>
              <Chip
                label="Smarter tutoring for modern learners"
                color="primary"
                variant="outlined"
                sx={{ alignSelf: 'flex-start', borderRadius: 999, px: 1 }}
              />
              <Typography
                variant="h1"
                fontWeight={900}
                sx={{ fontSize: { xs: '2.5rem', sm: '3.2rem', md: '4.2rem' }, lineHeight: 1, maxWidth: 620 }}
              >
                Book trusted tutors with less effort.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 560, fontSize: { xs: '1rem', md: '1.05rem' }, lineHeight: 1.8 }}
              >
                Discover tutors, confirm sessions, and keep learning on track.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Link href="/register" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />} sx={{ px: 4, py: 1.5 }}>
                    Get Started
                  </Button>
                </Link>
                <Link href="/tutors" style={{ textDecoration: 'none' }}>
                  <Button variant="outlined" size="large" sx={{ px: 4, py: 1.5 }}>
                    Browse Tutors
                  </Button>
                </Link>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
            <Box sx={{ position: 'relative', maxWidth: 560, mx: 'auto' }}>
              <Box
                sx={(theme) => ({
                  position: 'absolute',
                  inset: '10% 8% auto auto',
                  width: 220,
                  height: 220,
                  borderRadius: '50%',
                  background: alpha(theme.palette.primary.main, 0.14),
                  filter: 'blur(18px)',
                })}
              />
              <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1077 / 768' }}>
                <Image src="/undraw_reading_6jjr.png" alt="Student learning illustration" fill style={{ objectFit: 'contain' }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Stack spacing={1.5} textAlign="center" sx={{ mb: 5 }}>
            <Typography variant="overline" color="primary.main">
              A visual learning journey
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              Built around how students actually learn
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760, mx: 'auto', lineHeight: 1.8 }}>
              The platform experience mirrors the tutoring journey: discover support, understand concepts clearly, and keep momentum through collaboration.
            </Typography>
          </Stack>
          <Grid container spacing={3}>
            {showcaseCards.map((card) => (
              <Grid key={card.title} size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', borderRadius: 0, boxShadow: 'none', backgroundColor: 'transparent' }}>
                  <Box sx={{ position: 'relative', width: '100%', aspectRatio: '4 / 3' }}>
                    <Image src={card.image} alt={card.title} fill style={{ objectFit: 'contain' }} />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {card.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Card
          elevation={0}
          sx={{
            borderRadius: 0,
            overflow: 'visible',
            border: 'none',
            background: 'transparent',
            boxShadow: 'none',
          }}
        >
          <Grid container alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ p: { xs: 3, md: 6 } }}>
                <Typography variant="overline" color="primary.main">
                  Ready to begin?
                </Typography>
                <Typography variant="h3" fontWeight={900} sx={{ mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
                  Turn tutoring into a smooth, inspiring routine.
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 620, lineHeight: 1.8 }}>
                  Join Najma Academia to discover tutors, manage sessions, and create a more intentional academic rhythm.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Link href="/register" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" size="large">
                      Create Account
                    </Button>
                  </Link>
                  <Link href="/login" style={{ textDecoration: 'none' }}>
                    <Button variant="text" size="large">
                      I already have an account
                    </Button>
                  </Link>
                </Stack>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1077 / 768' }}>
                <Image src="/undraw_professor_d7zn.png" alt="Learning support illustration" fill style={{ objectFit: 'contain' }} />
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
}
