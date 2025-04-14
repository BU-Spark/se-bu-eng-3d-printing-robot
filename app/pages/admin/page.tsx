'use client';

import { useRouter } from 'next/navigation';
import { 
  Box, Typography, Paper, Grid, Avatar, Button, Divider, Tooltip 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ApprovalIcon from '@mui/icons-material/Approval';
import TokenIcon from '@mui/icons-material/Toll';
import EventNoteIcon from '@mui/icons-material/EventNote';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700, 
            mb: 1, 
            background: '#CC0000',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Overview of system metrics and quick actions.
        </Typography>
      </Box>

      {/* Metrics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Users */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#CC0000', color: 'white' }}>
                <PeopleIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  120
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Pending Approvals */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#FF9800', color: 'white' }}>
                <ApprovalIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  5
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Approvals
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Tokens Distributed */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#4CAF50', color: 'white' }}>
                <TokenIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  250
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tokens Distributed
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* System Logs */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#607D8B', color: 'white' }}>
                <EventNoteIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  40
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  System Logs
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions Section */}
      <Typography variant="h5" component="h2" fontWeight={600} sx={{ mb: 2 }}>
        Quick Actions
      </Typography>

      {/* Action Cards */}
      <Grid container spacing={3}>
        {/* User Management */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor:'#CC0000', color:'white' }}>
                <PeopleIcon />
              </Avatar>
              <Box flexGrow={1}>
                <Typography variant="h6" fontWeight={600}>
                  User Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage user accounts and permissions.
                </Typography>
              </Box>
              <Button 
                variant="contained"
                size="small"
                sx={{
                  bgcolor:'#CC0000',
                  textTransform:'none',
                  '&:hover': { bgcolor:'#b30000' }
                }}
                onClick={() => router.push('./admin/users')}
              >
                Manage
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="View detailed user statistics" arrow>
                <InfoOutlinedIcon color="action" />
              </Tooltip>
              <Typography variant="body2" color="text.secondary">
                View detailed user statistics
              </Typography>
            </Box>
          </Paper>
        </Grid>
        {/* Token Distribution */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor:'#4CAF50', color:'white' }}>
                <TokenIcon />
              </Avatar>
              <Box flexGrow={1}>
                <Typography variant="h6" fontWeight={600}>
                  Token Distribution
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage token distribution to users.
                </Typography>
              </Box>
              <Button 
                variant="contained"
                size="small"
                sx={{
                  bgcolor:'#4CAF50',
                  textTransform:'none',
                  '& hover': {bgcolor:'#cc7a00'}
                }}
                onClick={() => router.push('./admin/tokens')}
              >
                Distribute
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="View token distribution history" arrow>
                <InfoOutlinedIcon color="action" />
              </Tooltip>
              <Typography variant="body2" color="text.secondary">
                View token distribution history
              </Typography>
            </Box>
          </Paper>
        </Grid>
        {/* Approval Management */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor:'#FF9800', color:'white' }}>
                <ApprovalIcon />
              </Avatar>
              <Box flexGrow={1}>
                <Typography variant="h6" fontWeight={600}>
                  Approval Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage pending approvals.
                </Typography>
              </Box>
              <Button 
                variant="contained"
                size="small"
                sx={{
                  bgcolor:'#FF9800',
                  textTransform:'none',
                  '& hover': {bgcolor:'#cc7a00'}
                }}
                onClick={() => router.push('./admin/approvals')}
              >
                Approve
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="View approval history" arrow>
                <InfoOutlinedIcon color="action" />
              </Tooltip>
              <Typography variant="body2" color="text.secondary">
                View approval history
              </Typography>
            </Box>
          </Paper>
        </Grid>
        {/* System Logs */}
        <Grid item xs={12} sm={6}> 
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor:'#607D8B', color:'white' }}>
                <EventNoteIcon />
              </Avatar>
              <Box flexGrow={1}>
                <Typography variant="h6" fontWeight={600}>
                  System Logs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View system logs and activities.
                </Typography>
              </Box>
              <Button 
                variant="contained"
                size="small"
                sx={{
                  bgcolor:'#607D8B',
                  textTransform:'none',
                  '& hover': {bgcolor:'#43a047'}
                }}
                onClick={() => router.push('./admin/syslogs')}
              >
                View Logs
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="View detailed system logs" arrow>
                <InfoOutlinedIcon color="action" />
              </Tooltip>
              <Typography variant="body2" color="text.secondary">
                View detailed system logs
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}