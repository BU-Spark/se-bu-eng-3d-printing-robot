"use client";

import { useState } from 'react';

// Material-UI components
import { 
  Box, Typography, TextField, MenuItem, Paper, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function LeaderboardPage() {
  // State for search and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Value');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Mock data for the leaderboard
  const leaderboardData = [
    { id: 98035, dateTime: '09/12/24 12:00 PM', user: 'A', value: '36 J/g' },
    { id: 96412, dateTime: '09/06/24 2:15 PM', user: 'B', value: '25 J/g' },
    { id: 94112, dateTime: '09/06/24 10:30 AM', user: 'C', value: '20 J/g' },
    { id: 92916, dateTime: '09/06/24 10:00 AM', user: 'D', value: '10 J/g' },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: '1000px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Leaderboard
      </Typography>
      
      {/* Search and Filter Row */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search by user or ID"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: '250px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Sort by:</Typography>
          <TextField
            select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            sx={{ minWidth: '120px' }}
          >
            <MenuItem value="Date">Date</MenuItem>
            <MenuItem value="Value">Value</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </TextField>
        </Box>
      </Box>
      
      {/* Leaderboard Table */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Date & Time</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Exp. ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardData.map((row) => (
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          variant="outlined" 
          color="primary"
          sx={{ borderRadius: 2 }}
        >
          Go Back
        </Button>
        
        <Typography variant="body2">
          1/10
        </Typography>
        
        <Button 
          variant="outlined" 
          color="secondary"
          sx={{ borderRadius: 2 }}
        >
          Show More
        </Button>
      </Box>
    </Box>
  );
}
