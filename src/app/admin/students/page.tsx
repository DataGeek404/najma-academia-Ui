'use client';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Groups2Icon from '@mui/icons-material/Groups2';
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
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { requireRole } from '@/features/auth/session';
import { deleteStudent, fetchStudents, StudentPayload, updateStudent } from '@/features/students/api';

type AdminStudent = {
  id: number;
  userId: number;
  phone?: string | null;
  gradeLevel?: string | null;
  notes?: string | null;
  user?: {
    id: number;
    fullName?: string;
    email: string;
    isActive?: boolean;
  };
};

const initialStudentForm: StudentPayload = {
  phone: '',
  gradeLevel: '',
  notes: '',
};

export default function AdminStudentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<AdminStudent | null>(null);
  const [form, setForm] = useState<StudentPayload>(initialStudentForm);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!requireRole('admin')) {
      router.replace('/bookings');
      return;
    }

    setIsReady(true);
  }, [router]);

  const studentsQuery = useQuery({ queryKey: ['admin-students'], queryFn: fetchStudents, enabled: isReady });
  const students = (studentsQuery.data ?? []) as AdminStudent[];

  const saveStudentMutation = useMutation({
    mutationFn: (payload: StudentPayload) => updateStudent(editingStudent!.id, payload),
    onSuccess: () => {
      setFeedback({ type: 'success', message: 'Student updated successfully.' });
      setDialogOpen(false);
      setEditingStudent(null);
      setForm(initialStudentForm);
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
    },
    onError: () => setFeedback({ type: 'error', message: 'Unable to save student details right now.' }),
  });

  const deleteStudentMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      setFeedback({ type: 'success', message: 'Student removed successfully.' });
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
    },
    onError: () => setFeedback({ type: 'error', message: 'Unable to delete student right now.' }),
  });

  const openEditDialog = (student: AdminStudent) => {
    setEditingStudent(student);
    setForm({
      phone: student.phone ?? '',
      gradeLevel: student.gradeLevel ?? '',
      notes: student.notes ?? '',
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
            <Typography variant="h4" fontWeight={800}>Student Management</Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              This dedicated admin module is focused only on student visibility. Review all registered students from a separate page.
            </Typography>
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
          }}
        >
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Groups2Icon color="primary" />
              <Box>
                <Typography variant="h5" fontWeight={800}>All Students</Typography>
                <Typography color="text.secondary">
                  Every registered student is listed here for admin review.
                </Typography>
              </Box>
            </Stack>
            {studentsQuery.isLoading ? (
              <Alert severity="info">Loading students...</Alert>
            ) : studentsQuery.isError ? (
              <Alert severity="error">Unable to load students right now.</Alert>
            ) : students.length === 0 ? (
              <Alert severity="info">No students found.</Alert>
            ) : (
              <>
                <Stack spacing={1.5} sx={{ display: { xs: 'flex', md: 'none' } }}>
                  {students.map((student) => (
                    <Paper
                      key={student.id}
                      elevation={0}
                      sx={(theme) => ({
                        position: 'relative',
                        overflow: 'hidden',
                        p: 2,
                        borderRadius: 4,
                        border: `1px solid ${alpha(theme.palette.secondary?.main || theme.palette.primary.main, 0.16)}`,
                        background: `linear-gradient(180deg, ${alpha(theme.palette.secondary?.main || theme.palette.primary.main, 0.14)} 0%, ${alpha(theme.palette.background.paper, 0.96)} 42%, ${theme.palette.background.paper} 100%)`,
                        boxShadow: `0 12px 30px ${alpha(theme.palette.common.black, 0.08)}`,
                      })}
                    >
                      <Box
                        sx={(theme) => ({
                          position: 'absolute',
                          inset: 0,
                          backgroundImage: `radial-gradient(${alpha(theme.palette.secondary?.main || theme.palette.primary.main, 0.14)} 1.2px, transparent 1.2px)`,
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
                          right: -24,
                          top: -24,
                          width: 120,
                          height: 120,
                          borderRadius: '50%',
                          background: `radial-gradient(circle, ${alpha(theme.palette.secondary?.main || theme.palette.primary.main, 0.16)} 0%, transparent 70%)`,
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
                              color: theme.palette.secondary?.main || theme.palette.primary.main,
                              backgroundColor: alpha(theme.palette.common.white, 0.36),
                              backdropFilter: 'blur(4px)',
                            })}
                          >
                            <SchoolIcon />
                          </Box>
                          <Typography
                            component="span"
                            sx={(theme) => ({
                              display: 'inline-flex',
                              alignItems: 'center',
                              px: 1.25,
                              py: 0.5,
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 700,
                              color: student.user?.isActive === false ? theme.palette.error.main : theme.palette.success.main,
                              backgroundColor:
                                student.user?.isActive === false
                                  ? alpha(theme.palette.error.main, 0.1)
                                  : alpha(theme.palette.success.main, 0.1),
                              border: `1px solid ${
                                student.user?.isActive === false
                                  ? alpha(theme.palette.error.main, 0.18)
                                  : alpha(theme.palette.success.main, 0.18)
                              }`,
                            })}
                          >
                            {student.user?.isActive === false ? 'Inactive' : 'Active'}
                          </Typography>
                        </Stack>

                        <Stack spacing={0.5}>
                          <Typography fontWeight={800} sx={{ fontSize: '1.05rem' }}>{student.user?.fullName || 'No name available'}</Typography>
                          <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            Student #{student.id}
                          </Typography>
                        </Stack>

                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between" spacing={2}>
                            <Typography variant="caption" color="text.secondary">Email</Typography>
                            <Typography variant="body2" fontWeight={600} sx={{ textAlign: 'right', wordBreak: 'break-word' }}>
                              {student.user?.email || 'No email available'}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" spacing={2}>
                            <Typography variant="caption" color="text.secondary">Phone</Typography>
                            <Typography variant="body2" fontWeight={600} sx={{ textAlign: 'right' }}>{student.phone || '—'}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" spacing={2}>
                            <Typography variant="caption" color="text.secondary">Grade Level</Typography>
                            <Typography variant="body2" fontWeight={600} sx={{ textAlign: 'right' }}>{student.gradeLevel || '—'}</Typography>
                          </Stack>
                        </Stack>

                        <Stack spacing={0.5}>
                          <Typography variant="caption" color="text.secondary">Notes</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {student.notes || 'No notes added for this student.'}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                          <Button size="small" startIcon={<EditOutlinedIcon />} onClick={() => openEditDialog(student)}>
                            Edit
                          </Button>
                          <Button size="small" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => deleteStudentMutation.mutate(student.id)}>
                            Delete
                          </Button>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>

                <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Table sx={{ minWidth: 760 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Student ID</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Grade Level</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id} hover>
                          <TableCell>#{student.id}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {student.user?.fullName || 'No name available'}
                          </TableCell>
                          <TableCell>{student.user?.email || 'No email available'}</TableCell>
                          <TableCell>{student.phone || '—'}</TableCell>
                          <TableCell>{student.gradeLevel || '—'}</TableCell>
                          <TableCell>
                            <Typography
                              component="span"
                              sx={(theme) => ({
                                display: 'inline-flex',
                                alignItems: 'center',
                                px: 1.25,
                                py: 0.5,
                                borderRadius: 999,
                                fontSize: 12,
                                fontWeight: 700,
                                color: student.user?.isActive === false ? theme.palette.error.main : theme.palette.success.main,
                                backgroundColor:
                                  student.user?.isActive === false
                                    ? alpha(theme.palette.error.main, 0.1)
                                    : alpha(theme.palette.success.main, 0.1),
                              })}
                            >
                              {student.user?.isActive === false ? 'Inactive' : 'Active'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 280 }}>
                            <Typography variant="body2" color="text.secondary" noWrap title={student.notes || ''}>
                              {student.notes || '—'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton color="primary" onClick={() => openEditDialog(student)}>
                                <EditOutlinedIcon />
                              </IconButton>
                              <IconButton color="error" onClick={() => deleteStudentMutation.mutate(student.id)}>
                                <DeleteOutlineIcon />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Stack>
        </Paper>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Edit Student</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField label="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} fullWidth />
              <TextField label="Grade Level" value={form.gradeLevel} onChange={(event) => setForm({ ...form, gradeLevel: event.target.value })} fullWidth />
              <TextField label="Notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} multiline minRows={4} fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => saveStudentMutation.mutate(form)} disabled={saveStudentMutation.isPending || !editingStudent}>
              {saveStudentMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </DashboardShell>
  );
}
