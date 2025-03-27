"use client";

import { CSSProperties } from "react";

// Material UI components
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

/**********************************************************************************/
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
    energyAbsorbedPerUnitMass: 8.36,
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
  },
];
/**********************************************************************************/

/**********************************************************************************/
// Styling
const sessionInfoStyle: CSSProperties = {
  width: "100%",
  maxWidth: "600px",
  marginTop: "20px",
  padding: "16px",
};
/**********************************************************************************/

export default function StatusTab() {
  return (
    <>
      {/* Current Tokens */}
      <Paper
        elevation={2}
        sx={{ ...sessionInfoStyle, mb: 3, textAlign: "center" }}
      >
        <Typography variant="h6" gutterBottom>
          Current Tokens
        </Typography>
        <Typography variant="h4" align="center" sx={{ my: 2 }}>
          {currentTokens}
        </Typography>
      </Paper>

      {/* Queue Table */}
      <Paper
        elevation={2}
        sx={{ ...sessionInfoStyle, mb: 3, textAlign: "center" }}
      >
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
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: "1000px",
          marginTop: "20px",
          padding: "16px",
          overflowX: "auto",
          textAlign: "center",
        }}
      >
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
                <TableCell align="center">
                  Energy Absorbed per Unit Mass (J/g)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {previousExperimentsData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{row.id}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <img
                        src={row.latticeImage}
                        alt={`Lattice ${row.id}`}
                        width="80"
                        height="80"
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
                      />
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
                  <TableCell align="center">
                    {row.energyAbsorbedPerUnitMass}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
