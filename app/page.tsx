import { redirect } from 'next/navigation';
import { initialProfile } from '@/lib/initial.profile';

export default async function RootPage() {
  // Get or create the user profile
  const profile = await initialProfile();
  
  // Redirect to dashboard
  return redirect('/dashboard');
} 