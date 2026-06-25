import { Box, Button, Container, Stack, Typography } from '@mui/material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
      <Stack spacing={3} textAlign="center" alignItems="center">
        <Typography variant="h2" fontWeight={700} sx={{ fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' } }}>
          CampusConnect
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 720, fontSize: { xs: '1rem', sm: '1.15rem' } }}>
          Helping university students book academic support sessions, connect with tutors, and stay on top of coursework from one place.
        </Typography>
        <Box>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <Button variant="contained" size="large" sx={{ width: { xs: '100%', sm: 'auto' }, px: 4 }}>
              Get Started
            </Button>
          </Link>
        </Box>
      </Stack>
    </Container>
  );
}
