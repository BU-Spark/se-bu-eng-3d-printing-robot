"use client";

import { useState } from 'react';
import { 
  Typography, Box, Card, 
  CardContent, CardActions, Button,
  Grid, Divider, Alert,
  Tabs, Tab, Chip,
  Paper, Avatar, Stack,
  styled, Snackbar
} from '@mui/material';

// Icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Custom styled components
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTabs-indicator': {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '0.95rem',
  fontWeight: 500,
  minHeight: 48,
  padding: '12px 16px',
  '&.Mui-selected': {
    fontWeight: 600,
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  borderRadius: 16,
  fontWeight: 500,
  fontSize: '0.75rem',
}));

export default function ManageApprovalsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', type: '' });

  // State for all submissions
  const [pendingSubmissions, setPendingSubmissions] = useState([
    {
      id: '12345',
      submitter: 'John Doe',
      avatar: 'JD',
      date: 'April 8, 2025',
      description: 'An experimental mechanics challenge submission that needs review and approval.',
      timeAgo: '2 days ago',
      rejectedDate: undefined
    },
    {
      id: '12346',
      submitter: 'Jane Smith',
      avatar: 'JS',
      date: 'April 9, 2025',
      description: 'Another experimental mechanics challenge submission awaiting review.',
      timeAgo: '1 day ago',
      rejectedDate: undefined
    },
    {
      id: '12347',
      submitter: 'Alice Johnson',
      avatar: 'AJ',
      date: 'April 10, 2025',
      description: 'Another experimental mechanics challenge submission awaiting review.',
      timeAgo: '6 hours ago',
      rejectedDate: undefined
    }
  ]);

  const [approvedSubmissions, setApprovedSubmissions] = useState([
    {
      id: '12340',
      submitter: 'Emily Chen',
      avatar: 'EC',
      date: 'April 5, 2025',
      approvedDate: 'April 7, 2025',
      description: 'description of the approved submission.',
      timeAgo: '5 days ago',
      approvedTimeAgo: '3 days ago'
    },
    {
      id: '12341',
      submitter: 'Mark Williams',
      avatar: 'MW',
      date: 'April 6, 2025',
      approvedDate: 'April 8, 2025',
      description: 'another approved submission description.',
      timeAgo: '4 days ago',
      approvedTimeAgo: '2 days ago'
    }
  ]);

  const [rejectedSubmissions, setRejectedSubmissions] = useState([
    {
      id: '12338',
      submitter: 'Robert Taylor',
      avatar: 'RT',
      date: 'April 4, 2025',
      rejectedDate: 'April 6, 2025',
      reason: 'Insufficient documentation',
      description: 'description of the rejected submission.',
      timeAgo: '6 days ago',
      rejectedTimeAgo: '4 days ago'
    }
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Helper function to get today's date in string format
  const getTodayDate = () => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options as Intl.DateTimeFormatOptions);
  };

  // Handle approval action
  const handleApprove = (submission: any) => {
    // Remove from pending
    const updatedPending = pendingSubmissions.filter(item => item.id !== submission.id);
    setPendingSubmissions(updatedPending);

    // Add to approved with approval date
    const approvedSubmission = {
      ...submission,
      approvedDate: getTodayDate(),
      approvedTimeAgo: 'just now'
    };
    setApprovedSubmissions([approvedSubmission, ...approvedSubmissions]);
    
    // Show notification
    setNotification({
      open: true,
      message: `${submission.submitter}'s submission has been approved`,
      type: 'success'
    });
    
    // Switch to approved tab after short delay
    setTimeout(() => setTabValue(1), 500);
  };

  // Handle reject action
  const handleReject = (submission: any) => {
    // Remove from pending
    const updatedPending = pendingSubmissions.filter(item => item.id !== submission.id);
    setPendingSubmissions(updatedPending);

    // Add to rejected with rejection date
    const rejectedSubmission = {
      ...submission,
      rejectedDate: getTodayDate(),
      rejectedTimeAgo: 'just now',
      reason: 'Administrator decision' 
    };
    setRejectedSubmissions([rejectedSubmission, ...rejectedSubmissions]);
    
    // Show notification
    setNotification({
      open: true,
      message: `${submission.submitter}'s submission has been rejected`,
      type: 'error'
    });
    
    // Switch to rejected tab after short delay
    setTimeout(() => setTabValue(2), 500);
  };

  // Handle revoke action (move from approved to rejected)
  const handleRevoke = (submission: any) => {
    // Remove from approved
    const updatedApproved = approvedSubmissions.filter(item => item.id !== submission.id);
    setApprovedSubmissions(updatedApproved);

    // Add to rejected with rejection date
    const rejectedSubmission = {
      ...submission,
      rejectedDate: getTodayDate(),
      rejectedTimeAgo: 'just now',
      reason: 'Access revoked'
    };
    setRejectedSubmissions([rejectedSubmission, ...rejectedSubmissions]);
    
    // Show notification
    setNotification({
      open: true,
      message: `${submission.submitter}'s access has been revoked`,
      type: 'warning'
    });
    
    // Switch to rejected tab after short delay
    setTimeout(() => setTabValue(2), 500);
  };

  // Handle reconsider action (move from rejected to pending)
  const handleReconsider = (submission: any) => {
    // Remove from rejected
    const updatedRejected = rejectedSubmissions.filter(item => item.id !== submission.id);
    setRejectedSubmissions(updatedRejected);

    // Strip rejected information and add back to pending
    const { rejectedDate, rejectedTimeAgo, reason, ...pendingSubmission } = submission;
    setPendingSubmissions([pendingSubmission, ...pendingSubmissions]);
    
    // Show notification
    setNotification({
      open: true,
      message: `${submission.submitter}'s submission has been moved back to pending`,
      type: 'info'
    });
    
    // Switch to pending tab after short delay
    setTimeout(() => setTabValue(0), 500);
  };

  // Get current submissions based on active tab
  const getCurrentSubmissions = () => {
    switch(tabValue) {
      case 1:
        return approvedSubmissions;
      case 2:
        return rejectedSubmissions;
      default:
        return pendingSubmissions;
    }
  };

  const getStatusIcon = () => {
    switch(tabValue) {
      case 1:
        return <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.light' }} />;
      case 2:
        return <CancelOutlinedIcon sx={{ fontSize: 64, color: 'error.light' }} />;
      default:
        return <AccessTimeIcon sx={{ fontSize: 64, color: 'info.light' }} />;
    }
  };

  const getTabLabel = (index: number) => {
    switch(index) {
      case 0:
        return 'pending';
      case 1:
        return 'approved';
      case 2:
        return 'rejected';
      default:
        return '';
    }
  };
  
  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };

  const currentSubmissions = getCurrentSubmissions();

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700, 
            mb: 1, 
            background: 'linear-gradient(45deg, #CC0000 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Manage Approvals
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Review and manage user requests.
        </Typography>
      </Box>
      
      {/* Info Alert */}
      <Alert 
        severity="info" 
        icon={<InfoOutlinedIcon sx={{ color: '#CC0000' }} />} 
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          '& .MuiAlert-message': { py: 1 },
          bgcolor: 'rgba(204, 0, 0, 0.1)', 
          color: '#660000', 
        }}
      >
        <Typography variant="body2">
          This page allows administrators to approve user access. Users must sign up through Clerk first, 
          then can be granted submission privileges here.
        </Typography>
      </Alert>

      {/* Tabs */}
      <Box sx={{ mb: 4 }}>
        <StyledTabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="approval tabs"
          variant="fullWidth"
          TabIndicatorProps={{ style: { backgroundColor: '#CC0000' } }} // indicator color
        >
          <StyledTab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', color: tabValue === 0 ? '#F57C00' : 'inherit' }}>
                <AccessTimeIcon sx={{ mr: 1, fontSize: 20, color: tabValue === 0 ? '#F57C00' : 'inherit' }} />
                Pending
                <StatusChip
                  label={pendingSubmissions.length}
                  size="small"
                  sx={{ 
                    ml: 1,
                    bgcolor: tabValue === 0 ? '#F57C00' : undefined,
                    color: tabValue === 0 ? 'white' : undefined 
                  }}
                />
              </Box>
            }
          />
          <StyledTab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', color: tabValue === 1 ? '#388E3C' : 'inherit' }}>
                <CheckCircleOutlineIcon sx={{ mr: 1, fontSize: 20, color: tabValue === 1 ? '#388E3C' : 'inherit' }} />
                Approved
                <StatusChip
                  label={approvedSubmissions.length}
                  size="small"
                  sx={{ 
                    ml: 1,
                    bgcolor: tabValue === 1 ? '#388E3C' : undefined,
                    color: tabValue === 1 ? 'white' : undefined
                  }}
                />
              </Box>
            }
          />
          <StyledTab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', color: tabValue === 2 ? '#CC0000' : 'inherit' }}>
                <CancelOutlinedIcon sx={{ mr: 1, fontSize: 20, color: tabValue === 2 ? '#CC0000' : 'inherit' }} />
                Rejected
                <StatusChip
                  label={rejectedSubmissions.length}
                  size="small"
                  color={tabValue === 2 ? 'error' : 'default'}
                  sx={{ ml: 1 }}
                />
              </Box>
            }
          />
        </StyledTabs>
      </Box>
      
      {/* Content */}
      {currentSubmissions.length > 0 ? (
        <Grid container spacing={3}>
          {currentSubmissions.map((submission) => (
            <Grid item xs={12} md={6} lg={4} key={submission.id}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          backgroundColor: tabValue === 0 ? 'primary.light' : 
                                          tabValue === 1 ? 'success.light' : 'error.light',
                          color: '#fff',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}
                      >
                        {submission.avatar}
                      </Avatar>
                      <Box sx={{ ml: 1.5 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {submission.submitter}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {submission.timeAgo}
                        </Typography>
                      </Box>
                    </Box>
                    {tabValue === 1 && (
                      <StatusChip 
                        label="Approved" 
                        color="success" 
                        size="small"
                        icon={<CheckCircleOutlineIcon />}
                      />
                    )}
                    {tabValue === 2 && (
                      <StatusChip 
                        label="Rejected" 
                        color="error" 
                        size="small"
                        icon={<CancelOutlinedIcon />}
                      />
                    )}
                  </Box>
                  
                  <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
                    Submission #{submission.id}
                  </Typography>
                  
                  <Stack spacing={1.5} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarTodayIcon 
                        fontSize="small" 
                        sx={{ color: 'text.secondary', mr: 1, fontSize: 16 }} 
                      />
                      <Typography variant="body2" color="text.secondary">
                        Submitted: {submission.date}
                      </Typography>
                    </Box>
                    
                    {/* Conditional extra fields */}
                    {'approvedDate' in submission && submission.approvedDate && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleOutlineIcon 
                          fontSize="small" 
                          sx={{ color: 'success.main', mr: 1, fontSize: 16 }} 
                        />
                        <Typography variant="body2" color="success.main">
                          Approved: {submission.approvedDate} ({submission.approvedTimeAgo})
                        </Typography>
                      </Box>
                    )}
                    
                    {'rejectedDate' in submission && submission.rejectedDate && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CancelOutlinedIcon 
                          fontSize="small" 
                          sx={{ color: 'error.main', mr: 1, fontSize: 16 }} 
                        />
                        <Typography variant="body2" color="error.main">
                          Rejected: {submission.rejectedDate} ({submission.rejectedTimeAgo})
                        </Typography>
                      </Box>
                    )}
                    
                    {'reason' in submission && submission.reason && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 0.5 }}>
                        <InfoOutlinedIcon 
                          fontSize="small" 
                          sx={{ color: 'warning.main', mr: 1, fontSize: 16, mt: 0.3 }} 
                        />
                        <Typography variant="body2" color="text.primary">
                          <Box component="span" fontWeight={600} color="warning.main">Reason:</Box> {submission.reason}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
                    {submission.description}
                  </Typography>
                </CardContent>
                
                <CardActions 
                  sx={{ 
                    p: 2, 
                    pt: 0,
                    pb: 2.5,
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'nowrap'
                  }}
                >
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="inherit"
                    startIcon={<VisibilityOutlinedIcon />}
                    sx={{ 
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    View
                  </Button>
                  
                  {tabValue === 0 && (
                    <>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success"
                        startIcon={<CheckCircleOutlineIcon />}
                        sx={{ 
                          borderRadius: '20px',
                          textTransform: 'none',
                          fontWeight: 500,
                          boxShadow: 2
                        }}
                        onClick={() => handleApprove(submission)}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="error"
                        startIcon={<CancelOutlinedIcon />}
                        sx={{ 
                          borderRadius: '20px',
                          textTransform: 'none',
                          fontWeight: 500,
                          boxShadow: 2
                        }}
                        onClick={() => handleReject(submission)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {tabValue === 1 && (
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="error"
                      startIcon={<CancelOutlinedIcon />}
                      sx={{ 
                        borderRadius: '20px',
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: 2
                      }}
                      onClick={() => handleRevoke(submission)}
                    >
                      Revoke Access
                    </Button>
                  )}
                  
                  {tabValue === 2 && (
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="success"
                      startIcon={<CheckCircleOutlineIcon />}
                      sx={{ 
                        borderRadius: '20px',
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: 2
                      }}
                      onClick={() => handleReconsider(submission)}
                    >
                      Reconsider
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper 
          elevation={0}
          sx={{ 
            py: 8, 
            px: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          {getStatusIcon()}
          <Typography variant="h6" component="h3" sx={{ mt: 2, fontWeight: 600 }}>
            No {getTabLabel(tabValue)} submissions
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400, mt: 1 }}>
            There are currently no {getTabLabel(tabValue)} submissions in the system.
            {tabValue === 0 && ' New submissions will appear here when users request access.'}
          </Typography>
        </Paper>
      )}

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        message={notification.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: notification.type === 'success' ? 'success.main' : 
                    notification.type === 'error' ? 'error.main' :
                    notification.type === 'warning' ? 'warning.main' : 'info.main',
            fontWeight: 500,
          }
        }}
      />
    </Box>
  );
}