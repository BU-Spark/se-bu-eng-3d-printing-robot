// app/pages/admin/users/page.tsx
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
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import RestoreIcon from '@mui/icons-material/Restore';
import { useClerk } from '@clerk/nextjs';

// Sample user data - this would be replaced with real data
const sampleUsers = [
  { id: 'user_1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', createdAt: '2023-01-15' },
  { id: 'user_2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', createdAt: '2023-02-22' },
  { id: 'user_3', firstName: 'Robert', lastName: 'Johnson', email: 'robert@example.com', createdAt: '2023-03-10' },
  // Add more sample users as needed
];

// Sample blocked users
const sampleBlockedUsers: { email: string, blockedAt: string }[] = [];

export default function UserManagementPage() {
  //const { users } = useClerk();
  const [usersList, setUsersList] = useState<any[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<{ email: string, blockedAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [blockEmail, setBlockEmail] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [activeTab, setActiveTab] = useState(0);

  // FALL 2025 THIS MIGHT WORK :)
  // useEffect(() => {
  //   // In a real implementation, you would fetch users from Clerk
  //   // For now, we'll use sample data
  //   const fetchUsers = async () => {
  //     try {
  //       if (users) {
  //         const userList = await users.getUserList();
  //         setUsersList(userList);
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
    // Using sample data instead of Clerk for now
    setUsersList(sampleUsers);
    setBlockedUsers(sampleBlockedUsers);
    setLoading(false);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleBlockEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlockEmail(event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const filteredUsers = usersList.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBlockedUsers = blockedUsers.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      setLoading(true);
      // In a real implementation, you would call the Clerk API to delete the user
      // For now, we'll just simulate it
      // await users.deleteUser(userToDelete.id);
      
      // Remove the user from our local state
      setUsersList(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
      showSnackbar(`User ${userToDelete.firstName} ${userToDelete.lastName} was successfully removed.`, 'success');
    } catch (error) {
      console.error("Error removing user:", error);
      showSnackbar('Error removing user. Please try again.', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const blockUser = () => {
    if (!blockEmail || !blockEmail.trim()) {
      showSnackbar('Please enter a valid email address', 'error');
      return;
    }

    // Check if email is already in the blocked list
    if (blockedUsers.some(user => user.email.toLowerCase() === blockEmail.toLowerCase())) {
      showSnackbar('This email is already blocked', 'error');
      return;
    }

    // Add to blocked users list
    const newBlockedUser = {
      email: blockEmail,
      blockedAt: new Date().toISOString()
    };

    setBlockedUsers(prev => [...prev, newBlockedUser]);
    setBlockEmail('');
    showSnackbar(`User with email ${blockEmail} has been blocked`, 'success');
  };

  const unblockUser = (email: string) => {
    setBlockedUsers(prev => prev.filter(user => user.email !== email));
    showSnackbar(`User with email ${email} has been unblocked`, 'success');
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
        User Management
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
          This page should display all users who have signed up with Clerk. If users are authorized by the client to submit jobs then
          the number of tokens they have should be represented in a field called Tokens. If a user isn't authorized then this field
          should be set to NA. The user table returned should show 5-10 user records with the ability to show more and less. The admin
          should be able to search users up with their name or email address.
          After displaying the users, this page should provide admins with the ability to 'block' people from accessing the website.
          The admin should should be able to enter a user's email and add them to the blocked list. The admin should also be able to
          unblock people.
        </Alert>
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Users" />
        <Tab label="Blocked Users" />
      </Tabs>

      {activeTab === 0 ? (
        <>
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
                  <TableCell>Registration Date</TableCell>
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
                      <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteClick(user)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          color="warning"
                          onClick={() => {
                            setBlockedUsers(prev => [...prev, { email: user.email, blockedAt: new Date().toISOString() }]);
                            showSnackbar(`User ${user.firstName} ${user.lastName} has been blocked`, 'success');
                          }}
                          size="small"
                          sx={{ ml: 1 }}
                        >
                          <BlockIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Email to block"
              variant="outlined"
              size="small"
              value={blockEmail}
              onChange={handleBlockEmailChange}
              fullWidth
            />
            <Button 
              variant="contained" 
              color="warning"
              onClick={blockUser}
              startIcon={<BlockIcon />}
            >
              Block User
            </Button>
          </Box>

          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
              label="Search Blocked Users"
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
                  <TableCell>Email</TableCell>
                  <TableCell>Blocked Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredBlockedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No blocked users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBlockedUsers.map((blockedUser) => (
                    <TableRow key={blockedUser.email}>
                      <TableCell>{blockedUser.email}</TableCell>
                      <TableCell>{new Date(blockedUser.blockedAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          color="primary" 
                          onClick={() => unblockUser(blockedUser.email)}
                          size="small"
                        >
                          <RestoreIcon />
                        </IconButton>
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
      >
        <DialogTitle>Confirm User Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove {userToDelete?.firstName} {userToDelete?.lastName} ({userToDelete?.email})? This action cannot be undone.
            The user will be able to sign up again if they wish.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Remove User
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