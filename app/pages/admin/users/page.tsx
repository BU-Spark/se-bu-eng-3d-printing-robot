"use client";

import { useState, useEffect } from "react";

// Material UI Components
import {
  Typography, Box, Paper,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  Button, TextField, InputAdornment,
  IconButton, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
  Alert, Snackbar, CircularProgress,
  Tabs, Tab, Card,
  CardContent, Avatar, Chip,
  styled, alpha, Tooltip,
} from "@mui/material";

// Material UI Icons
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import RestoreIcon from "@mui/icons-material/Restore";
import PersonIcon from "@mui/icons-material/Person";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useClerk } from "@clerk/nextjs";

/**
 * StyledTab - Custom styled Tab component
 */
const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: 600,
  "&.Mui-selected": {
    color: "#CC0000",
  },
}));

/**
 * StyledTabs - Custom styled Tabs component
 */
const StyledTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "#CC0000",
  },
});

/**
 * ActionButton - Custom styled Button component
 */
const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  borderRadius: 8,
  fontWeight: 600,
}));

/**
 * StyledTableHead - Custom styled TableHead component
 */
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-head": {
    fontWeight: 600,
    backgroundColor: alpha("#CC0000", 0.03),
    color: "#333",
  },
}));

/**
 * UserAvatar - Custom styled Avatar component
 */
const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: alpha("#CC0000", 0.1),
  color: "#CC0000",
  width: 36,
  height: 36,
}));

/**
 * StatusChip - Custom styled Chip component
 */
const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.75rem",
}));

/**
 * Sample user data structure - would be replaced with real API data
 * Each user contains:
 * - Unique ID
 * - First and Last name
 * - Email address
 * - Registration date
 * - Tokens available (or "NA" for unauthorized users)
 */
const sampleUsers = [
  {
    id: "user_1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    createdAt: "2023-01-15",
    tokens: 150,
  },
  {
    id: "user_2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    createdAt: "2023-02-22",
    tokens: 75,
  },
  {
    id: "user_3",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert@example.com",
    createdAt: "2023-03-10",
    tokens: "NA",
  },
  {
    id: "user_4",
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma@example.com",
    createdAt: "2023-04-05",
    tokens: 200,
  },
  {
    id: "user_5",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael@example.com",
    createdAt: "2023-05-18",
    tokens: "NA",
  },
];

/**
 * Sample blocked users data structure
 * Each blocked user contains:
 * - Email address
 * - Date when they were blocked
 */
const sampleBlockedUsers: { email: string; blockedAt: string }[] = [];

/**
 * UserManagementPage - Main component for user management page
 * - User listing and search
 * - Block/unblock functionality
 * - User removal
 * - Token status tracking
 * - Tabbed interface for active users and blocked users
 * 
 * @returns {JSX.Element} - Rendered component
 */
