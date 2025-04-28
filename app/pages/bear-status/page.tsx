"use client";

import { useState, useEffect } from "react";

// Material UI Components
import {
  Box, Typography, Paper,
  CircularProgress, Fade, Chip,
  Container,
} from "@mui/material";

// Animation Library
import { motion } from "framer-motion";

/**
 * BearStatusPage Component
 * 
 * Displays the current status and metrics of the BEAR system.
 * 
 * Features include:
 * - Real-time system status visualization
 * - Queue and performance metrics
 * - Animated background video
 * - Responsive layout with smooth transitions
 * 
 * @returns {JSX.Element} The BEAR system status dashboard
 */
export default function BearStatusPage() {
  // System running status
  const [isRunning, _setIsRunning] = useState(true);
  // Number of jobs in queue
  const [jobsInQueue, _setJobsInQueue] = useState(8);
  // Average completion time in minutes
  const [avgCompletionTime, _setAvgCompletionTime] = useState(75);
  // Simulate fetching data from an API
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Video URL for background
  const videoUrl =
    "https://player.vimeo.com/video/881771846?h=62ed69bec91&autoplay=1&loop=1&title=0&background=1&autopause=0";

  // Simulate video loading with timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      sx={{
        width: "100%",
        background: "linear-gradient(135deg, #f8f8f8 0%, #e0e0e0 100%)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Video Background with Overlay */}
      {isRunning && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(249, 228, 228, 0.9) 0%, rgba(224,224,224,0.9) 100%)",
              zIndex: 1,
            },
          }}
        >
          {!isVideoLoaded && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f8f8f8",
                zIndex: 2,
              }}
            >
              <CircularProgress sx={{ color: "#CC0000" }} />
            </Box>
          )}

          <Fade in={isVideoLoaded} timeout={1000}>
            <iframe
              src={videoUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="BEAR Process Visualization"
              onLoad={() => setIsVideoLoaded(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                minWidth: "100%",
                minHeight: "100%",
              }}
            />
          </Fade>
        </Box>
      )}

      <Box
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          pt: 4,
          pb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "8px",
              bgcolor: "#CC0000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(204, 0, 0, 0.3)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              B
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
            BEAR{" "}
            <span
              style={{ fontWeight: "normal", fontSize: "0.8em", color: "#666" }}
            >
              Status
            </span>
          </Typography>
        </Box>
      </Box>

      {/* Content section */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, py: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: "center",
          }}
        >
          {/* Status Cards Row */}
          <Box
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              width: "100%",
            }}
          >
            {/* Running Status Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                flex: 1,
                borderRadius: 3,
                overflow: "hidden",
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.8)",
                boxShadow: "0 8px 24px 0 rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    mb: 1,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  System Status
                </Typography>
                <Chip
                  label={isRunning ? "Running" : "Not Running"}
                  sx={{
                    fontSize: "0.95rem",
                    py: 2.5,
                    px: 1,
                    fontWeight: "600",
                    bgcolor: isRunning ? "#CC0000" : "#999",
                    color: "white",
                    "& .MuiChip-label": { px: 2 },
                  }}
                />
              </Box>
            </Paper>

            {/* Queue Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                flex: 1,
                borderRadius: 3,
                overflow: "hidden",
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.8)",
                boxShadow: "0 8px 24px 0 rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  mb: 1,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Queue Status
              </Typography>

              <Box sx={{ display: "flex", alignItems: "baseline", mb: 2 }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: "bold", color: "#333", mr: 1 }}
                >
                  {jobsInQueue}
                </Typography>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  jobs
                </Typography>
              </Box>
            </Paper>

            {/* Time Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                flex: 1,
                borderRadius: 3,
                overflow: "hidden",
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.8)",
                boxShadow: "0 8px 24px 0 rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  mb: 1,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Average Completion
              </Typography>

              <Box sx={{ display: "flex", alignItems: "baseline", mb: 2 }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: "bold", color: "#333", mr: 1 }}
                >
                  {avgCompletionTime}
                </Typography>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  minutes
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Status Message Card */}
          <Paper
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            elevation={0}
            sx={{
              p: 3,
              width: "100%",
              borderRadius: 3,
              overflow: "hidden",
              backdropFilter: "blur(10px)",
              background: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 8px 24px 0 rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: isRunning
                  ? "rgba(204, 0, 0, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#CC0000",
                fontWeight: "bold",
              }}
            >
              i
            </Box>
            <Typography variant="body1" sx={{ color: "#333" }}>
              The BEAR system is actively processing jobs with an estimated
              completion time of {avgCompletionTime} minutes per job.
              {jobsInQueue > 5
                ? " The queue is currently experiencing high volume."
                : " The queue is operating at normal capacity."}
            </Typography>
          </Paper>

          {/* Information Card */}
          <Paper
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            elevation={0}
            sx={{
              p: 4,
              width: "100%",
              borderRadius: 3,
              overflow: "hidden",
              backdropFilter: "blur(10px)",
              background: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 8px 24px 0 rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 4,
                  bgcolor: "#CC0000",
                  borderRadius: 1,
                }}
              />
              <Typography variant="h6" sx={{ color: "#333", fontWeight: 600 }}>
                System Information
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: "#444", lineHeight: 1.7 }}>
              The Bayesian Experimental Autonomous Researcher (BEAR) is an
              advanced autonomous system designed to perform mechanical
              experiments without human intervention. The system executes a
              complete experimental workflow by 3D printing structural designs,
              extracting them from the printer, conducting precise weight
              measurements, subjecting designs to controlled compression testing
              via hydraulic press, and systematically recording comprehensive
              data for subsequent analysis. This autonomous research platform
              employs Bayesian optimization algorithms to efficiently explore
              complex parameter spaces and identify optimal structural designs
              based on mechanical properties.
            </Typography>
          </Paper>

          {/* Footer */}
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              pt: 2,
              pb: 4,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "#666", fontSize: "0.8rem" }}
            >
              BEAR System • Last updated: {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
