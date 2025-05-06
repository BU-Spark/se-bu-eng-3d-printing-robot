import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminNavbar from "@/app/components/Admin/Navigation";

/**
 * AdminLayout Component
 * 
 * A protected layout component that:
 * - Verifies user authentication
 * - Checks admin privileges
 * - Provides the admin navigation structure
 * 
 * Features:
 * - Restricts access to authorized admins only
 * - Passes simplified user data to child components
 * - Responsive layout structure
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The admin layout structure
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current authenticated user from Clerk
  const user = await currentUser();

  // Redirect to home if no user is authenticated
  if (!user) redirect("/");

  // List of authorized admin emails
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  
  // Get the user's primary email address
  const userEmail = user.emailAddresses[0]?.emailAddress;

  // Redirect to home if the user is not an admin
  if (!userEmail || !adminEmails.includes(userEmail)) redirect("/");

  // Create a simplified user object to pass to the child components
  const simplifiedUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: userEmail,
    imageUrl: user.imageUrl,
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 64px)",
        marginTop: "0",
      }}
    >
      <AdminNavbar user={simplifiedUser} />
      <main
        style={{
          flexGrow: 1,
          padding: "24px",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}
