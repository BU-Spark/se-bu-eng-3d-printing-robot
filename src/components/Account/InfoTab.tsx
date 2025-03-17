"use client";

import { CSSProperties, useState, useEffect } from "react";

// Material UI components
import { 
	TextField, Typography, Box, Avatar, Paper, List, 
	ListItem, ListItemText, Divider, IconButton, Grid2, 
  Tooltip, Snackbar
} from "@mui/material";

// Material UI icons
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

/**********************************************************************************/
// Styling
const containerStyle: CSSProperties = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	minHeight: "80vh",
	padding: "20px",
	width: "100%"
};
const textFieldStyle: CSSProperties = {
  width: "100%",
};
const sessionInfoStyle: CSSProperties = {
  width: "100%",
  maxWidth: "100vw",
  marginTop: "20px",
  padding: "16px",
};
/**********************************************************************************/

// Function to determine affiliation from email domain
function getAffiliationFromEmail(email: string | undefined): string {
	if (!email) return "";
	
	const domain = email.split('@')[1];
	if (!domain) return "";
	
	// Map of common educational domains to institution names
	const domainMap: Record<string, string> = {
		'bu.edu': 'Boston University',
		'harvard.edu': 'Harvard University',
		'mit.edu': 'Massachusetts Institute of Technology',
		'stanford.edu': 'Stanford University',
		'berkeley.edu': 'UC Berkeley',
		'columbia.edu': 'Columbia University',
		'yale.edu': 'Yale University',
		'cornell.edu': 'Cornell University',
		'princeton.edu': 'Princeton University',
		// Add more mappings as needed
	};
	
	return domainMap[domain] || domain;
}

export default function InfoTab({ user, session }: any) {
  const [affiliation, setAffiliation] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const suggestedAffiliation = getAffiliationFromEmail(user.primaryEmailAddress.emailAddress);
      setAffiliation(suggestedAffiliation);
    }
  }, [user]);

  // If user is not signed in, display a message
  if (!user) {
    return (
      <Box sx={containerStyle}>
        <Typography variant="h6">Please sign in to view your account.</Typography>
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
    <Grid2 container spacing={3} sx={{ maxWidth: '800px', justifyContent: 'center' }}>
      {/* User Name */}
      <TextField
        label="Name"
        variant="outlined"
        value={user.fullName || ""}
        fullWidth
        sx={{ mb: 2 }}
        disabled
      />
      
      {/* User Email */}
      <TextField
        label="Email"
        variant="outlined"
        value={user.primaryEmailAddress?.emailAddress || ""}
        fullWidth
        sx={{ mb: 2 }}
        disabled
      />

      {/* User Affiliation */}
      <TextField
        label="Affiliation"
        variant="outlined"
        value={affiliation}
        onChange={(e) => setAffiliation(e.target.value)}
        placeholder="Enter your affiliation"
        sx={textFieldStyle}
        disabled={affiliation !== "" && affiliation !== user.primaryEmailAddress?.emailAddress?.split('@')[1]}
        helperText={affiliation && affiliation !== user.primaryEmailAddress?.emailAddress?.split('@')[1] ? 
          "Affiliation detected from your email" : ""}
      />
      
      {/* Session Info */}
      <Paper elevation={2} sx={{ ...sessionInfoStyle, textAlign: 'center' }}>
					<Typography variant="h6" gutterBottom>
						Session Information
					</Typography>
					<List dense>
						<ListItem>
							<ListItemText 
								primary="Session ID" 
								secondary={session?.id ? `${session.id.substring(0, 12)}...` : "Not available"} 
							/>
							<Tooltip title="Copy to clipboard">
								<IconButton edge="end" aria-label="copy" onClick={copySessionId}>
									<ContentCopyIcon />
								</IconButton>
							</Tooltip>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText 
								primary="Last Active" 
								secondary={session?.lastActiveAt ? new Date(session.lastActiveAt).toLocaleString() : "Not available"} 
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText 
								primary="Expires" 
								secondary={session?.expireAt ? new Date(session.expireAt).toLocaleString() : "Not available"} 
							/>
							<Tooltip title="When your current login session will end">
								<IconButton edge="end" size="small">
									<Typography variant="caption">?</Typography>
								</IconButton>
							</Tooltip>
						</ListItem>
					</List>
				</Paper>

        {/* Snackbar for copy notification */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message="Session ID copied to clipboard"
        />
    </Grid2>
  );
}
