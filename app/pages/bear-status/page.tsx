"use client";

import { useState } from "react";

// Material-UI components
import { Box, Typography, Paper } from "@mui/material";

export default function BearStatusPage() {
  const [isRunning, _setIsRunning] = useState(true);
  const [jobsInQueue, _setJobsInQueue] = useState(8);
  const [avgCompletionTime, _setAvgCompletionTime] = useState(75);

  return (
    <Box sx={{ p: 4, maxWidth: "1200px", mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        BEAR Status
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 1 }}>
        <Typography variant="h5" sx={{ color: "#555", mb: 4 }}>
          The Bear is currently{" "}
          <Typography
            component="span"
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: isRunning ? "#2e7d32" : "#d32f2f",
            }}
          >
            {isRunning ? "Running" : "not running"}
          </Typography>
        </Typography>

        <Typography variant="h5" sx={{ color: "#555", mb: 4 }}>
          There are currently {jobsInQueue} jobs in the queue
        </Typography>

        <Typography variant="h5" sx={{ color: "#555" }}>
          The recent average time for a job to complete is {avgCompletionTime}{" "}
          min
        </Typography>
      </Paper>
    </Box>
  );
}
