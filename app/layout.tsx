import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// Components
import NavBar from "../src/components/Navigation/NavBar";

// Metadata for the website
export const metadata: Metadata = {
  title: "The Experimental Mechanics Challenge",
  description: "A website for interacting with, viewing, and managing of BEAR prints",
  keywords: "3d printing, BEAR, leaderboard, Boston University, BU",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // URL for the bug report form
  const bugReportFormURL = "https://forms.gle/9ghqYdbbX6YFXMJo8";

  // BU Font - Whitney
  const font = "Whitney SemiBold, sans-serif";

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <ClerkProvider>
          <NavBar bugReportFormURL={bugReportFormURL} font={font} />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
