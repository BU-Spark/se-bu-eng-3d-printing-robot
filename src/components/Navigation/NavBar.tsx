import React from "react";
import Link from "next/link";

// Clerk components
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

// Material-UI components
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

// Material-UI icons
import BugReportIcon from "@mui/icons-material/BugReport";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Library from "@mui/icons-material/LocalLibrary";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import Leaderboard from "@mui/icons-material/Leaderboard";
import { CSSProperties } from "react";

// Clerk button styles
import './ClerkButtonStyles.css';

// Props for the NavBar component
interface NavBarProps {
  bugReportFormURL: string;
  font: string;
}

// Color scheme
const colorScheme = {
  primary: "#CC0000",
  secondary: "#FFFFFF",
  hover: "#E53935",
  white: "#FFFFFF",
  black: "#000000",
};

// STYLING
const appBarStyles: CSSProperties = {
  backgroundColor: colorScheme.primary,
  color: colorScheme.secondary,
  padding: 0,
  margin: 0,
  fontFamily: "Whitney SemiBold, sans-serif",
};

const ToolbarStyles: CSSProperties = {
  padding: 0,
  margin: 0,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const NavBar: React.FC<NavBarProps> = ({ bugReportFormURL, font }) => {
  // Button styles
  const buttonStyle: CSSProperties = {
    color: colorScheme.secondary,
    fontFamily: font,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  // Button hover styles
  const buttonHoverStyle: CSSProperties = {
    backgroundColor: colorScheme.hover,
    color: colorScheme.secondary,
  };

  return (
    <AppBar position="static" sx={appBarStyles}>
      <Toolbar sx={ToolbarStyles}>
        <Typography
          variant="h6"
          component="div"
          sx={{ ml: 2, fontFamily: font }}
        >
          The Experimental Mechanics Challenge
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Navigation buttons - Account */}
          <Button
            color="inherit"
            component={Link}
            href="/pages/account"
            sx={{
              ...buttonStyle,
              "&:hover": buttonHoverStyle,
              mr: 1,
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
              mr: 1,
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
              mr: 1,
            }}
          >
            <QueryStatsIcon />
            BEAR status
          </Button>
          {/* Navigation buttons - Leaderboard */}
          <Button
            color="inherit"
            component={Link}
            href="/pages/leaderboard"
            sx={{
              ...buttonStyle,
              "&:hover": buttonHoverStyle,
              mr: 1,
            }}
          >
            <Leaderboard />
            Leaderboards
          </Button>

          {/* Sign In, Sign Up, and Bug Report buttons */}
          <Box sx={{ ml: 2, display: "flex", gap: 1 }}>
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
