// app/pages/admin/page.tsx
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/src/components/Admin/AdminDashboard';

export default async function AdminPage() {
  const user = await currentUser();
  
  // Check if user exists
  if (!user) {
    redirect('/');
  }
  
  // Check if user is an admin
  const adminEmails = ['sulafaj@bu.edu', 'wfugate@bu.edu', 'alanl193@bu.edu', 'kalc@bu.edu'];
  
  const userEmail = user.emailAddresses[0]?.emailAddress;
  if (!userEmail || !adminEmails.includes(userEmail)) {
    redirect('/');
  }
  
  // Create a simplified version of the user with only the properties you need
  const simplifiedUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: userEmail,
    imageUrl: user.imageUrl,
  };
  
  return <AdminDashboard user={simplifiedUser} />;
}