// app/pages/admin/page.tsx
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader 
} from '@mui/material';
import PeopleIcon from "@mui/icons-material/People";
import TokenIcon from "@mui/icons-material/Token";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";

export default function AdminPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, color: '#CC0000' }} />
              <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                52
              </Typography>
              <Typography color="text.secondary">
                Total Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TokenIcon sx={{ fontSize: 40, color: '#CC0000' }} />
              <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                145
              </Typography>
              <Typography color="text.secondary">
                Tokens Distributed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: 'green' }} />
              <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                23
              </Typography>
              <Typography color="text.secondary">
                Approved Submissions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <WarningIcon sx={{ fontSize: 40, color: 'orange' }} />
              <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                8
              </Typography>
              <Typography color="text.secondary">
                Pending Approvals
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No recent activities to display.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleIcon sx={{ color: 'green', mr: 1 }} />
              <Typography>All systems operational</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Last updated: April 10, 2025 09:45 AM
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}