// app/pages/admin/tokens/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useClerk } from '@clerk/nextjs';

// Sample user data with tokens - this would be replaced with real data
const sampleUsers = [
  { id: 'user_1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', tokens: 0 },
  { id: 'user_2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', tokens: 0 },
  { id: 'user_3', firstName: 'Robert', lastName: 'Johnson', email: 'robert@example.com', tokens: 0 },
  // Add more sample users as needed
];

export default function TokenManagementPage() {
  //const { users } = useClerk();
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [tokensToAdd, setTokensToAdd] = useState('1');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
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
    }, 500);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = usersList.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) + " " +
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const handleTokenDialogOpen = (user: any, isAdding: boolean) => {
    setSelectedUser(user);
    setIsAddingTokens(isAdding);
    setTokensToAdd('1');
    setTokenDialogOpen(true);
  };

  const handleTokenDialogClose = () => {
    setTokenDialogOpen(false);
    setSelectedUser(null);
  };

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow positive numbers
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setTokensToAdd(value);
    }
  };

  const handleTokenSubmit = () => {
    if (!selectedUser || tokensToAdd === '') return;
    
    const tokens = parseInt(tokensToAdd);
    
    // Update the user's token count
    setUsersList(prevUsers => 
      prevUsers.map(user => {
        if (user.id === selectedUser.id) {
          const newTokens = isAddingTokens ? 
            user.tokens + tokens : 
            Math.max(0, user.tokens - tokens);
          return { ...user, tokens: newTokens };
        }
        return user;
      })
    );
    
    // Show success message
    const action = isAddingTokens ? 'added to' : 'removed from';
    showSnackbar(`${tokens} tokens ${action} ${selectedUser.firstName} ${selectedUser.lastName}'s account.`, 'success');
    
    // Close the dialog
    handleTokenDialogClose();
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Token Management
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          label="Search Users"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Tokens</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{`${user.firstName || ''} ${user.lastName || ''}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="center">{user.tokens}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleTokenDialogOpen(user, true)}
                      size="small"
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleTokenDialogOpen(user, false)}
                      size="small"
                      disabled={user.tokens <= 0}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Token Dialog */}
      <Dialog open={tokenDialogOpen} onClose={handleTokenDialogClose}>
        <DialogTitle>
          {isAddingTokens ? 'Add Tokens' : 'Remove Tokens'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isAddingTokens 
              ? `Add tokens to ${selectedUser?.firstName} ${selectedUser?.lastName}'s account.`
              : `Remove tokens from ${selectedUser?.firstName} ${selectedUser?.lastName}'s account.`
            }
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
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {isAddingTokens ? <AddIcon /> : <RemoveIcon />}
                </InputAdornment>
              ),
            }}
          />
          {!isAddingTokens && selectedUser && parseInt(tokensToAdd) > selectedUser.tokens && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              User only has {selectedUser.tokens} tokens available.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTokenDialogClose}>Cancel</Button>
          <Button 
            onClick={handleTokenSubmit} 
            color={isAddingTokens ? "primary" : "error"}
            disabled={!isAddingTokens && selectedUser && parseInt(tokensToAdd) > selectedUser.tokens}
          >
            {isAddingTokens ? 'Add' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success/Error Snackbar */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}