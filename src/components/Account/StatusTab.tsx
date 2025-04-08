"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Material UI components
import {
  Box, Typography, Paper,
  TableContainer, Table, TableHead,
  TableRow, TableCell, TableBody,
  Chip, Card, CardContent,
  LinearProgress, alpha, Tooltip,
  IconButton, Badge, Avatar
} from "@mui/material";

// Icons
import TokenIcon from '@mui/icons-material/Token';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarIcon from '@mui/icons-material/Star';

/**********************************************************************************/
// Mock data for Status tab
const currentTokens = 10;
const queueData = [
  { id: 1, name: "Experiment A", status: "Running", timeRemaining: "2h 15m", progress: 65 },
  { id: 2, name: "Experiment B", status: "Queued", timeRemaining: "4h 30m", progress: 0 },
  { id: 3, name: "Experiment C", status: "Queued", timeRemaining: "8h 45m", progress: 0 },
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
    energyAbsorbedPerUnitMass: 8.36,
    date: "2025-03-15"
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
    energyAbsorbedPerUnitMass: 9.26,
    date: "2025-03-10"
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
    energyAbsorbedPerUnitMass: 9.44,
    date: "2025-03-05"
  },
];
/**********************************************************************************/

// Status chip component
const StatusChip = ({ status }: { status: string }) => {
  let color: "success" | "warning" | "error" | "default" = "default";
  let icon = null;
  
  switch(status) {
    case "Running":
      color = "success";
      icon = <PlayArrowIcon fontSize="small" />;
      break;
    case "Queued":
      color = "warning";
      icon = <PauseIcon fontSize="small" />;
      break;
    case "Failed":
      color = "error";
      break;
    default:
      color = "default";
  }
  
  return (
    <Chip 
      label={status} 
      color={color} 
      size="small" 
      variant="outlined"
      sx={{ 
        fontWeight: 500,
        '& .MuiChip-icon': { 
          ml: 0.5 
        }
      }} 
    />
  );
};

