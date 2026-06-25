export type Tutor = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  bio?: string;
  hourlyRate: number;
  isActive: boolean;
  availabilities?: Array<{
    id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
};

export type StudentSummary = {
  id: number;
  userId: number;
  phone?: string | null;
  gradeLevel?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
    role?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
};

export type Booking = {
  id: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  sessionStart: string;
  sessionEnd: string;
  notes?: string;
  tutor?: Tutor;
  student?: StudentSummary;
};

export type DashboardStats = {
  totalStudents: number;
  totalTutors: number;
  totalBookings: number;
  upcomingSessions: number;
};
