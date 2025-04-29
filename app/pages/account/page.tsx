"use client";

// Import hooks for authentication and session management
import { useUser, useSession } from "@clerk/nextjs";
import { useState, useEffect } from "react";

// Import animation utilities for transitions
import { motion, AnimatePresence } from "framer-motion";

// Material UI components
import { 
  Box, Tabs, Tab, 
  Typography, useMediaQuery, useTheme, 
  Paper, Container, Skeleton
} from "@mui/material";

// Material UI icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Tab Components
import InfoTab from "@/app/components/Account/InfoTab";
import StatusTab from "@/app/components/Account/StatusTab";
import NewExpTab from "@/app/components/Account/NewExpTab";

/**
 * TabPanel Component
 * 
 * A wrapper component for tab content that:
 * - Only renders when active
 * - Provides smooth animations when switching tabs
 * - Handles accessibility attributes
 * 
 * @param {TabPanelProps} props - Component props
 * @param {React.ReactNode} props.children - Content to display in the panel
 * @param {number} props.index - Index of this tab panel
 * @param {number} props.value - Currently selected tab index
 */
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <AnimatePresence mode="wait">
      {value === index && (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          role="tabpanel"
          id={`account-tabpanel-${index}`}
          aria-labelledby={`account-tab-${index}`}
          style={{ width: "100%" }}
          {...other}
        >
          <Box
            sx={{
              pt: 4,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            {children}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * AccountPage Component
 * 
 * The main account dashboard that provides:
 * - User information display
 * - Experiment status tracking
 * - New experiment creation
 * 
 * Features:
 * - Responsive design for all screen sizes
 * - Loading states with skeleton placeholders
 * - Authentication checks
 * - Animated tab transitions
 */
export default function AccountPage() {
  // Clerk hooks for user and session data
  const { user, isLoaded: userLoaded } = useUser();
  const { session } = useSession();

  // State for tab selection and loading state
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Theme and responsive breakpoints for mobile detection
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Simulate a loading state until user data is loaded
  useEffect(() => {
    if (userLoaded) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [userLoaded]);

  // Handle tab changes
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Display skeleton loader while loading user data
  if (isLoading) {
    return (
      <Container
        maxWidth={false}
        sx={{
          py: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            width: "100%",
            maxWidth: "1200px",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              mb: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Skeleton variant="text" width="180px" height={40} />
            <Box sx={{ display: "flex", mt: 2 }}>
              <Skeleton
                variant="rounded"
                width={100}
                height={36}
                sx={{ mr: 2 }}
              />
              <Skeleton
                variant="rounded"
                width={100}
                height={36}
                sx={{ mr: 2 }}
              />
              <Skeleton variant="rounded" width={100} height={36} />
            </Box>
          </Box>
          <Skeleton variant="rounded" height={400} />
        </Paper>
      </Container>
    );
  }

  // If user is not signed in, show a message prompting to sign in
  if (!user) {
    return (
      <Container
        maxWidth={false}
        sx={{
          py: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "100%",
            maxWidth: "1200px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              width: "100%",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={500}
              color="text.primary"
              gutterBottom
            >
              Account Access Required
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please sign in to view and manage your account information.
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  // Main account page content
  return (
    <Container
      maxWidth={false}
      sx={{
        py: { xs: 4, md: 6 },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "100%" }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box sx={{ 
            px: { xs: 2, md: 4 }, 
            pt: { xs: 3, md: 4 }, 
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <Typography 
              variant="h5" 
              fontWeight={600} 
              color="text.primary" 
              sx={{ mb: 3 }}
            >
              Your Account
            </Typography>

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
              scrollButtons={isMobile ? "auto" : false}
              textColor="primary"
              centered
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#CC0000",
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
                borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                width: "100%",
              }}
            >
              <Tab
                label={isMobile ? null : "Information"}
                icon={
                  isMobile ? (
                    <InfoOutlinedIcon />
                  ) : (
                    <InfoOutlinedIcon sx={{ mr: 1 }} />
                  )
                }
                iconPosition="start"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  color: tabValue === 0 ? "#CC0000" : "text.secondary",
                  "&.Mui-selected": {
                    color: "#CC0000",
                  },
                  minHeight: 48,
                }}
              />
              <Tab
                label={isMobile ? null : "Status"}
                icon={
                  isMobile ? (
                    <AssessmentOutlinedIcon />
                  ) : (
                    <AssessmentOutlinedIcon sx={{ mr: 1 }} />
                  )
                }
                iconPosition="start"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  color: tabValue === 1 ? "#CC0000" : "text.secondary",
                  "&.Mui-selected": {
                    color: "#CC0000",
                  },
                  minHeight: 48,
                }}
              />
              <Tab
                label={isMobile ? null : "New Experiment"}
                icon={
                  isMobile ? (
                    <AddCircleOutlineIcon />
                  ) : (
                    <AddCircleOutlineIcon sx={{ mr: 1 }} />
                  )
                }
                iconPosition="start"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  color: tabValue === 2 ? "#CC0000" : "text.secondary",
                  "&.Mui-selected": {
                    color: "#CC0000",
                  },
                  minHeight: 48,
                }}
              />
            </Tabs>
          </Box>

          <Box
            sx={{
              px: { xs: 2, md: 4 },
              pb: { xs: 3, md: 4 },
            }}
          >
            {/* Tab Panels */}
            <TabPanel value={tabValue} index={0}>
              <InfoTab user={user} session={session} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <StatusTab />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <NewExpTab />
            </TabPanel>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
}
