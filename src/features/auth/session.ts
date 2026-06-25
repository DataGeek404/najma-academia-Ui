'use client';

export type AppUser = {
  id?: number;
  email: string;
  role: 'admin' | 'student';
  student?: { id: number };
};

export function getStoredUser(): AppUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawUser = localStorage.getItem('user');
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AppUser;
  } catch {
    return null;
  }
}

export function requireRole(expectedRole: AppUser['role']) {
  const user = getStoredUser();

  if (!user || user.role !== expectedRole) {
    return false;
  }

  return true;
}

