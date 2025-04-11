// app/pages/admin/approvals/page.tsx
import { 
    Typography, 
    Box, 
    Paper, 
    Card, 
    CardContent,
    CardActions,
    Button,
    Grid,
    Divider,
    Alert
  } from '@mui/material';
  
  export default function ManageApprovalsPage() {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Approvals
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          This page is a placeholder. The approvals management functionality will be implemented in the future.
          The client wants users to contact him regarding gaining access to the system. This page should be updated to allow the 
          admin to find someone's account (they must sign up through Clerk) and add them as an authorized user who can submit
          jobs. As of right now anyone can access the website and 'sign up'
        </Alert>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Submission #12345
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Submitted by: John Doe
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date: April 8, 2025
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">
                  An experimental mechanics challenge submission that needs review and approval.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">View Details</Button>
                <Button size="small" color="success">Approve</Button>
                <Button size="small" color="error">Reject</Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Submission #12346
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Submitted by: Jane Smith
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date: April 9, 2025
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">
                  Another experimental mechanics challenge submission awaiting review.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">View Details</Button>
                <Button size="small" color="success">Approve</Button>
                <Button size="small" color="error">Reject</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }