"use client";

import React from "react";
import Link from "next/link";
import { CSSProperties } from "react";

// Clerk authentication components
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

// Material-UI components
import { 
  AppBar, Toolbar, Button, Box 
} from "@mui/material";

// Material-UI icons
import BugReportIcon from "@mui/icons-material/BugReport";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Library from "@mui/icons-material/LocalLibrary";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import Leaderboard from "@mui/icons-material/Leaderboard";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

// Clerk button styles
import "./ClerkButtonStyles.css";

/**
 * Props for the NavBar component
 * @interface NavBarProps
 * @property {string} bugReportFormURL - URL for the bug report form
 * @property {string} font - Font family to use for text
 */
interface NavBarProps {
  bugReportFormURL: string;
  font: string;
}

/**
 * Color scheme for the navigation bar
 * @constant
 */
const colorScheme = {
  primary: "#CC0000",
  secondary: "#FFFFFF",
  hover: "#E53935",
  white: "#FFFFFF",
  black: "#000000",
};

/**
 * NavBar Component
 * 
 * A responsive navigation bar with:
 * - Authentication controls (login/register/user profile)
 * - Main navigation links
 * - Admin-specific links for authorized users
 * - Bug reporting functionality
 * - Responsive design for all screen sizes
 * 
 * @param {NavBarProps} props - Component props
 * @returns {React.ReactElement} The navigation bar component
 */
const NavBar: React.FC<NavBarProps> = ({ bugReportFormURL, font }) => {
  const { user } = useUser();

  // List of admin email addresses
  const adminEmails = [
    "sulafaj@bu.edu",
    "wfugate@bu.edu",
    "alanl193@bu.edu",
    "kalc@bu.edu",
  ];

  /**
   * Check if current user is an admin
   * @type {boolean}
   */
  const isAdmin =
    user &&
    user.primaryEmailAddress?.emailAddress &&
    adminEmails.includes(user.primaryEmailAddress.emailAddress);

  /**
   * Styles for the AppBar component
   * @type {CSSProperties}
   */
  const appBarStyles: CSSProperties = {
    backgroundColor: colorScheme.primary,
    color: colorScheme.secondary,
    padding: 0,
    margin: 0,
    fontFamily: "Whitney SemiBold, sans-serif",
  };

  /**
   * Base styles for navigation buttons
   * @type {CSSProperties}
   */
  const buttonStyle: CSSProperties = {
    color: colorScheme.secondary,
    fontFamily: font,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  /**
   * Hover styles for navigation buttons
   * @type {CSSProperties}
   */
  const buttonHoverStyle: CSSProperties = {
    backgroundColor: colorScheme.hover,
    color: colorScheme.secondary,
  };

  return (
    <AppBar position="fixed" sx={appBarStyles}>
      <Toolbar
        sx={{
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: { xs: 1, md: 0 },
          py: { xs: 1, md: 0 },
        }}
      >
        {/* Logo and title */}
        <Button
          component={Link}
          href="/"
          sx={{
            ml: { xs: 0, md: 2 },
            fontFamily: font,
            textAlign: { xs: "center", md: "left" },
            mb: { xs: 0, md: 0 },
            color: colorScheme.secondary,
            textTransform: "none",
            fontSize: "1.25rem",
            "&:hover": {
              backgroundColor: "transparent", 
              textDecoration: "none", 
            },
          }}
        >
          The Experimental Mechanics Challenge
        </Button>
        
        {/* Navigation buttons wrapper */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row", 
            width: { xs: "100%", md: "auto" },
            justifyContent: { xs: "center", md: "flex-end" },
          }}
        >
          {/* Main Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              justifyContent: { xs: "flex-start", md: "flex-start" },
              minWidth: { xs: "max-content", md: "auto" }, 
            }}
          >
            {/* For Signed In Users */}
            <SignedIn>
              {/* Navigation buttons - Account */}
              <Button
                color="inherit"
                component={Link}
                href="/pages/account"
                sx={{
                  ...buttonStyle,
                  "&:hover": buttonHoverStyle,
                  mr: { xs: 1, md: 1 },
                  fontSize: { xs: "0.75rem", md: "0.8rem" }, 
                }}
              >
                <AccountCircle />
                Account
              </Button>
              {/* Navigation buttons - Library */}
              <Button
                color="inherit"
                component={Link}
                href="/pages/library"
                sx={{
                  ...buttonStyle,
                  "&:hover": buttonHoverStyle,
                  mr: { xs: 1, md: 1 },
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                }}
              >
                <Library />
                Library
              </Button>
              {/* Navigation buttons - BEAR Status */}
              <Button
                color="inherit"
                component={Link}
                href="/pages/bear-status"
                sx={{
                  ...buttonStyle,
                  "&:hover": buttonHoverStyle,
                  mr: { xs: 1, md: 1 },
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                }}
              >
                <QueryStatsIcon />
                BEAR status
              </Button>

              {/* Admin button - Only visible to admins */}
              {isAdmin && (
                <Button
                  color="inherit"
                  component={Link}
                  href="/pages/admin"
                  sx={{
                    ...buttonStyle,
                    "&:hover": buttonHoverStyle,
                    mr: { xs: 1, md: 1 },
                    fontSize: { xs: "0.75rem", md: "0.8rem" },
                    backgroundColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  <AdminPanelSettingsIcon />
                  Admin
                </Button>
              )}
            </SignedIn>

            {/* Leaderboard button (always visible) */}
            <Button
              color="inherit"
              component={Link}
              href="/pages/leaderboard"
              sx={{
                ...buttonStyle,
                "&:hover": buttonHoverStyle,
                mr: { xs: 1, md: 1 },
                fontSize: { xs: "0.75rem", md: "0.8rem" },
              }}
            >
              <Leaderboard />
              Leaderboards
            </Button>
          </Box>

          {/* Sign In, Sign Up, and Bug Report buttons */}
          <Box
            sx={{
              ml: { xs: 0, md: 2 },
              mt: { xs: 0, md: 0 },
              display: "flex",
              gap: 0.5,
              justifyContent: "center",
              minWidth: "max-content",
            }}
          >
            <SignedOut>
              {/* Sign In button */}
              <SignInButton mode="modal">
                <button className="clerk-button" style={{ fontFamily: font }}>
                  Login
                </button>
              </SignInButton>

              {/* Sign Up button */}
              <SignUpButton mode="modal">
                <button className="clerk-button" style={{ fontFamily: font }}>
                  Register
                </button>
              </SignUpButton>
            </SignedOut>

            {/* User button */}
            <SignedIn>
              <UserButton />
            </SignedIn>

            {/* Bug Report button */}
            <Button
              color="inherit"
              component="a"
              href={bugReportFormURL}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: colorScheme.secondary,
                "&:hover": buttonHoverStyle,
                display: "flex",
                alignItems: "center",
                fontFamily: font,
              }}
            >
              <BugReportIcon />
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
