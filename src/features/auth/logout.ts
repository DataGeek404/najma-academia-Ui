'use client';

export function logoutUser() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}

