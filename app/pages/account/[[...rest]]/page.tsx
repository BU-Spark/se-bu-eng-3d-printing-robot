"use client";

import { useUser, useSession } from "@clerk/nextjs";
import { CSSProperties, useState, useEffect } from "react";

// Material-UI components
import { 
  TextField, Typography, Box, Avatar, Paper, List, 
  ListItem, ListItemText, Divider, IconButton, 
  Tooltip, Snackbar, Tabs, Tab, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Grid,
  Button, Slider, MenuItem, FormControlLabel, Checkbox
} from "@mui/material";

// Material-UI icons
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

/**********************************************************************************/
// Styling
const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "80vh",
  padding: "20px",
  width: "100%"
};
const textFieldStyle: CSSProperties = {
  width: "100%",
};
const avatarStyle: CSSProperties = {
  width: "100px",
  height: "100px",
  marginBottom: "20px",
};
const sessionInfoStyle: CSSProperties = {
  width: "100%",
  maxWidth: "600px",
  marginTop: "20px",
  padding: "16px",
};
/**********************************************************************************/

// TabPanel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ width: "100%", display: "flex", justifyContent: "center" }}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Function to determine affiliation from email domain
function getAffiliationFromEmail(email: string | undefined): string {
  if (!email) return "";
  
  const domain = email.split('@')[1];
  if (!domain) return "";
  
  // Map of common educational domains to institution names
  const domainMap: Record<string, string> = {
    'bu.edu': 'Boston University',
    'harvard.edu': 'Harvard University',
    'mit.edu': 'Massachusetts Institute of Technology',
    'stanford.edu': 'Stanford University',
    'berkeley.edu': 'UC Berkeley',
    'columbia.edu': 'Columbia University',
    'yale.edu': 'Yale University',
    'cornell.edu': 'Cornell University',
    'princeton.edu': 'Princeton University',
    // Add more mappings as needed
  };
  
  return domainMap[domain] || domain;
}

