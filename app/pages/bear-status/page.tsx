"use client";

import { useState, useEffect } from "react";

// Material UI Components
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Fade,
} from "@mui/material";

// Animation Library
import { motion } from "framer-motion";

// Types for the API response
interface BearStatusRecord {
  RequestID: number;
  Status: number;
}

interface BearTestResult {
  RequestID: number; // From bear_inprogress
  Status: number; // Printable status from bear_inprogress (-2 = unprintable, 1 = printable)
  Toughness: string | number | null; // Decimal type from bear_tests (null if no test data)
  RecordedMass: string | number | null; // Decimal type from bear_tests (null if no test data)
  CriticalStress: string | number | null; // Decimal type from bear_tests (null if no test data)
  TargetHeight: string | number | null; // Decimal type from bear_tests (null if no test data)
  TimePrintStarted: string | number | null; // Decimal type from bear_tests (null if no test data)
  TimeInstronCrushed: string | number | null; // Decimal type from bear_tests (null if no test data)
}

interface BearStatusData {
  current: BearStatusRecord;
  previous: BearTestResult[];
  hasMore: boolean;
}

/**
 * BearStatusPage Component
 *
 * Displays the current status from the bear_inprogress table.
 *
 * Features include:
 * - Current request status display
 * - Status interpretation (-2 = unprintable, 1 = printable)
 * - Previous 5 requests history table with detailed test results
 * - Clean, focused interface with robot video background
 *
 * @returns {JSX.Element} The BEAR system status dashboard
 */
export default function BearStatusPage() {
  const [statusData, setStatusData] = useState<BearStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [allPreviousResults, setAllPreviousResults] = useState<
    BearTestResult[]
  >([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Video URL for background
  const videoUrl =
    "https://player.vimeo.com/video/881771846?h=62ed69bec91&autoplay=1&loop=1&title=0&background=1&autopause=0";

  // Fetch bear status data from API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bear-status?page=1&limit=10`);
        if (!response.ok) {
          throw new Error("Failed to fetch status data");
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        console.log("Sample previous result:", data.previous[0]);
        setStatusData({
          current: data.current,
          previous: data.previous,
          hasMore: data.hasMore,
        });
        setAllPreviousResults(data.previous);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Refresh current status every 30 seconds 
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/bear-status?page=1&limit=1`);
        if (response.ok) {
          const data = await response.json();
          setStatusData((prev) =>
            prev ? { ...prev, current: data.current } : null,
          );
        }
      } catch (err) {
        console.error("Error refreshing current status:", err);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load more data for infinite scroll
  const loadMoreData = async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await fetch(
        `/api/bear-status?page=${nextPage}&limit=10`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch more data");
      }

      const data = await response.json();

      // Append new results to existing ones
      const updatedResults = [...allPreviousResults, ...data.previous];
      setAllPreviousResults(updatedResults);
      setStatusData((prev) =>
        prev
          ? {
              ...prev,
              previous: updatedResults,
              hasMore: data.hasMore,
            }
          : null,
      );
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error("Error loading more data:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Simulate video loading with timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Helper function to get status display text and color
  const getStatusInfo = (status: number) => {
    switch (status) {
      case -2:
        return { text: "Unprintable", color: "#d32f2f" };
      case 1:
        return { text: "Printable", color: "#2e7d32" };
      default:
        return { text: `Status ${status}`, color: "#666" };
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8f8f8 0%, #e0e0e0 100%)",
        }}
      >
        <CircularProgress sx={{ color: "#CC0000" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8f8f8 0%, #e0e0e0 100%)",
        }}
      >
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            Error Loading Status
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {error}
          </Typography>
        </Paper>
      </Box>
    );
  }

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

      {/* Header */}
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
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 2, py: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: "center",
          }}
        >
          {/* Current Status Card */}
          {statusData && (
            <Paper
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              elevation={0}
              sx={{
                p: 4,
                width: "100%",
                borderRadius: 3,
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.8)",
                boxShadow: "0 8px 24px 0 rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#333",
                  mb: 3,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Current Request Status
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      mb: 1,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    Request ID
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    {statusData.current.RequestID}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: { xs: "center", sm: "right" } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      mb: 1,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    Status
                  </Typography>
                  <Chip
                    label={getStatusInfo(statusData.current.Status).text}
                    sx={{
                      fontSize: "1.1rem",
                      py: 3,
                      px: 2,
                      fontWeight: "600",
                      bgcolor: getStatusInfo(statusData.current.Status).color,
                      color: "white",
                      "& .MuiChip-label": { px: 2 },
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          )}

          {/* Previous Test Results Table */}
          {statusData && allPreviousResults.length > 0 && (
            <Paper
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              elevation={0}
              sx={{
                width: "100%",
                borderRadius: 3,
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.8)",
                boxShadow: "0 8px 24px 0 rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                overflow: "hidden",
              }}
            >
              <Box sx={{ p: 3, pb: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#333",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Previous Test Results
                </Typography>
              </Box>

              <Box
                sx={{
                  maxHeight: 400,
                  overflowY: "auto",
                  overflowX: "hidden",
                  border: "1px solid rgba(224, 224, 224, 0.3)",
                  borderRadius: "8px",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                onScroll={(e) => {
                  const { scrollTop, scrollHeight, clientHeight } =
                    e.currentTarget;
                  // Load more when scrolled to within 50px of bottom
                  if (scrollHeight - scrollTop - clientHeight < 50) {
                    loadMoreData();
                  }
                }}
              >
                <Table size="small" stickyHeader sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#666",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          fontSize: "0.7rem",
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(10px)",
                          py: 2,
                        }}
                      >
                        Request ID
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#666",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          fontSize: "0.7rem",
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(10px)",
                          py: 2,
                        }}
                      >
                        Toughness
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#666",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          fontSize: "0.7rem",
                        }}
                      >
                        Mass (g)
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#666",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          fontSize: "0.7rem",
                        }}
                      >
                        Critical Stress
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#666",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          fontSize: "0.7rem",
                        }}
                      >
                        Printable
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allPreviousResults.map((result, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          height: 60,
                          "&:hover": {
                            backgroundColor: "rgba(204, 0, 0, 0.04)",
                          },
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, color: "#333" }}
                          >
                            {result.RequestID}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" sx={{ color: "#333" }}>
                            {result.Toughness !== null &&
                            result.Toughness !== undefined
                              ? Number(result.Toughness).toFixed(2)
                              : "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" sx={{ color: "#333" }}>
                            {result.RecordedMass !== null &&
                            result.RecordedMass !== undefined
                              ? Number(result.RecordedMass).toFixed(2)
                              : "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" sx={{ color: "#333" }}>
                            {result.CriticalStress !== null &&
                            result.CriticalStress !== undefined
                              ? Number(result.CriticalStress).toFixed(2)
                              : "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Chip
                            label={getStatusInfo(result.Status).text}
                            size="small"
                            sx={{
                              bgcolor: getStatusInfo(result.Status).color,
                              color: "white",
                              fontWeight: 500,
                              fontSize: "0.7rem",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              {/* Loading indicator for infinite scroll */}
              {loadingMore && (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress size={20} sx={{ color: "#CC0000" }} />
                  <Typography variant="body2" sx={{ ml: 1, color: "#666" }}>
                    Loading more...
                  </Typography>
                </Box>
              )}

              {/* End of data indicator */}
              {!hasMore && allPreviousResults.length > 5 && (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", fontStyle: "italic" }}
                  >
                    No more results
                  </Typography>
                </Box>
              )}
            </Paper>
          )}

          {/* Footer */}
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              pt: 2,
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
