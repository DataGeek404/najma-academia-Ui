'use client';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SchoolIcon from '@mui/icons-material/School';
import {
  alpha,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { Tutor } from '@/types';

type TutorsTableProps = {
  tutors: Tutor[];
  onEdit?: (tutor: Tutor) => void;
  onDelete?: (tutor: Tutor) => void;
};

export function TutorsTable({ tutors, onEdit, onDelete }: TutorsTableProps) {
  const showActions = Boolean(onEdit || onDelete);

  return (
    <>
      <Stack spacing={1.5} sx={{ display: { xs: 'flex', md: 'none' } }}>
        {tutors.map((tutor) => (
          <Paper
            key={tutor.id}
            elevation={0}
            sx={(theme) => ({
              position: 'relative',
              overflow: 'hidden',
              p: 2,
              borderRadius: 4,
              border: `1px solid ${alpha('#7ec8e3', 0.18)}`,
              background: `linear-gradient(180deg, ${alpha('#7ec8e3', 0.16)} 0%, ${alpha(theme.palette.background.paper, 0.96)} 42%, ${theme.palette.background.paper} 100%)`,
              boxShadow: `0 12px 30px ${alpha(theme.palette.common.black, 0.08)}`,
            })}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(${alpha('#7ec8e3', 0.18)} 1.2px, transparent 1.2px)`,
                backgroundSize: '10px 10px',
                opacity: 0.55,
                maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 55%)',
                WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 55%)',
                pointerEvents: 'none',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                right: -24,
                top: -24,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha('#7ec8e3', 0.18)} 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />

            <Stack spacing={1.75} sx={{ position: 'relative', zIndex: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2.5,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2f7f98',
                    backgroundColor: alpha('#ffffff', 0.55),
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <SchoolIcon />
                </Box>
                <Chip label={tutor.isActive ? 'Active' : 'Inactive'} color={tutor.isActive ? 'success' : 'default'} variant="outlined" size="small" />
              </Stack>

              <Stack spacing={0.5}>
                <Typography fontWeight={800} sx={{ fontSize: '1.05rem' }}>{tutor.fullName}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {tutor.subject}
                </Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary">
                {tutor.bio?.trim() || 'No tutor bio added yet.'}
              </Typography>

              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ textAlign: 'right', wordBreak: 'break-word' }}>{tutor.email}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ textAlign: 'right' }}>{tutor.phone?.trim() || 'No phone number'}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="caption" color="text.secondary">Rate</Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ textAlign: 'right' }}>${tutor.hourlyRate}/hr</Typography>
                </Stack>
              </Stack>

              {showActions ? (
                <Stack direction="row" justifyContent="flex-end" spacing={0.5} sx={{ pt: 0.5, borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.8)}` }}>
                  {onEdit ? (
                    <Tooltip title="Edit tutor">
                      <IconButton color="primary" onClick={() => onEdit(tutor)}>
                        <EditOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  {onDelete ? (
                    <Tooltip title="Delete tutor">
                      <IconButton color="error" onClick={() => onDelete(tutor)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </Stack>
              ) : null}
            </Stack>
          </Paper>
        ))}
      </Stack>

      <TableContainer component={Paper} sx={{ display: { xs: 'none', md: 'block' }, overflowX: 'auto', borderRadius: 4, boxShadow: 'none' }}>
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Status</TableCell>
              {showActions ? <TableCell align="right">Actions</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {tutors.map((tutor) => (
              <TableRow key={tutor.id} hover>
                <TableCell sx={{ minWidth: 220 }}>
                  <Stack spacing={0.5}>
                    <Typography fontWeight={700}>{tutor.fullName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tutor.bio?.trim() || 'No tutor bio added yet.'}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{tutor.subject}</TableCell>
                <TableCell sx={{ minWidth: 220 }}>
                  <Stack spacing={0.5}>
                    <Typography sx={{ wordBreak: 'break-word' }}>{tutor.email}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tutor.phone?.trim() || 'No phone number'}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>${tutor.hourlyRate}/hr</TableCell>
                <TableCell>
                  <Chip label={tutor.isActive ? 'Active' : 'Inactive'} color={tutor.isActive ? 'success' : 'default'} variant="outlined" />
                </TableCell>
                {showActions ? (
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    {onEdit ? (
                      <Tooltip title="Edit tutor">
                        <IconButton color="primary" onClick={() => onEdit(tutor)}>
                          <EditOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    {onDelete ? (
                      <Tooltip title="Delete tutor">
                        <IconButton color="error" onClick={() => onDelete(tutor)}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
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
