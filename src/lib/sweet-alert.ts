'use client';

import Swal from 'sweetalert2';

const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2600,
  timerProgressBar: true,
  customClass: {
    popup: 'najma-swal-toast',
  },
});

export function showSuccessToast(title: string, text?: string) {
  return toast.fire({ icon: 'success', title, text });
}

export function showErrorToast(title: string, text?: string) {
  return toast.fire({ icon: 'error', title, text });
}

export function showInfoToast(title: string, text?: string) {
  return toast.fire({ icon: 'info', title, text });
}

export function showCenteredSuccess(title: string, text?: string) {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'Confirm',
    allowOutsideClick: true,
    allowEscapeKey: true,
  });
}

export function showCenteredError(title: string, text?: string) {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Confirm',
  });
}

