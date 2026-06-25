import type { Metadata } from 'next';
import { AppProviders } from '@/lib/providers/app-providers';

export const metadata: Metadata = {
  title: 'CampusConnect',
  description: 'Academic support booking platform for university students to connect with tutors and manage sessions.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
