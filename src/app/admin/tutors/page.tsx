'use client';

import SchoolIcon from '@mui/icons-material/School';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { TutorsTable } from '@/components/tables/tutors-table';
import { requireRole } from '@/features/auth/session';
import { createTutor, deleteTutor, fetchTutors, TutorPayload, updateTutor } from '@/features/tutors/api';
import { Tutor } from '@/types';

const initialTutorForm: TutorPayload = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  bio: '',
  hourlyRate: 25,
  isActive: true,
};

export default function AdminTutorsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
  const [form, setForm] = useState<TutorPayload>(initialTutorForm);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!requireRole('admin')) {
      router.replace('/bookings');
      return;
    }

    setIsReady(true);
  }, [router]);

  const tutorsQuery = useQuery({ queryKey: ['admin-tutors'], queryFn: () => fetchTutors('', 1, 50), enabled: isReady });

  const saveTutorMutation = useMutation({
    mutationFn: (payload: TutorPayload) => editingTutor ? updateTutor(editingTutor.id, payload) : createTutor(payload),
    onSuccess: () => {
      setFeedback({ type: 'success', message: editingTutor ? 'Tutor updated successfully.' : 'Tutor added successfully.' });
      setDialogOpen(false);
      setEditingTutor(null);
      setForm(initialTutorForm);
      queryClient.invalidateQueries({ queryKey: ['admin-tutors'] });
    },
    onError: () => setFeedback({ type: 'error', message: 'Unable to save tutor details. Please review the form and try again.' }),
  });

  const deleteTutorMutation = useMutation({
    mutationFn: deleteTutor,
    onSuccess: () => {
      setFeedback({ type: 'success', message: 'Tutor removed successfully.' });
      queryClient.invalidateQueries({ queryKey: ['admin-tutors'] });
    },
    onError: () => setFeedback({ type: 'error', message: 'Unable to delete tutor right now.' }),
  });

  const openCreateDialog = () => {
    setEditingTutor(null);
    setForm(initialTutorForm);
    setDialogOpen(true);
  };

  const openEditDialog = (tutor: Tutor) => {
    setEditingTutor(tutor);
    setForm({
      fullName: tutor.fullName,
      email: tutor.email,
      phone: tutor.phone ?? '',
      subject: tutor.subject,
      bio: tutor.bio ?? '',
      hourlyRate: tutor.hourlyRate,
      isActive: tutor.isActive,
    });
    setDialogOpen(true);
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
            <Typography variant="h4" fontWeight={800}>Tutor Management</Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              This dedicated admin module is focused only on tutor operations. Add, edit, and maintain the full tutor roster here.
            </Typography>
            <Box>
              <Button variant="contained" startIcon={<SchoolIcon />} onClick={openCreateDialog}>
                Add Tutor
              </Button>
            </Box>
          </Stack>
        </Paper>

        {feedback ? <Alert severity={feedback.type}>{feedback.message}</Alert> : null}

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
            <Box>
              <Typography variant="h5" fontWeight={800}>All Tutors</Typography>
              <Typography color="text.secondary">
                Review and manage every tutor profile from this separate module.
              </Typography>
            </Box>
            {tutorsQuery.isError ? (
              <Alert severity="error">Unable to load tutors right now.</Alert>
            ) : (
              <TutorsTable
                tutors={tutorsQuery.data?.rows ?? []}
                onEdit={openEditDialog}
                onDelete={(tutor) => deleteTutorMutation.mutate(tutor.id)}
              />
            )}
          </Stack>
        </Paper>
      </Stack>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingTutor ? 'Edit Tutor' : 'Add Tutor'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Full Name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} fullWidth />
            <TextField label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} fullWidth />
            <TextField label="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} fullWidth />
            <TextField label="Subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} fullWidth />
            <TextField label="Hourly Rate" type="number" value={form.hourlyRate} onChange={(event) => setForm({ ...form, hourlyRate: Number(event.target.value) })} fullWidth />
            <TextField label="Bio" value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} multiline minRows={4} fullWidth />
            <FormControlLabel
              control={<Switch checked={Boolean(form.isActive)} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />}
              label="Tutor is active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => saveTutorMutation.mutate(form)} disabled={saveTutorMutation.isPending}>
            {saveTutorMutation.isPending ? 'Saving...' : editingTutor ? 'Save Changes' : 'Create Tutor'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardShell>
  );
}
