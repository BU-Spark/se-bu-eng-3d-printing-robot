"use client";
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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface LeaderboardEntry {
  Request_ID: number;
  Toughness: number | null;
  RecordedMass: number | null;
  CriticalStress: number | null;
  TargetHeight: number | null;
  ratio: number | null;
}

const sortOptions = [
  { value: "ratio", label: "Toughness/Mass" },
  { value: "Toughness", label: "Toughness" },
  { value: "RecordedMass", label: "Recorded Mass" },
  { value: "CriticalStress", label: "Critical Stress" },
  { value: "TargetHeight", label: "Target Height" },
  { value: "Request_ID", label: "Experiment ID" },
];

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPageToFetch, setNextPageToFetch] = useState(1);
  const [experimentIdSearch, setExperimentIdSearch] = useState("");
  const [sortBy, setSortBy] = useState("ratio");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showingMore, setShowingMore] = useState(false);
  const [appliedSearch, setAppliedSearch] = useState("");

  // Combined fetchData function
  const fetchData = async (
    resetData: boolean = false,
    explicitValues?: {
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      search?: string;
    }
  ) => {
    setIsLoading(true);
    try {
      const pageToFetch = resetData ? 1 : nextPageToFetch;
      
      const queryParams = new URLSearchParams({
        page: pageToFetch.toString(),
        pageSize: resetData ? '20' : '10',
        sortBy: explicitValues?.sortBy || sortBy,
        sortOrder: explicitValues?.sortOrder || sortOrder,
      });

      const searchTerm = explicitValues?.search !== undefined 
        ? explicitValues.search 
        : appliedSearch;
      if (searchTerm) {
        queryParams.append("experimentId", searchTerm);
      }

      const response = await fetch(`/api/leaderboard?${queryParams}`);
      
      if (!response.ok) throw new Error("Failed to fetch data");
      
      const newData: LeaderboardEntry[] = await response.json();
      
      if (resetData) {
        setLeaderboardData(newData);
        setNextPageToFetch(3); // Your working pagination logic
      } else {
        setLeaderboardData(prev => {
          const existingIds = new Set(prev.map(entry => entry.Request_ID));
          return [...prev, ...newData.filter(entry => !existingIds.has(entry.Request_ID))];
        });
        setNextPageToFetch(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Control handlers with immediate fetch and explicit values
  const handleSearch = () => {
    const searchTerm = experimentIdSearch.trim();
    setAppliedSearch(searchTerm);
    fetchData(true, { search: searchTerm });
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
    fetchData(true, { sortBy: newSortBy });
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => {
      const newOrder = prev === "asc" ? "desc" : "asc";
      fetchData(true, { sortOrder: newOrder });
      return newOrder;
    });
  };

  // Your working pagination handlers
  const handleShowMore = () => {
    fetchData(false);
    setShowingMore(true);
  };

  const handleHideExtra = () => {
    fetchData(true);
    setShowingMore(false);
  };

  // Initial load with cleanup
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await fetchData(true);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatValue = (value: any): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return "-";
    }
    try {
      const numValue = Number(value);
      return numValue.toFixed(4);
    } catch (error) {
      console.error("Error formatting value:", value, error);
      return "-";
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: "1200px", mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Leaderboard
      </Typography>

      <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <TextField
          placeholder="Search by Experiment ID"
          variant="outlined"
          size="small"
          value={experimentIdSearch}
          onChange={(e) => setExperimentIdSearch(e.target.value)}
          sx={{ flexGrow: 1, minWidth: "250px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search ID"}
        </Button>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} label="Sort By" onChange={handleSortChange}>
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
          <IconButton onClick={toggleSortOrder} color="primary">
            {sortOrder === 'asc' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Experiment ID</TableCell>
              <TableCell>Toughness</TableCell>
              <TableCell>Mass</TableCell>
              <TableCell>Toughness/Mass</TableCell>
              <TableCell>Critical Stress</TableCell>
              <TableCell>Target Height</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && leaderboardData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : leaderboardData.length > 0 ? (
              leaderboardData.map((entry: LeaderboardEntry) => (
                <TableRow key={entry.Request_ID}>
                  <TableCell>{entry.Request_ID}</TableCell>
                  <TableCell>{formatValue(entry.Toughness)}</TableCell>
                  <TableCell>{formatValue(entry.RecordedMass)}</TableCell>
                  <TableCell>{formatValue(entry.ratio)}</TableCell>
                  <TableCell>{formatValue(entry.CriticalStress)}</TableCell>
                  <TableCell>{formatValue(entry.TargetHeight)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ borderRadius: 2 }}
          disabled={!showingMore || isLoading}
          onClick={handleHideExtra}
        >
          Hide Extra Entries
        </Button>

        <Typography variant="body2">
          Showing {leaderboardData.length} entries
          {appliedSearch && ` filtered by ID: ${appliedSearch}`}
        </Typography>

        <Button
          variant="outlined"
          color="secondary"
          sx={{ borderRadius: 2 }}
          disabled={isLoading || leaderboardData.length === 0}
          onClick={handleShowMore}
        >
          {isLoading ? "Loading..." : "Show 10 More"}
        </Button>
      </Box>
    </Box>
  );
}