export default function AccountPage() {
  // Keep track of user states and session data
  const { user } = useUser();
  const { session } = useSession();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [affiliation, setAffiliation] = useState("");
  const [tabValue, setTabValue] = useState(0);

  // State for design parameters
  const [c4BaseFace, setC4BaseFace] = useState(0.36);
  const [c8BaseFace, setC8BaseFace] = useState(-0.3);
  const [c4TopFace, setC4TopFace] = useState(0.384);
  const [c8TopFace, setC8TopFace] = useState(-0.36);
  const [linearTwist, setLinearTwist] = useState(0.754);
  const [oscillatingTwistAmplitude, setOscillatingTwistAmplitude] = useState(0);
  const [oscillatingTwistCycles, setOscillatingTwistCycles] = useState(0);
  const [topToBasePerimeterRatio, setTopToBasePerimeterRatio] = useState(1);
  const [height, setHeight] = useState(20);
  const [mass, setMass] = useState(3);
  const [wallThickness, setWallThickness] = useState(0.718);
  const [material, setMaterial] = useState("PLA");
  const [logScaleForces, setLogScaleForces] = useState(false);

  // Handle tab changes
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data for Status tab
  const currentTokens = 10;
  const queueData = [
    { id: 1, name: "Experiment A", status: "Running", timeRemaining: "2h 15m" },
    { id: 2, name: "Experiment B", status: "Queued", timeRemaining: "4h 30m" },
    { id: 3, name: "Experiment C", status: "Queued", timeRemaining: "8h 45m" },
  ];
  
  // Mock data for previous experiments based on the image
  const previousExperimentsData = [
    {
      id: 1,
      latticeImage: "/images/lattice.png",
      fdCurve: "/images/curve.png",
      rank: 1,
      force: 0.84,
      unitCellType: "Octet",
      mass: 0.44,
      lBend: 0.38,
      lStretch: 0,
      lRest: 0.42,
      energyAbsorbed: 3.68,
      energyAbsorbedPerUnitMass: 8.36
    },
    {
      id: 2,
      latticeImage: "/images/lattice.png",
      fdCurve: "/images/curve.png",
      rank: 1,
      force: 0.83,
      unitCellType: "Octet",
      mass: 0.38,
      lBend: 0.38,
      lStretch: 0,
      lRest: 0.45,
      energyAbsorbed: 3.52,
      energyAbsorbedPerUnitMass: 9.26
    },
    {
      id: 3,
      latticeImage: "/images/lattice.png",
      fdCurve: "/images/curve.png",
      rank: 1,
      force: 0.81,
      unitCellType: "Octet",
      mass: 0.34,
      lBend: 0.34,
      lStretch: 0,
      lRest: 0.51,
      energyAbsorbed: 3.6,
      energyAbsorbedPerUnitMass: 9.44
    }
  ];

  // Set initial affiliation based on email domain when user data loads
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const suggestedAffiliation = getAffiliationFromEmail(user.primaryEmailAddress.emailAddress);
      setAffiliation(suggestedAffiliation);
    }
  }, [user]);

  // If user is not signed in, display a message
  if (!user) {
    return (
      <Box sx={containerStyle}>
        <Typography variant="h6">Please sign in to view your account.</Typography>
      </Box>
    );
  }
  
  // Copy session ID to clipboard
  const copySessionId = () => {
    if (session?.id) {
      navigator.clipboard.writeText(session.id);
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={containerStyle}>
      {/* Tabs */}
      <Box sx={{ width: '100%', maxWidth: '1000px', mb: 4, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="INFO" />
          <Tab label="STATUS" />
          <Tab label="NEW EXP" />
        </Tabs>
      </Box>
      
      {/* Info Tab */}
      <TabPanel value={tabValue} index={0}>
        {/* User Info in horizontal layout */}
        <Grid container spacing={3} sx={{ maxWidth: '800px', justifyContent: 'center' }}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Name"
              variant="outlined"
              value={user.fullName || ""}
              sx={textFieldStyle}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Email"
              variant="outlined"
              value={user.primaryEmailAddress?.emailAddress || ""}
              sx={textFieldStyle}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Affiliation"
              variant="outlined"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder="Enter your affiliation"
              sx={textFieldStyle}
              disabled={affiliation !== "" && affiliation !== user.primaryEmailAddress?.emailAddress?.split('@')[1]}
              helperText={affiliation && affiliation !== user.primaryEmailAddress?.emailAddress?.split('@')[1] ? 
                "Affiliation detected from your email" : ""}
            />
          </Grid>
        </Grid>
        
        {/* Session Info */}
        <Paper elevation={2} sx={{ ...sessionInfoStyle, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Session Information
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Session ID" 
                secondary={session?.id ? `${session.id.substring(0, 12)}...` : "Not available"} 
              />
              <Tooltip title="Copy to clipboard">
                <IconButton edge="end" aria-label="copy" onClick={copySessionId}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Last Active" 
                secondary={session?.lastActiveAt ? new Date(session.lastActiveAt).toLocaleString() : "Not available"} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Expires" 
                secondary={session?.expireAt ? new Date(session.expireAt).toLocaleString() : "Not available"} 
              />
              <Tooltip title="When your current login session will end">
                <IconButton edge="end" size="small">
                  <Typography variant="caption">?</Typography>
                </IconButton>
              </Tooltip>
            </ListItem>
          </List>
        </Paper>
      </TabPanel>
      
      {/* Status Tab */}
      <TabPanel value={tabValue} index={1}>
        {/* Current Tokens */}
        <Paper elevation={2} sx={{ ...sessionInfoStyle, mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Current Tokens
          </Typography>
          <Typography variant="h4" align="center" sx={{ my: 2 }}>
            {currentTokens}
          </Typography>
        </Paper>
        
        {/* Queue Table */}
        <Paper elevation={2} sx={{ ...sessionInfoStyle, mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Queue
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Time Remaining</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queueData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell align="center">{row.timeRemaining}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        
        {/* Previous Experiments Table */}
        <Paper elevation={2} sx={{ width: '100%', maxWidth: '1000px', marginTop: '20px', padding: '16px', overflowX: 'auto', textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Previous Experiments
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">WAZL ID</TableCell>
                  <TableCell align="center">Lattice Image</TableCell>
                  <TableCell align="center">F-D Curve</TableCell>
                  <TableCell align="center">Rank</TableCell>
                  <TableCell align="center">F (N)</TableCell>
                  <TableCell align="center">Unit Cell Type</TableCell>
                  <TableCell align="center">Mass (g)</TableCell>
                  <TableCell align="center">L_bend (mm)</TableCell>
                  <TableCell align="center">L_stretch (mm)</TableCell>
                  <TableCell align="center">L_rest (mm)</TableCell>
                  <TableCell align="center">Energy Absorbed (J)</TableCell>
                  <TableCell align="center">Energy Absorbed per Unit Mass (J/g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {previousExperimentsData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={row.latticeImage} alt={`Lattice ${row.id}`} width="80" height="80" />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={row.fdCurve} alt={`F-D Curve ${row.id}`} width="120" height="80" />
                      </Box>
                    </TableCell>
                    <TableCell align="center">{row.rank}</TableCell>
                    <TableCell align="center">{row.force}</TableCell>
                    <TableCell align="center">{row.unitCellType}</TableCell>
                    <TableCell align="center">{row.mass}</TableCell>
                    <TableCell align="center">{row.lBend}</TableCell>
                    <TableCell align="center">{row.lStretch}</TableCell>
                    <TableCell align="center">{row.lRest}</TableCell>
                    <TableCell align="center">{row.energyAbsorbed}</TableCell>
                    <TableCell align="center">{row.energyAbsorbedPerUnitMass}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>
      
      {/* New Exp Tab - Forward Design Dashboard */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ maxWidth: '1000px', width: '100%' }}>
          <Typography variant="h5" gutterBottom align="center">
            Forward Design Dashboard
          </Typography>
          <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 3 }}>
            Interactively create and visualize GCS and observe their predicted performance.
          </Typography>
          
          <Grid container spacing={3}>
            {/* Left panel - Design Parameters */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Design Parameters
              </Typography>
              
              {/* c4 (base face) */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">c4 (base face):</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider 
                    value={c4BaseFace}
                    onChange={(e, newValue) => setC4BaseFace(newValue as number)}
                    min={-1} 
                    max={1} 
                    step={0.01} 
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField 
                    size="small" 
                    value={c4BaseFace}
                    onChange={(e) => setC4BaseFace(Number(e.target.value))}
                    sx={{ width: '80px' }} 
                  />
                </Box>
              </Box>
              
              {/* c8 (base face) */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">c8 (base face):</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider 
                    value={c8BaseFace}
                    onChange={(e, newValue) => setC8BaseFace(newValue as number)}
                    min={-1} 
                    max={1} 
                    step={0.01} 
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField 
                    size="small" 
                    value={c8BaseFace}
                    onChange={(e) => setC8BaseFace(Number(e.target.value))}
                    sx={{ width: '80px' }} 
                  />
                </Box>
              </Box>
              
              {/* c4 (top face) */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">c4 (top face):</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider 
                    value={c4TopFace}
                    onChange={(e, newValue) => setC4TopFace(newValue as number)}
                    min={-1} 
                    max={1} 
                    step={0.001} 
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField 
                    size="small"
                    value={c4TopFace}
                    onChange={(e) => setC4TopFace(Number(e.target.value))}
                    sx={{ width: '80px' }}
                  />
                </Box>
              </Box>

              {/* c8 (top face) */} 
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">c8 (top face):</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider 
                    value={c8TopFace}
                    onChange={(e, newValue) => setC8TopFace(newValue as number)}
                    min={-1} 
                    max={1} 
                    step={0.01} 
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField 
                    size="small" 
                    value={c8TopFace}
                    onChange={(e) => setC8TopFace(Number(e.target.value))}
                    sx={{ width: '80px' }} 
                  />
                </Box>
              </Box>
          
              {/* Linear twist (rad) */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Linear twist (rad):</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider 
                    value={linearTwist}
                    onChange={(e, newValue) => setLinearTwist(newValue as number)}
                    min={0} 
                    max={3.14} 
                    step={0.001} 
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField 
                    size="small" 
                    value={linearTwist}
                    onChange={(e) => setLinearTwist(Number(e.target.value))}
                    sx={{ width: '80px' }} 
                  />
                </Box>
              </Box>
          
              {/* Oscillating twist amplitude (rad) */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Oscillating twist amplitude (rad):</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider 
                    value={oscillatingTwistAmplitude}
                    onChange={(e, newValue) => setOscillatingTwistAmplitude(newValue as number)}
                    min={0} 
                    max={3.14} 
                    step={0.01} 
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField 
                    size="small" 
                    value={oscillatingTwistAmplitude}
                    onChange={(e) => setOscillatingTwistAmplitude(Number(e.target.value))}
                    sx={{ width: '80px' }} 
                  />
                </Box>
              </Box>
          
              {/* Oscillating twist cycles */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Oscillating twist cycles:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider 
                    value={oscillatingTwistCycles}
                    onChange={(e, newValue) => setOscillatingTwistCycles(newValue as number)}
                    min={0} 
                    max={10} 
                    step={1} 
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField 
                    size="small" 
                    value={oscillatingTwistCycles}
                    onChange={(e) => setOscillatingTwistCycles(Number(e.target.value))}
                    sx={{ width: '80px' }} 
                  />
                </Box>
              </Box>
          
              {/* Top to base perimeter ratio */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Top to base perimeter ratio:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider 
                    value={topToBasePerimeterRatio}
                    onChange={(e, newValue) => setTopToBasePerimeterRatio(newValue as number)}
                    min={0.1} 
                    max={2} 
                    step={0.1} 
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField 
                    size="small" 
                    value={topToBasePerimeterRatio}
                    onChange={(e) => setTopToBasePerimeterRatio(Number(e.target.value))}
                    sx={{ width: '80px' }} 
                  />
                </Box>
              </Box>
          
              {/* Height (mm) */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Height (mm):</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider 
                    value={height}
                    onChange={(e, newValue) => setHeight(newValue as number)}
                    min={5} 
                    max={50} 
                    step={1} 
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField 
                    size="small" 
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    sx={{ width: '80px' }} 
                  />
                </Box>
              </Box>
          
              {/* Mass (g) */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Mass (g):</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider 
                    value={mass}
                    onChange={(e, newValue) => setMass(newValue as number)}
                    min={1} 
                    max={10} 
                    step={0.1} 
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField 
                    size="small" 
                    value={mass}
                    onChange={(e) => setMass(Number(e.target.value))}
                    sx={{ width: '80px' }} 
                  />
                </Box>
              </Box>
          
              {/* Wall thickness (mm) */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Wall thickness (mm):</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider 
                    value={wallThickness}
                    onChange={(e, newValue) => setWallThickness(newValue as number)}
                    min={0.1} 
                    max={2} 
                    step={0.001} 
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField 
                    size="small" 
                    value={wallThickness}
                    onChange={(e) => setWallThickness(Number(e.target.value))}
                    sx={{ width: '80px' }} 
                  />
                </Box>
              </Box>
          
              {/* Material dropdown */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Material:</Typography>
                <TextField
                  select
                  fullWidth
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  size="small"
                >
                  <MenuItem value="PLA">PLA</MenuItem>
                  <MenuItem value="ABS">ABS</MenuItem>
                  <MenuItem value="PETG">PETG</MenuItem>
                  <MenuItem value="TPU">TPU</MenuItem>
                </TextField>
              </Box>
              
              {/* Log scale forces checkbox */}
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={logScaleForces}
                      onChange={(e) => setLogScaleForces(e.target.checked)}
                    />
                  }
                  label="Log scale forces"
                />
              </Box>
          
              {/* Update button */}
              <Button 
                variant="contained" 
                color="primary"
                sx={{ mb: 2 }}
              >
                Update
              </Button>
            </Grid>
        
            {/* Right panel - Design visualization (expanded) */}
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Design
                </Typography>
                <Box 
                  sx={{ 
                    flexGrow: 1,
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    p: 2,
                    mb: 2,
                    minHeight: '400px'
                  }}
                >
                  <Box 
                    component="img"
                    src="/images/3d-structure.png"
                    alt="3D Structure Visualization"
                    sx={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </Box>
            
                {/* Control buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" size="small" sx={{ minWidth: '40px' }}>
                      <AddIcon />
                    </Button>
                    <Button variant="contained" size="small" sx={{ minWidth: '40px' }}>
                      <RemoveIcon />
                    </Button>
                  </Box>
                  
                  {/* Submit button */}
                  <Button 
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </TabPanel>

      {/* Snackbar for copy notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Session ID copied to clipboard"
      />
    </Box>
  );
}