export default function StatusTab() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: "800px" }}
      >
        {/* Token and Queue Card */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            mb: 4
          }}
        >
          <Box sx={{ 
            p: 2.5, 
            backgroundColor: alpha("#CC0000", 0.03),
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" fontWeight={500}>
              Resources & Queue
            </Typography>
            <Tooltip title="Learn more about tokens">
              <IconButton size="small">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Box sx={{ p: 3 }}>
            {/* Token Display */}
            <Card 
              elevation={0} 
              sx={{ 
                mb: 4, 
                backgroundColor: alpha("#CC0000", 0.05),
                borderRadius: 2,
                border: `1px solid ${alpha("#CC0000", 0.1)}`
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Tooltip title="Available tokens">
                      <Avatar sx={{ width: 22, height: 22, bgcolor: "#CC0000", fontSize: '0.75rem' }}>
                        {currentTokens}
                      </Avatar>
                    </Tooltip>
                  }
                >
                  <Avatar 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      bgcolor: alpha("#CC0000", 0.1),
                      color: "#CC0000"
                    }}
                  >
                    <TokenIcon fontSize="large" />
                  </Avatar>
                </Badge>
                <Box sx={{ ml: 3, flex: 1 }}>
                  <Typography variant="h5" fontWeight={600} color="#CC0000">
                    {currentTokens} Tokens
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available for new experiments
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            {/* Queue Display */}
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2 }}>
              Active Queue ({queueData.length})
            </Typography>
            
            {queueData.map((experiment, index) => (
              <Card 
                key={experiment.id}
                elevation={0}
                sx={{ 
                  mb: index !== queueData.length - 1 ? 2 : 0,
                  borderRadius: 2,
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: alpha("#CC0000", 0.3),
                    boxShadow: `0 4px 12px ${alpha("#CC0000", 0.08)}`
                  }
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle2" fontWeight={500}>
                        {experiment.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          ml: 1, 
                          color: 'text.secondary',
                          backgroundColor: alpha("#CC0000", 0.1),
                          px: 1,
                          py: 0.5,
                          borderRadius: 1
                        }}
                      >
                        ID: {experiment.id}
                      </Typography>
                    </Box>
                    <StatusChip status={experiment.status} />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon 
                      fontSize="small" 
                      sx={{ 
                        mr: 1, 
                        color: alpha("#CC0000", 0.7),
                        fontSize: '1rem'
                      }} 
                    />
                    <Typography variant="body2" color="text.secondary">
                      {experiment.timeRemaining} remaining
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flex: 1, mr: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={experiment.progress} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          backgroundColor: alpha("#CC0000", 0.1),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            backgroundColor: experiment.status === 'Running' 
                              ? "#CC0000"
                              : "#CC0000"
                          }
                        }} 
                      />
                    </Box>
                    <Typography variant="body2" fontWeight={500} color="text.secondary">
                      {experiment.progress}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}
      >

        {/* Previous Experiments Table */}
        <Paper 
          elevation={0} 
          sx={{ 
            width: "100%", 
            maxWidth: "1200px", 
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <Box sx={{ 
            p: 2.5, 
            backgroundColor: alpha("#CC0000", 0.03),
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" fontWeight={500}>
              Previous Experiments
            </Typography>
          </Box>
          
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: alpha("#CC0000", 0.03)
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: alpha("#CC0000", 0.03)
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: alpha("#CC0000", 0.03)
                    }}
                  >
                    Lattice
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: alpha("#CC0000", 0.03)
                    }}
                  >
                    F-D Curve
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: alpha("#CC0000", 0.03)
                    }}
                  >
                    Rank
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: alpha("#CC0000", 0.03)
                    }}
                  >
                    F (N)
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: alpha("#CC0000", 0.03)
                    }}
                  >
                    Unit Cell
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: alpha("#CC0000", 0.03)
                    }}
                  >
                    Mass (g)
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: alpha("#CC0000", 0.03)
                    }}
                  >
                    L_bend (mm)
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: alpha("#CC0000", 0.03)
                    }}
                  >
                    L_stretch (mm)
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: alpha("#CC0000", 0.03)
                    }}
                  >
                    L_rest (mm)
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: alpha("#CC0000", 0.03)
                    }}
                  >
                    Energy (J)
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: alpha("#CC0000", 0.03)
                    }}
                  >
                    Energy/Mass (J/g)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {previousExperimentsData.map((row, index) => (
                  <TableRow 
                    key={row.id}
                    hover
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      backgroundColor: hoveredRow === index ? alpha("#CC0000", 0.05) : 'inherit'
                    }}
                  >
                    <TableCell align="center">
                      <Chip 
                        label={`WAZL-${row.id}`} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          fontWeight: 500,
                          borderColor: "#CC0000",
                          color: "#CC0000"
                        }} 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {new Date(row.date).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <img 
                          src={row.latticeImage} 
                          alt={`Lattice ${row.id}`} 
                          width="80" 
                          height="80" 
                          style={{ 
                            borderRadius: '8px',
                            border: '1px solid rgba(0,0,0,0.1)'
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <img 
                          src={row.fdCurve} 
                          alt={`F-D Curve ${row.id}`} 
                          width="120" 
                          height="80" 
                          style={{ 
                            borderRadius: '8px',
                            border: '1px solid rgba(0,0,0,0.1)'
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Chip 
                          icon={<StarIcon sx={{ color: '#FFD700 !important' }} />}
                          label={row.rank} 
                          size="small" 
                          sx={{ 
                            backgroundColor: alpha('#FFD700', 0.1),
                            borderColor: alpha('#FFD700', 0.5),
                            color: '#B8860B',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={500}>
                        {row.force}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.unitCellType}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {row.mass}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {row.lBend}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {row.lStretch}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {row.lRest}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={500}>
                        {row.energyAbsorbed}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          color: "#CC0000",
                          backgroundColor: alpha("#CC0000", 0.1),
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          display: 'inline-block'
                        }}
                      >
                        {row.energyAbsorbedPerUnitMass}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: alpha("#CC0000", 0.03)
          }}>
            <Typography variant="body2" color="text.secondary">
              Showing {previousExperimentsData.length} experiments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last updated: {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}