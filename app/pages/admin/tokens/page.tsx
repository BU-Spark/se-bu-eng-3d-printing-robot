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
  Avatar, Tooltip, Divider,
  Chip, styled, alpha,
} from "@mui/material";

// Material UI Icons
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import TokenIcon from "@mui/icons-material/Toll";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

/**
 * StyledTableContainer - Custom styled table container
 */
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
  marginBottom: theme.spacing(4),
}));

/**
 * StyledTableHead - Custom styled table head
 */
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-head": {
    fontWeight: 600,
    backgroundColor: alpha("#CC0000", 0.03),
    color: "#333",
  },
}));

/**
 * TokenBadge - Custom styled chip for displaying token count
 */
const TokenBadge = styled(Chip)(({ theme }) => ({
  borderRadius: 16,
  fontWeight: 600,
  padding: "0 8px",
}));

/**
 * ActionButton - Custom styled icon button for actions
 */
const ActionButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0, 0.5),
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.15)",
  },
}));

/**
 * AvatarColorProps - Interface for avatar color props
 */
interface AvatarColorProps {
  id: string;
}

/**
 * Generates a consistent color for user avatars based on their ID
 * @param {string} id - User ID
 * @returns {string} HEX color code
 */
const getAvatarColor = (id: AvatarColorProps["id"]): string => {
  const colors: string[] = [
    "#1a237e", "#311b92", "#4a148c",
    "#880e4f", "#b71c1c", "#e65100",
    "#ff6f00", "#827717", "#33691e",
    "#1b5e20", "#004d40", "#006064"
  ];

  // Simple hash function to map ID to color index
  const hash: number = id
    .split("")
    .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

/**
 * Sample user data with tokens - would be replaced with real API data
 * Each user has:
 * - Unique ID
 * - First and last name
 * - Email
 * - Token balance
 */
const sampleUsers = [
  {
    id: "user_1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    tokens: 15,
  },
  {
    id: "user_2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    tokens: 8,
  },
  {
    id: "user_3",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert@example.com",
    tokens: 22,
  },
  {
    id: "user_4",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily@example.com",
    tokens: 0,
  },
  {
    id: "user_5",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael@example.com",
    tokens: 5,
  },
  {
    id: "user_6",
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah@example.com",
    tokens: 10,
  },
  // Add more sample users as needed
];

/**
 * TokenManagementPage Component
 * 
 * A comprehensive interface for managing user tokens with:
 * - User search functionality
 * - Token addition/removal
 * - Visual token balance indicators
 * - Responsive dialog for token operations
 * - Feedback notifications
 * 
 * Features:
 * - Filterable and sortable user table
 * - Color-coded token balances
 * - Avatar generation for users
 * - Input validation
 * 
 * @returns {JSX.Element} The Token Management interface
 */
export default function TokenManagementPage() {
  //const { users } = useClerk();

  // List of users with tokens
  const [usersList, setUsersList] = useState<any[]>([]);
  // Loading state
  const [loading, setLoading] = useState(true);
  // Search term for filtering
  const [searchTerm, setSearchTerm] = useState("");
  // Dialog visibility
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  // Currently selected user for token operations
  const [selectedUser, setSelectedUser] = useState<any>(null);
  // Token input value
  const [tokensToAdd, setTokensToAdd] = useState("1");
  // Snackbar visibility and message
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // Snackbar message and severity
  const [snackbarMessage, setSnackbarMessage] = useState("");
  // Message type 
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  // Add/remove mode
  const [isAddingTokens, setIsAddingTokens] = useState(true);

  // THIS MIGHT (?) WORK IN ACC IMPLEMENTATION FALL 2025 :)
  // useEffect(() => {
  //   // In a real implementation, you would fetch users from Clerk
  //   // and join with your token data from your database
  //   const fetchUsers = async () => {
  //     try {
  //       if (users) {
  //         const userList = await users.getUserList();
  //         // Here you would fetch token data from your database
  //         // and join it with the user data
  //         const usersWithTokens = userList.map(user => ({
  //           ...user,
  //           tokens: 0 // Default token value
  //         }));
  //         setUsersList(usersWithTokens);
  //       } else {
  //         // Fall back to sample data if Clerk users is not available
  //         setUsersList(sampleUsers);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //       setUsersList(sampleUsers); // Fallback to sample data
  //       showSnackbar('Error loading users. Using sample data.', 'error');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUsers();
  // }, [users]);

  useEffect(() => {
    // Simulate loading and then set sample users
    setTimeout(() => {
      setUsersList(sampleUsers);
      setLoading(false);
      showSnackbar("User data loaded successfully", "success");
    }, 1000);
  }, []);

  /**
   * Handles search input changes
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change  
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Filter users based on search term (matches name or email)
   */
  const filteredUsers = usersList.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName?.toLowerCase()} ${user.lastName?.toLowerCase()}`.includes(
        searchTerm.toLowerCase(),
      ),
  );

  /**
   * Opens the token management dialog
   * @param {object} user - The user to manage tokens for
   * @param {boolean} isAdding - Whether adding (true) or removing (false) tokens
   */
  const handleTokenDialogOpen = (user: any, isAdding: boolean) => {
    setSelectedUser(user);
    setIsAddingTokens(isAdding);
    setTokensToAdd("1");
    setTokenDialogOpen(true);
  };

  /**
   * Closes the token management dialog
   */
  const handleTokenDialogClose = () => {
    setTokenDialogOpen(false);
    setSelectedUser(null);
  };

  /**
   * Handles token input changes with validation
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event 
   */
  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow positive numbers
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setTokensToAdd(value);
    }
  };

  // Submits token changes and updates user balances
  const handleTokenSubmit = () => {
    if (!selectedUser || tokensToAdd === "") return;

    const tokens = parseInt(tokensToAdd);

    // Update the user's token count
    setUsersList((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === selectedUser.id) {
          const newTokens = isAddingTokens
            ? user.tokens + tokens
            : Math.max(0, user.tokens - tokens);
          return { ...user, tokens: newTokens };
        }
        return user;
      }),
    );

    // Show success message
    const action = isAddingTokens ? "added to" : "removed from";
    showSnackbar(
      `${tokens} tokens ${action} ${selectedUser.firstName} ${selectedUser.lastName}'s account.`,
      "success",
    );

    // Close the dialog
    handleTokenDialogClose();
  };

  /**
   * Displays a feedback snackbar message
   * @param {string} message - The message to display
   * @param {"success" | "error" | "info" } severity - The message type
   */
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info",
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Closes the snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  /**
   * Determines color for token badge based on balance
   * @param {number} tokens - The token count
   * @returns {string} MUI color name
   */
  const getTokenColor = (tokens: number) => {
    if (tokens === 0) return "default";
    if (tokens < 5) return "error";
    if (tokens < 10) return "warning";
    return "success";
  };

  /**
   * Generates intials for user avatars
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   * @returns {string} Initials string (e.g., "JD")
   */
  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header Card */}
      <Box sx={{ mb: 4, display: "flex", flexDirection: "column" }}>
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
          Token Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage and distribute tokens to your users.
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
          Tokens are used for challenge submissions. Each submission costs one
          token.
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
          placeholder="Search users..."
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

      {/* User Table */}
      <StyledTableContainer as={Paper}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Tokens</TableCell>
              <TableCell align="right">Actions</TableCell>
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
                    Loading user data...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
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
                    <PersonIcon
                      sx={{ fontSize: 40, color: "text.disabled", mb: 1 }}
                    />
                    <Typography variant="body1">No users found</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    },
                    transition: "background-color 0.2s",
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: getAvatarColor(user.id),
                          color: "white",
                          width: 40,
                          height: 40,
                          fontSize: "1rem",
                          fontWeight: 600,
                          mr: 2,
                        }}
                      >
                        {getUserInitials(user.firstName, user.lastName)}
                      </Avatar>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {`${user.firstName || ""} ${user.lastName || ""}`}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <EmailIcon
                        sx={{ color: "text.secondary", mr: 1, fontSize: 18 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <TokenBadge
                      label={user.tokens}
                      color={getTokenColor(user.tokens)}
                      size="small"
                      icon={<TokenIcon sx={{ fontSize: 16 }} />}
                      sx={{ minWidth: 80 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Tooltip title="Add tokens">
                        <ActionButton
                          onClick={() => handleTokenDialogOpen(user, true)}
                          size="medium"
                          sx={{
                            backgroundColor: "#FFEBEB",
                            color: "#CC0000",
                            "&:hover": {
                              backgroundColor: "#FFCCCC",
                            },
                          }}
                        >
                          <AddCircleIcon />
                        </ActionButton>
                      </Tooltip>

                      <Tooltip title="Remove tokens">
                        <ActionButton
                          onClick={() => handleTokenDialogOpen(user, false)}
                          size="medium"
                          sx={{
                            backgroundColor: "#FFEBEB",
                            color: "#CC0000",
                            "&:hover": {
                              backgroundColor: "#FFCCCC",
                            },
                          }}
                        >
                          <RemoveCircleIcon />
                        </ActionButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Token Dialog */}
      <Dialog
        open={tokenDialogOpen}
        onClose={handleTokenDialogClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: { xs: "90%", sm: 400 },
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
            color: "#CC0000",
          }}
        >
          {isAddingTokens ? (
            <AddCircleIcon sx={{ color: "#CC0000" }} />
          ) : (
            <RemoveCircleIcon sx={{ color: "#CC0000" }} />
          )}
          {isAddingTokens ? "Add Tokens" : "Remove Tokens"}
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 1 }}>
          {selectedUser && (
            <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  bgcolor: getAvatarColor(selectedUser.id),
                  color: "white",
                  width: 40,
                  height: 40,
                  fontSize: "1rem",
                  fontWeight: 600,
                  mr: 2,
                }}
              >
                {getUserInitials(selectedUser.firstName, selectedUser.lastName)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={500}>
                  {selectedUser.firstName} {selectedUser.lastName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TokenIcon sx={{ color: "text.secondary", fontSize: 16 }} />
                  <Typography variant="caption" color="text.secondary">
                    Current balance: {selectedUser.tokens} tokens
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <DialogContentText sx={{ mb: 2 }}>
            {isAddingTokens
              ? "How many tokens would you like to add?"
              : "How many tokens would you like to remove?"}
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            label="Number of Tokens"
            type="text"
            fullWidth
            variant="outlined"
            value={tokensToAdd}
            onChange={handleTokenChange}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {isAddingTokens ? (
                    <AddCircleIcon sx={{ color: "#CC0000" }} />
                  ) : (
                    <RemoveCircleIcon sx={{ color: "#CC0000" }} />
                  )}
                </InputAdornment>
              ),
            }}
          />

          {!isAddingTokens &&
            selectedUser &&
            parseInt(tokensToAdd) > selectedUser.tokens && (
              <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                User only has {selectedUser.tokens} tokens available.
              </Alert>
            )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button
            onClick={handleTokenDialogClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              borderColor: "#CC0000",
              color: "#CC0000",
              "&:hover": {
                borderColor: "#b30000",
                backgroundColor: "#ffe6e6",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleTokenSubmit}
            variant="contained"
            disabled={
              !isAddingTokens &&
              selectedUser &&
              parseInt(tokensToAdd) > selectedUser.tokens
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              boxShadow: 2,
              bgcolor: "#CC0000",
              "&:hover": {
                bgcolor: "#b30000",
              },
            }}
          >
            {isAddingTokens ? "Add Tokens" : "Remove Tokens"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            "& .MuiAlert-icon": {
              fontSize: "1.5rem",
            },
            "& .MuiAlert-message": {
              fontSize: "0.95rem",
              fontWeight: 500,
            },
          }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
