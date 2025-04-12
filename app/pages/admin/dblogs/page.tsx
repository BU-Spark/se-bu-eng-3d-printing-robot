// app/pages/admin/dblogs/page.tsx
'use client';
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
    Chip
  } from '@mui/material';
  
  // Sample log data
  const logEntries = [
    { id: 1, timestamp: '2025-04-10T08:23:45', level: 'INFO', message: 'User login successful', user: 'john@example.com' },
    { id: 2, timestamp: '2025-04-10T08:24:12', level: 'WARNING', message: 'Failed login attempt', user: 'unknown' },
    { id: 3, timestamp: '2025-04-10T09:15:22', level: 'INFO', message: 'New submission created', user: 'jane@example.com' },
    { id: 4, timestamp: '2025-04-10T10:02:33', level: 'ERROR', message: 'Database connection error', user: 'system' },
    { id: 5, timestamp: '2025-04-10T10:05:17', level: 'INFO', message: 'Database connection restored', user: 'system' },
  ];
  
  export default function SystemLogsPage() {
    // Function to format timestamp
    const formatTimestamp = (timestamp: string) => {
      return new Date(timestamp).toLocaleString();
    };
    
    // Function to get chip color based on log level
    const getChipColor = (level: string) => {
      switch (level) {
        case 'INFO':
          return 'info';
        case 'WARNING':
          return 'warning';
        case 'ERROR':
          return 'error';
        default:
          return 'default';
      }
    };
  
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          System Logs
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          This page is a placeholder. The actual system logs functionality will be implemented in the future.
        </Alert>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logEntries.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={log.level} 
                      color={getChipColor(log.level) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{log.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }