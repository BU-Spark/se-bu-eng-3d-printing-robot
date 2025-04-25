// app/pages/admin/layout.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminNavbar from "@/src/components/Admin/Navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) redirect("/");

  const adminEmails = [
    "sulafaj@bu.edu",
    "wfugate@bu.edu",
    "alanl193@bu.edu",
    "kalc@bu.edu",
  ];
  const userEmail = user.emailAddresses[0]?.emailAddress;

  if (!userEmail || !adminEmails.includes(userEmail)) redirect("/");

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