export default function UserManagementPage() {
  //const { users } = useClerk();

  // Active users list
  const [usersList, setUsersList] = useState<any[]>([]);
  // Blocked users list
  const [blockedUsers, setBlockedUsers] = useState<
    { email: string; blockedAt: string }[]
  >([]);
  // Loading state
  const [loading, setLoading] = useState(true);
  // Search term for filtering users
  const [searchTerm, setSearchTerm] = useState("");
  // Email to block
  const [blockEmail, setBlockEmail] = useState("");
  // Dialog state for user deletion confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // User to delete
  const [userToDelete, setUserToDelete] = useState<any>(null);
  // Snackbar state for notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // Snackbar message and severity
  const [snackbarMessage, setSnackbarMessage] = useState("");
  // Snackbar severity (success or error)
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );
  // Active tab state (0 for Users, 1 for Blocked Users)
  const [activeTab, setActiveTab] = useState(0);
  // Number of visible rows in the table
  const [visibleRows, setVisibleRows] = useState(5);

  // Load sample data on component mount
  useEffect(() => {
    // Using sample data instead of Clerk for now
    setUsersList(sampleUsers);
    setBlockedUsers(sampleBlockedUsers);
    setLoading(false);
  }, []);

  /**
   * Handles search input changes
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Handles block email input changes
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event
   */
  const handleBlockEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBlockEmail(event.target.value);
  };

  /**
   * Handles tab changes
   * @param {React.SyntheticEvent} event - Tab change event
   * @param {number} newValue - New tab value
   */
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearchTerm("");
  };

  // Filter active users based on search term
  const filteredUsers = usersList.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get subset of users for pagination
  const displayedUsers = filteredUsers.slice(0, visibleRows);

  // Filter blocked users based on search term
  const filteredBlockedUsers = blockedUsers.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /**
   * Opens the delete confirmation dialog
   * @param {object} user - User to be deleted
   */
  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  /**
   * Handles user deletion confirmation
   */
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setLoading(true);
      // Remove the user from our local state
      setUsersList((prevUsers) =>
        prevUsers.filter((user) => user.id !== userToDelete.id),
      );
      showSnackbar(
        `User ${userToDelete.firstName} ${userToDelete.lastName} was successfully removed.`,
        "success",
      );
    } catch (error) {
      console.error("Error removing user:", error);
      showSnackbar("Error removing user. Please try again.", "error");
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      setLoading(false);
    }
  };

  /**
   * Handles canceling the delete confirmation dialog
   */
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  /**
   * Blocks a user by adding them to the blocked users list
   */
  const blockUser = () => {
    if (!blockEmail || !blockEmail.trim()) {
      showSnackbar("Please enter a valid email address", "error");
      return;
    }

    // Check if email is already in the blocked list
    if (
      blockedUsers.some(
        (user) => user.email.toLowerCase() === blockEmail.toLowerCase(),
      )
    ) {
      showSnackbar("This email is already blocked", "error");
      return;
    }

    // Add to blocked users list
    const newBlockedUser = {
      email: blockEmail,
      blockedAt: new Date().toISOString(),
    };

    setBlockedUsers((prev) => [...prev, newBlockedUser]);
    setBlockEmail("");
    showSnackbar(`User with email ${blockEmail} has been blocked`, "success");
  };

  /**
   * Unblocks a user by email
   * @param {string} email - Email of the user to unblock
   */
  const unblockUser = (email: string) => {
    setBlockedUsers((prev) => prev.filter((user) => user.email !== email));
    showSnackbar(`User with email ${email} has been unblocked`, "success");
  };

  /**
   * Shows feedback snackbar
   * @param {string} message - Message to display
   * @param {"success" | "error"} severity - Severity of the message
   */
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  /**
   * Handles snackbar close event
   */
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  /**
   * Shows more rows in the user table
   */
  const showMoreRows = () => {
    setVisibleRows((prev) => prev + 5);
  };

  /**
   * Shows fewer rows in the user table
   */
  const showLessRows = () => {
    setVisibleRows((prev) => Math.max(5, prev - 5));
  };

  /**
   * Check if a user is blocked by email
   * @param {string} email - Email of the user to check
   * @returns {boolean} - True if the user is blocked, false otherwise
   */
  const isUserBlocked = (email: string) => {
    return blockedUsers.some(
      (blockedUser) => blockedUser.email.toLowerCase() === email.toLowerCase(),
    );
  };

  /**
   * Blocks a user from the active user list
   * @param {object} user - User object to block 
   */
  const blockUserFromList = (user: any) => {
    if (isUserBlocked(user.email)) {
      showSnackbar(
        `${user.firstName} ${user.lastName} is already blocked`,
        "error",
      );
      return;
    }

    setBlockedUsers((prev) => [
      ...prev,
      {
        email: user.email,
        blockedAt: new Date().toISOString(),
      },
    ]);
    showSnackbar(
      `User ${user.firstName} ${user.lastName} has been blocked`,
      "success",
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
      <Box sx={{ mb: 4, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: "linear-gradient(45deg, #CC0000 30%, #21CBF3 90%)",
            backgroundClip: "text",
            textFillColor: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          User Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Review and manage users.
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
          bgcolor: "rgba(204, 0, 0, 0.1)",
          color: "#660000",
        }}
      >
        <Typography variant="body2">
          This page displays all users who have signed up with Clerk. The
          &quot;Tokens&quot; field shows available tokens for authorized users,
          or &quot;N/A&quot; for unauthorized users. You can search users by
          name or email, and manage blocked users from the dedicated tab.
        </Typography>
      </Alert>

      <StyledTabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <StyledTab label="Users" icon={<PersonIcon />} iconPosition="start" />
        <StyledTab
          label="Blocked Users"
          icon={<BlockIcon />}
          iconPosition="start"
        />
      </StyledTabs>

      {activeTab === 0 ? (
        <>
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: 400,
              }}
            >
              <TextField
                placeholder="Search users..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#999" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    "&.MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: alpha("#CC0000", 0.5),
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#CC0000",
                      },
                    },
                  },
                }}
              />
              <Tooltip title="Add filters">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {filteredUsers.length} user
                {filteredUsers.length !== 1 ? "s" : ""} found
              </Typography>
            </Box>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              overflow: "hidden",
              mb: 3,
            }}
          >
            <Table>
              <StyledTableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Registration Date</TableCell>
                  <TableCell>Tokens</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={30} sx={{ color: "#CC0000" }} />
                    </TableCell>
                  </TableRow>
                ) : displayedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <PersonIcon
                          sx={{ fontSize: 40, color: "#ccc", mb: 1 }}
                        />
                        <Typography color="text.secondary">
                          No users found.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedUsers.map((user) => {
                    const userBlocked = isUserBlocked(user.email);
                    return (
                      <TableRow
                        key={user.id}
                        sx={{
                          "&:hover": {
                            backgroundColor: alpha("#CC0000", 0.02),
                          },
                        }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <UserAvatar>
                              {user.firstName?.[0]}
                              {user.lastName?.[0]}
                            </UserAvatar>
                            <Typography variant="body2" fontWeight="500">
                              {`${user.firstName || ""} ${user.lastName || ""}`}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body2">
                              {user.email}
                            </Typography>
                            {userBlocked && (
                              <Tooltip title="User is blocked">
                                <BlockIcon
                                  sx={{ color: "#f57c00", fontSize: 16 }}
                                />
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )
                              : "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {user.tokens === "NA" ? (
                            <StatusChip
                              label="Unauthorized"
                              size="small"
                              sx={{
                                backgroundColor: alpha("#666", 0.1),
                                color: "#666",
                              }}
                            />
                          ) : (
                            <StatusChip
                              label={`${user.tokens} tokens`}
                              size="small"
                              sx={{
                                backgroundColor: alpha("#CC0000", 0.1),
                                color: "#CC0000",
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {userBlocked ? (
                            <Tooltip title="Already blocked">
                              <Box sx={{ display: "inline-flex" }}>
                                <Chip
                                  label="Blocked"
                                  size="small"
                                  icon={<CheckCircleIcon fontSize="small" />}
                                  sx={{
                                    backgroundColor: alpha("#f57c00", 0.1),
                                    color: "#f57c00",
                                    fontWeight: 500,
                                  }}
                                />
                              </Box>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Block">
                              <IconButton
                                size="small"
                                sx={{
                                  color: "#f57c00",
                                  "&:hover": {
                                    backgroundColor: alpha("#f57c00", 0.1),
                                  },
                                }}
                                onClick={() => blockUserFromList(user)}
                              >
                                <BlockIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Remove user">
                            <IconButton
                              size="small"
                              sx={{
                                ml: 1,
                                color: "#CC0000",
                                "&:hover": {
                                  backgroundColor: alpha("#CC0000", 0.1),
                                },
                              }}
                              onClick={() => handleDeleteClick(user)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredUsers.length > 5 && (
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}
            >
              {visibleRows < filteredUsers.length && (
                <Button
                  variant="outlined"
                  onClick={showMoreRows}
                  sx={{
                    borderColor: alpha("#CC0000", 0.5),
                    color: "#CC0000",
                    "&:hover": {
                      borderColor: "#CC0000",
                      backgroundColor: alpha("#CC0000", 0.04),
                    },
                  }}
                >
                  Show More
                </Button>
              )}
              {visibleRows > 5 && (
                <Button
                  variant="text"
                  onClick={showLessRows}
                  sx={{
                    color: "#666",
                    "&:hover": {
                      backgroundColor: alpha("#666", 0.04),
                    },
                  }}
                >
                  Show Less
                </Button>
              )}
            </Box>
          )}
        </>
      ) : (
        <>
          <Card
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Block a User
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <TextField
                  label="Email address to block"
                  placeholder="user@example.com"
                  variant="outlined"
                  size="small"
                  value={blockEmail}
                  onChange={handleBlockEmailChange}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": {
                        borderColor: alpha("#CC0000", 0.5),
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#CC0000",
                      },
                    },
                  }}
                />
                <ActionButton
                  variant="contained"
                  sx={{
                    backgroundColor: "#CC0000",
                    "&:hover": {
                      backgroundColor: "#AA0000",
                    },
                  }}
                  onClick={blockUser}
                  startIcon={<BlockIcon />}
                >
                  Block
                </ActionButton>
              </Box>
            </CardContent>
          </Card>

          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: 400,
              }}
            >
              <TextField
                placeholder="Search blocked users..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#999" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    "&.MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: alpha("#CC0000", 0.5),
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#CC0000",
                      },
                    },
                  },
                }}
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {filteredBlockedUsers.length} blocked user
                {filteredBlockedUsers.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <Table>
              <StyledTableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Blocked Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={30} sx={{ color: "#CC0000" }} />
                    </TableCell>
                  </TableRow>
                ) : filteredBlockedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <BlockIcon
                          sx={{ fontSize: 40, color: "#ccc", mb: 1 }}
                        />
                        <Typography color="text.secondary">
                          No blocked users found.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBlockedUsers.map((blockedUser) => (
                    <TableRow
                      key={blockedUser.email}
                      sx={{
                        "&:hover": { backgroundColor: alpha("#CC0000", 0.02) },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {blockedUser.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(blockedUser.blockedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Unblock user">
                          <IconButton
                            color="primary"
                            onClick={() => unblockUser(blockedUser.email)}
                            size="small"
                            sx={{
                              color: "#2196f3",
                              "&:hover": {
                                backgroundColor: alpha("#2196f3", 0.1),
                              },
                            }}
                          >
                            <RestoreIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          Confirm User Removal
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove{" "}
            <strong>
              {userToDelete?.firstName} {userToDelete?.lastName}
            </strong>{" "}
            ({userToDelete?.email})? This action cannot be undone. The user will
            be able to sign up again if they wish.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{
              color: "#666",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              backgroundColor: "#CC0000",
              "&:hover": {
                backgroundColor: "#AA0000",
              },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Remove User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            borderRadius: 2,
            ...(snackbarSeverity === "success"
              ? {
                  backgroundColor: alpha("#4caf50", 0.9),
                  color: "white",
                }
              : {
                  backgroundColor: alpha("#f44336", 0.9),
                  color: "white",
                }),
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
