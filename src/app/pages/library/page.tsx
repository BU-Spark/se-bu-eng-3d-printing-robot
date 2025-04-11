"use client";

import { useState } from 'react';

// Material-UI components
import { 
  Box, Typography, TextField, MenuItem, Grid, Paper, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControlLabel, Checkbox
} from '@mui/material';

export default function LibraryPage() {
  // State for filters
  const [showFDFigure, setShowFDFigure] = useState(true);
  const [partImageFilter, setPartImageFilter] = useState('Unit Cell');
  const [wadlIdFilter, setWadlIdFilter] = useState('Equals');
  const [unitCellTypeFilter, setUnitCellTypeFilter] = useState('');
  const [energyAbsorbedFilter, setEnergyAbsorbedFilter] = useState('Equals');
  const [energyPerMassFilter, setEnergyPerMassFilter] = useState('Equals');

  // Sample data for the table
  const experimentData = [
    {
      id: 1,
      //latticeImage: "/images/lattice1.jpg",
      //fdFigure: "/images/fd1.jpg",
      batch: 1,
      itId: "",
      unitCellType: "Octet",
      mass: 0.84,
      xBend: 0.44,
      xStretch: 0.44,
      xVert: 0,
      xJoint: 0.42,
      energyAbsorbed: 3.68,
      energyPerMass: 4.36
    },
    {
      id: 2,
      //latticeImage: "/images/lattice2.jpg",
      //fdFigure: "/images/fd2.jpg",
      batch: 1,
      itId: "166 178 171 221 204",
      unitCellType: "Octet",
      mass: 0.83,
      xBend: 0.38,
      xStretch: 0.38,
      xVert: 0,
      xJoint: 0.85,
      energyAbsorbed: 3.52,
      energyPerMass: 4.26
    },
    {
      id: 3,
      //latticeImage: "/images/lattice3.jpg",
      //fdFigure: "/images/fd3.jpg",
      batch: 1,
      itId: "",
      unitCellType: "Octet",
      mass: 0.81,
      xBend: 0.34,
      xStretch: 0.34,
      xVert: 0,
      xJoint: 1.01,
      energyAbsorbed: 3.6,
      energyPerMass: 4.44
    }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: '100%', mx: 'auto' }}>
      {/* Filter Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'flex-end' }}>
        {/* FD Figure Checkbox */}
        <Box sx={{ minWidth: 120 }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={showFDFigure}
                onChange={(e) => setShowFDFigure(e.target.checked)}
                color="primary"
              />
            }
            label="FD Figure"
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                fontSize: '0.875rem',
                fontWeight: 500
              } 
            }}
          />
        </Box>
        
        {/* Part Image */}
        <Box sx={{ minWidth: 180 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            Part Image
          </Typography>
          <TextField
            select
            value={partImageFilter}
            onChange={(e) => setPartImageFilter(e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
          >
            <MenuItem value="Unit Cell">Unit Cell</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Box>
        
        {/* WADL ID */}
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            WADL ID
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              select
              value={wadlIdFilter}
              onChange={(e) => setWadlIdFilter(e.target.value)}
              size="small"
              sx={{ width: 120 }}
            >
              <MenuItem value="Equals">Equals</MenuItem>
              <MenuItem value="Contains">Contains</MenuItem>
            </TextField>
            <TextField 
              placeholder="Enter a value" 
              size="small" 
              sx={{ width: 150 }}
            />
          </Box>
        </Box>
        
        {/* Unit Cell Type */}
        <Box sx={{ minWidth: 180 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            Unit Cell Type
          </Typography>
          <TextField
            select
            value={unitCellTypeFilter}
            onChange={(e) => setUnitCellTypeFilter(e.target.value)}
            fullWidth
            size="small"
          >
            <MenuItem value="">Select...</MenuItem>
            <MenuItem value="Octet">Octet</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Box>
        
        {/* Energy Absorbed */}
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            Energy Absorbed (J)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              select
              value={energyAbsorbedFilter}
              onChange={(e) => setEnergyAbsorbedFilter(e.target.value)}
              size="small"
              sx={{ width: 120 }}
            >
              <MenuItem value="Equals">Equals</MenuItem>
              <MenuItem value="Greater">Greater than</MenuItem>
              <MenuItem value="Less">Less than</MenuItem>
            </TextField>
            <TextField 
              placeholder="Enter a value" 
              size="small" 
              sx={{ width: 150 }}
            />
          </Box>
        </Box>
        
        {/* Energy Absorbed per Unit Mass */}
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            Energy Absorbed per Unit Mass (J/g)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              select
              value={energyPerMassFilter}
              onChange={(e) => setEnergyPerMassFilter(e.target.value)}
              size="small"
              sx={{ width: 120 }}
            >
              <MenuItem value="Equals">Equals</MenuItem>
              <MenuItem value="Greater">Greater than</MenuItem>
              <MenuItem value="Less">Less than</MenuItem>
            </TextField>
            <TextField 
              placeholder="Enter a value" 
              size="small" 
              sx={{ width: 150 }}
            />
          </Box>
        </Box>
      </Box>
      
      {/* Results Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>WADL ID</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>Lattice Image</TableCell>
              {showFDFigure && <TableCell align="center" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>F-D Figure</TableCell>}
              <TableCell align="center" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>Batch</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>IT ID</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>Unit Cell Type</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>Mass (g)</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>x_bend (mm)</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>x_stretch (mm)</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>x_vert (mm)</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>x_joint (mm)</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>Energy Absorbed (J)</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}>Energy Absorbed per Unit Mass (J/g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {experimentData.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{row.id}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={""} alt={`Lattice ${row.id}`} width="120" height="120" />
                  </Box>
                </TableCell>
                {showFDFigure && (
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <img src={""} alt={`F-D Figure ${row.id}`} width="180" height="120" />
                    </Box>
                  </TableCell>
                )}
                <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{row.batch}</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{row.itId}</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{row.unitCellType}</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{row.mass}</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{row.xBend}</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{row.xStretch}</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{row.xVert}</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{row.xJoint}</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{row.energyAbsorbed}</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{row.energyPerMass}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
