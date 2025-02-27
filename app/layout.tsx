import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "The Experimental Mechanics Challenge",
  description:
    "A website for interacting with, viewing, and managing of BEAR prints",
  keywords: "3d printing, BEAR, leaderboard, Boston University, BU",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <header id="main-header">The Experimental Mechanics Challenge</header>
          <div id="nav-bar">
            <div id="sign-in">
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            <nav>
              <ul>
                <li>
                  <Link href="/pages/account">Account</Link>
                </li>
                <li>
                  <Link href="/pages/library">Library</Link>
                </li>
                <li>
                  <Link href="/pages/bear-status">BEAR status</Link>
                </li>
                <li>
                  <Link href="/pages/leaderboard">Leaderboards</Link>
                </li>
              </ul>
            </nav>
          </div>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
