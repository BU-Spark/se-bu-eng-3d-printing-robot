"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Material UI components
import {
  TextField,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Snackbar,
  Avatar,
  Stack,
  Chip,
  Alert,
  alpha,
} from "@mui/material";

// Material UI icons
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

// Function to determine affiliation from email domain
function getAffiliationFromEmail(email: string | undefined): string {
  if (!email) return "";

  const domain = email.split("@")[1];
  if (!domain) return "";

  // Map of common educational domains to institution names
  const domainMap: Record<string, string> = {
    "bu.edu": "Boston University",
    "harvard.edu": "Harvard University",
    "mit.edu": "Massachusetts Institute of Technology",
    "stanford.edu": "Stanford University",
    "berkeley.edu": "UC Berkeley",
    "columbia.edu": "Columbia University",
    "yale.edu": "Yale University",
    "cornell.edu": "Cornell University",
    "princeton.edu": "Princeton University",
    // Add more mappings as needed
  };

  return domainMap[domain] || "No Affiliation Detected";
}

export default function InfoTab({ user, session }: any) {
  const [affiliation, setAffiliation] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const suggestedAffiliation = getAffiliationFromEmail(
        user.primaryEmailAddress.emailAddress,
      );
      setAffiliation(suggestedAffiliation);
    }
  }, [user]);

  // If user is not signed in, display a message
  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          width: "100%",
        }}
      >
        <Typography variant="h6">
          Please sign in to view your account.
        </Typography>
      </Box>
    );
  }

  // Copy session ID to clipboard
  const copySessionId = () => {
    if (session?.id) {
      navigator.clipboard.writeText(session.id);
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%" }}
      >
        {/* User Profile Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 3,
            borderRadius: 3,
            background: alpha("#CC0000", 0.03),
            border: `1px solid ${alpha("#CC0000", 0.1)}`,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 3,
          }}
        >
          <Avatar
            src={user.imageUrl}
            alt={user.fullName || "User"}
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100 },
              border: `2px solid ${alpha("#CC0000", 0.2)}`,
            }}
          />

          <Box sx={{ flex: 1, width: "100%" }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {user.fullName || "User"}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
            >
              <Chip
                icon={<VerifiedUserIcon fontSize="small" />}
                label="Verified Account"
                size="small"
                variant="outlined"
                sx={{
                  color: "#CC0000",
                  borderColor: "#CC0000",
                  "& .MuiChip-icon": {
                    color: "#CC0000",
                  },
                }}
              />
              {affiliation && (
                <Chip
                  icon={<SchoolOutlinedIcon fontSize="small" />}
                  label={affiliation}
                  size="small"
                  variant="outlined"
                  sx={{
                    color: "#CC0000",
                    borderColor: "#CC0000",
                    "& .MuiChip-icon": {
                      color: "#CC0000",
                    },
                  }}
                />
              )}
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {user.primaryEmailAddress?.emailAddress || "No email available"}
            </Typography>
          </Box>
        </Paper>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ width: "100%" }}
      >
        {/* Account Details */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <Typography variant="h6" fontWeight={500} sx={{ mb: 3, pl: 1 }}>
            Account Details
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Full Name"
              variant="outlined"
              value={user.fullName || ""}
              fullWidth
              disabled
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />

            <TextField
              label="Email Address"
              variant="outlined"
              value={user.primaryEmailAddress?.emailAddress || ""}
              fullWidth
              disabled
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />

            <TextField
              label="Institution Affiliation"
              variant="outlined"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder="Enter your affiliation"
              fullWidth
              disabled={
                affiliation !== "" &&
                affiliation !==
                  user.primaryEmailAddress?.emailAddress?.split("@")[1]
              }
              helperText={
                affiliation &&
                affiliation !==
                  user.primaryEmailAddress?.emailAddress?.split("@")[1]
                  ? "Affiliation detected from your email domain"
                  : ""
              }
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />
          </Stack>
        </Paper>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ width: "100%" }}
      >
        {/* Session Info */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <Box
            sx={{
              p: 2,
              backgroundColor: alpha("#CC0000", 0.03),
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            }}
          >
            <Typography variant="h6" fontWeight={500}>
              Session Information
            </Typography>
          </Box>

          <List sx={{ p: 0 }}>
            <ListItem
              sx={{
                py: 2,
                px: 3,
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: alpha("#CC0000", 0.03),
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight={500}>
                    Session ID
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {session?.id
                      ? `${session.id.substring(0, 12)}...`
                      : "Not available"}
                  </Typography>
                }
              />
              <Tooltip title="Copy to clipboard">
                <IconButton
                  edge="end"
                  aria-label="copy"
                  onClick={copySessionId}
                  sx={{
                    color: "#CC0000",
                    "&:hover": {
                      backgroundColor: alpha("#CC0000", 0.1),
                    },
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </ListItem>

            <Divider />

            <ListItem
              sx={{
                py: 2,
                px: 3,
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: alpha("#CC0000", 0.03),
                },
              }}
            >
              <AccessTimeIcon
                sx={{
                  mr: 2,
                  color: alpha("#CC0000", 0.7),
                }}
              />
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight={500}>
                    Last Active
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {session?.lastActiveAt
                      ? new Date(session.lastActiveAt).toLocaleString()
                      : "Not available"}
                  </Typography>
                }
              />
            </ListItem>

            <Divider />

            <ListItem
              sx={{
                py: 2,
                px: 3,
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: alpha("#CC0000", 0.03),
                },
              }}
            >
              <EventAvailableIcon
                sx={{
                  mr: 2,
                  color: alpha("#CC0000", 0.7),
                }}
              />
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight={500}>
                    Session Expires
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {session?.expireAt
                      ? new Date(session.expireAt).toLocaleString()
                      : "Not available"}
                  </Typography>
                }
              />
              <Tooltip title="When your current login session will end">
                <IconButton
                  edge="end"
                  size="small"
                  sx={{
                    color: "#CC0000",
                    "&:hover": {
                      backgroundColor: alpha("#CC0000", 0.1),
                    },
                  }}
                >
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ListItem>
          </List>

          <Alert
            severity="info"
            sx={{
              m: 2,
              mt: 0,
              borderRadius: 2,
              backgroundColor: alpha("#CC0000", 0.08),
              "& .MuiAlert-icon": {
                color: "#CC0000",
              },
            }}
          >
            Your session information is used to keep you logged in securely
            across the platform.
          </Alert>
        </Paper>
      </motion.div>

      {/* Snackbar for copy notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Session ID copied to clipboard"
        sx={{
          "& .MuiSnackbarContent-root": {
            borderRadius: 2,
          },
        }}
      />
    </Box>
  );
}
