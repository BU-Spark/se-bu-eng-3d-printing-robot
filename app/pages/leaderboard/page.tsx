"use client"; // Make it a Client Component

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface LeaderboardEntry {
  Request_ID: number;
  Toughness: number;
  RecordedMass: number;
  ratio: number;
}

export default function Leaderboard() {
  const [page, setPage] = useState(1); // Track the current page
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    [],
  ); // Store fetched data
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [isGoingBack, setIsGoingBack] = useState(false); // Track if we're going back
  const [searchQuery, setSearchQuery] = useState(""); // Track search query

  // Fetch data when the page changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/leaderboard?page=${page}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const newData = await response.json();
        console.log("Fetched data:", newData); // Log the fetched data

        if (isGoingBack) {
          // Replace the existing data with new data when going back
          setLeaderboardData(newData);
        } else {
          // Append new data only if it's not already in the state
          setLeaderboardData((prevData) => {
            const existingIds = new Set(
              prevData.map((entry) => entry.Request_ID),
            );
            const filteredNewData = newData.filter(
              (entry: LeaderboardEntry) => !existingIds.has(entry.Request_ID),
            );
            return [...prevData, ...filteredNewData];
          });
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setIsLoading(false);
        setIsGoingBack(false); // Reset the going back state
      }
    };

    fetchData();
  }, [page, isGoingBack]);

  // Filter data based on search query
  const filteredData = leaderboardData.filter((entry) =>
    entry.Request_ID.toString().includes(searchQuery),
  );

  // Map data to the UI structure
  const mappedData = filteredData.map((entry) => ({
    id: entry.Request_ID,
    dateTime: new Date().toLocaleString(), // Placeholder for date/time
    user: `User ${entry.Request_ID}`, // Placeholder for user
    value: (Number(entry.ratio) || 0).toFixed(4), // Use 0 as a fallback if ratio is null/undefined
  }));

  return (
    <Box sx={{ p: 3, maxWidth: "1000px", mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Leaderboard
      </Typography>

      {/* Search Row */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search by Experiment ID"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: "250px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Leaderboard Table */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Date & Time</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Toughness / Mass</TableCell>
              <TableCell>Exp. ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mappedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.dateTime}</TableCell>
                <TableCell>{row.user}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{row.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          sx={{ borderRadius: 2 }}
          disabled={page === 1}
          onClick={() => {
            setIsGoingBack(true);
            setPage((prev) => 1);
          }}
        >
          Hide Extra Entries
        </Button>

        <Typography variant="body2">Page {page}</Typography>

        <Button
          variant="outlined"
          color="secondary"
          sx={{ borderRadius: 2 }}
          disabled={isLoading}
          onClick={() => setPage((prev) => prev + 1)}
        >
          {isLoading ? "Loading..." : "Show More"}
        </Button>
      </Box>
    </Box>
  );
}
