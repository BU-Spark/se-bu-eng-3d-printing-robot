"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  styled,
  alpha,
} from "@mui/material";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";

// Custom styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
  marginBottom: theme.spacing(4),
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-head": {
    fontWeight: 600,
    backgroundColor: alpha("#CC0000", 0.03),
    color: "#333",
  },
}));

const LogChip = styled(Chip)(({ theme }) => ({
  borderRadius: 16,
  fontWeight: 600,
  padding: "0 8px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}));

// Sample log data
const logEntries = [
  {
    id: 1,
    timestamp: "2025-04-10T08:23:45",
    level: "INFO",
    message: "User login successful",
    user: "john@example.com",
  },
  {
    id: 2,
    timestamp: "2025-04-10T08:24:12",
    level: "WARNING",
    message: "Failed login attempt",
    user: "unknown",
  },
  {
    id: 3,
    timestamp: "2025-04-10T09:15:22",
    level: "INFO",
    message: "New submission created",
    user: "jane@example.com",
  },
  {
    id: 4,
    timestamp: "2025-04-10T10:02:33",
    level: "ERROR",
    message: "Database connection error",
    user: "system",
  },
  {
    id: 5,
    timestamp: "2025-04-10T10:05:17",
    level: "INFO",
    message: "Database connection restored",
    user: "system",
  },
];

export default function SystemLogsPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Function to get chip color based on log level
  const getChipColor = (level: string) => {
    switch (level) {
      case "INFO":
        return "info";
      case "WARNING":
        return "warning";
      case "ERROR":
        return "error";
      default:
        return "default";
    }
  };

  // Get icon for log level
  const getLevelIcon = (level: string) => {
    switch (level) {
      case "INFO":
        return <InfoIcon fontSize="small" />;
      case "WARNING":
        return <WarningIcon fontSize="small" />;
      case "ERROR":
        return <ErrorIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  useEffect(() => {
    // Simulate loading and then set sample logs
    setTimeout(() => {
      setLogs(logEntries);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.level.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: "#CC0000",
            backgroundClip: "text",
            textFillColor: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          System Logs
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and analyze system activity logs.
        </Typography>
      </Box>

      {/* Info Alert */}
      <Alert
        severity="info"
        icon={<InfoOutlinedIcon sx={{ color: "#CC0000" }} />}
        sx={{
          mb: 4,
          borderRadius: 2,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
          "& .MuiAlert-message": { py: 1 },
          bgcolor: alpha("#CC0000", 0.1),
          color: "#660000",
        }}
      >
        <Typography variant="body2">
          This page displays system logs for monitoring purposes. Use the search
          to filter logs by message, user, or level.
        </Typography>
      </Alert>

      {/* Search and Filter Bar */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          placeholder="Search logs..."
          variant="outlined"
          size="medium"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            minWidth: { xs: "100%", sm: "300px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "background.paper",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              "& fieldset": {
                borderColor: "#CC0000",
              },
              "&:hover fieldset": {
                borderColor: "#CC0000",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#CC0000",
                borderWidth: "2px",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#CC0000" }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Filter">
            <IconButton
              sx={{
                backgroundColor: "background.paper",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                borderRadius: 2,
                p: 1.5,
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sort">
            <IconButton
              sx={{
                backgroundColor: "background.paper",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                borderRadius: 2,
                p: 1.5,
              }}
            >
              <SortIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Logs Table */}
      <StyledTableContainer as={Paper}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <CircularProgress color="error" size={40} />
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, color: "text.secondary" }}
                  >
                    Loading log data...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Box
                    sx={{
                      py: 4,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <InfoOutlinedIcon
                      sx={{ fontSize: 40, color: "text.disabled", mb: 1 }}
                    />
                    <Typography variant="body1">No logs found</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow
                  key={log.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    },
                    transition: "background-color 0.2s",
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatTimestamp(log.timestamp)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <LogChip
                      label={log.level}
                      color={getChipColor(log.level)}
                      size="small"
                      icon={getLevelIcon(log.level)}
                      sx={{ minWidth: 80 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{log.message}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PersonIcon
                        sx={{ color: "text.secondary", mr: 1, fontSize: 18 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {log.user}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Footer */}
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          Last updated: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}
