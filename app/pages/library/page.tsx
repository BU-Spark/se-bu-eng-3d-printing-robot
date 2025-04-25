"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  IconButton,
  Chip,
  InputAdornment,
  alpha,
  ThemeProvider,
  createTheme,
  useTheme,
} from "@mui/material";

// Icons
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type CustomTheme = ReturnType<typeof createTheme>;

const createCustomTheme = (baseTheme: CustomTheme): CustomTheme =>
  createTheme({
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      primary: {
        main: "#CC0000",
        light: "#FF3333",
        dark: "#990000",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#333333",
        light: "#666666",
        dark: "#000000",
        contrastText: "#FFFFFF",
      },
    },
  });

export default function LibraryPage() {
  const baseTheme = useTheme();
  const theme = createCustomTheme(baseTheme);

  // State for filters
  const [showFDFigure, setShowFDFigure] = useState(true);
  const [partImageFilter, setPartImageFilter] = useState("Unit Cell");
  const [wadlIdFilter, setWadlIdFilter] = useState("Equals");
  const [wadlIdValue, setWadlIdValue] = useState("");
  const [unitCellTypeFilter, setUnitCellTypeFilter] = useState("");
  const [energyAbsorbedFilter, setEnergyAbsorbedFilter] = useState("Equals");
  const [energyAbsorbedValue, setEnergyAbsorbedValue] = useState("");
  const [energyPerMassFilter, setEnergyPerMassFilter] = useState("Equals");
  const [energyPerMassValue, setEnergyPerMassValue] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  // Sample data for the table
  const experimentData = [
    {
      id: 1,
      latticeImage: "/images/lattice.png",
      fdFigure: "/images/curve.png",
      batch: 1,
      itId: "",
      unitCellType: "Octet",
      mass: 0.84,
      xBend: 0.44,
      xStretch: 0.44,
      xVert: 0,
      xJoint: 0.42,
      energyAbsorbed: 3.68,
      energyPerMass: 4.36,
    },
    {
      id: 2,
      latticeImage: "/images/lattice.png",
      fdFigure: "/images/curve.png",
      batch: 1,
      itId: "166 178 171 221 204",
      unitCellType: "Octet",
      mass: 0.83,
      xBend: 0.38,
      xStretch: 0.38,
      xVert: 0,
      xJoint: 0.85,
      energyAbsorbed: 3.52,
      energyPerMass: 4.26,
    },
    {
      id: 3,
      latticeImage: "/images/lattice.png",
      fdFigure: "/images/curve.png",
      batch: 1,
      itId: "",
      unitCellType: "Octet",
      mass: 0.81,
      xBend: 0.34,
      xStretch: 0.34,
      xVert: 0,
      xJoint: 1.01,
      energyAbsorbed: 3.6,
      energyPerMass: 4.44,
    },
  ];

  // Count active filters
  const activeFiltersCount = [
    wadlIdValue !== "",
    unitCellTypeFilter !== "",
    energyAbsorbedValue !== "",
    energyPerMassValue !== "",
  ].filter(Boolean).length;

  // Clear all filters
  const clearFilters = () => {
    setWadlIdValue("");
    setUnitCellTypeFilter("");
    setEnergyAbsorbedValue("");
    setEnergyPerMassValue("");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "100%" }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            fontWeight="bold"
            color="black"
          >
            Lattice Library
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={() => setShowFDFigure(!showFDFigure)}
              sx={{
                bgcolor: showFDFigure
                  ? alpha(theme.palette.primary.main, 0.1)
                  : "transparent",
                "&:hover": {
                  bgcolor: showFDFigure
                    ? alpha(theme.palette.primary.main, 0.2)
                    : alpha(theme.palette.grey[500], 0.1),
                },
              }}
              title={showFDFigure ? "Hide F-D Figures" : "Show F-D Figures"}
            >
              {showFDFigure ? (
                <VisibilityIcon sx={{ color: theme.palette.primary.main }} />
              ) : (
                <VisibilityOffIcon />
              )}
            </IconButton>

            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                bgcolor: showFilters
                  ? alpha(theme.palette.primary.main, 0.1)
                  : "transparent",
                "&:hover": {
                  bgcolor: showFilters
                    ? alpha(theme.palette.primary.main, 0.2)
                    : alpha(theme.palette.grey[500], 0.1),
                },
              }}
            >
              <FilterListIcon
                sx={{
                  color: showFilters ? theme.palette.primary.main : "action",
                }}
              />
            </IconButton>

            {activeFiltersCount > 0 && (
              <Chip
                label={`${activeFiltersCount} filter${activeFiltersCount > 1 ? "s" : ""}`}
                size="small"
                color="primary"
                onDelete={clearFilters}
                sx={{ height: "32px" }}
              />
            )}
          </Box>
        </Box>

        {/* Filter Section */}
        {showFilters && (
          <Card sx={{ mb: 3, overflow: "visible" }} elevation={2}>
            <CardContent sx={{ pt: 2, pb: 2, "&:last-child": { pb: 2 } }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                  gap: 3,
                }}
              >
                {/* Part Image */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    }}
                  >
                    Part Image
                  </Typography>
                  <TextField
                    select
                    value={partImageFilter}
                    onChange={(e) => setPartImageFilter(e.target.value)}
                    fullWidth
                    size="small"
                    variant="outlined"
                    color="primary"
                  >
                    <MenuItem value="Unit Cell">Unit Cell</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Box>

                {/* WADL ID */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    }}
                  >
                    WADL ID
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      select
                      value={wadlIdFilter}
                      onChange={(e) => setWadlIdFilter(e.target.value)}
                      size="small"
                      sx={{ width: "40%" }}
                      color="primary"
                    >
                      <MenuItem value="Equals">Equals</MenuItem>
                      <MenuItem value="Contains">Contains</MenuItem>
                    </TextField>
                    <TextField
                      placeholder="Enter ID"
                      size="small"
                      value={wadlIdValue}
                      onChange={(e) => setWadlIdValue(e.target.value)}
                      sx={{ width: "60%" }}
                      color="primary"
                      InputProps={{
                        endAdornment: wadlIdValue && (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => setWadlIdValue("")}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>

                {/* Unit Cell Type */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    }}
                  >
                    Unit Cell Type
                  </Typography>
                  <TextField
                    select
                    value={unitCellTypeFilter}
                    onChange={(e) => setUnitCellTypeFilter(e.target.value)}
                    fullWidth
                    size="small"
                    color="primary"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Octet">Octet</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Box>

                {/* Energy Absorbed */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    }}
                  >
                    Energy Absorbed (J)
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      select
                      value={energyAbsorbedFilter}
                      onChange={(e) => setEnergyAbsorbedFilter(e.target.value)}
                      size="small"
                      sx={{ width: "40%" }}
                      color="primary"
                    >
                      <MenuItem value="Equals">Equals</MenuItem>
                      <MenuItem value="Greater">Greater than</MenuItem>
                      <MenuItem value="Less">Less than</MenuItem>
                    </TextField>
                    <TextField
                      placeholder="Value"
                      size="small"
                      type="number"
                      value={energyAbsorbedValue}
                      onChange={(e) => setEnergyAbsorbedValue(e.target.value)}
                      sx={{ width: "60%" }}
                      color="primary"
                      InputProps={{
                        endAdornment: energyAbsorbedValue && (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => setEnergyAbsorbedValue("")}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>

                {/* Energy Absorbed per Unit Mass */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    }}
                  >
                    Energy Absorbed per Unit Mass (J/g)
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      select
                      value={energyPerMassFilter}
                      onChange={(e) => setEnergyPerMassFilter(e.target.value)}
                      size="small"
                      sx={{ width: "40%" }}
                      color="primary"
                    >
                      <MenuItem value="Equals">Equals</MenuItem>
                      <MenuItem value="Greater">Greater than</MenuItem>
                      <MenuItem value="Less">Less than</MenuItem>
                    </TextField>
                    <TextField
                      placeholder="Value"
                      size="small"
                      type="number"
                      value={energyPerMassValue}
                      onChange={(e) => setEnergyPerMassValue(e.target.value)}
                      sx={{ width: "60%" }}
                      color="primary"
                      InputProps={{
                        endAdornment: energyPerMassValue && (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => setEnergyPerMassValue("")}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>

                {/* Search field (could be functional in a real app) */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    }}
                  >
                    Quick Search
                  </Typography>
                  <TextField
                    placeholder="Search all fields..."
                    size="small"
                    fullWidth
                    color="primary"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Results Table */}
        <Card elevation={2}>
          <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}
                  >
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        py: 1.5,
                        color: theme.palette.primary.main,
                        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    >
                      WADL ID
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        py: 1.5,
                        color: theme.palette.primary.main,
                        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    >
                      Lattice Image
                    </TableCell>
                    {showFDFigure && (
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          py: 1.5,
                          color: theme.palette.primary.main,
                          borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        }}
                      >
                        F-D Figure
                      </TableCell>
                    )}
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        py: 1.5,
                        color: theme.palette.primary.main,
                        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    >
                      Batch
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        py: 1.5,
                        color: theme.palette.primary.main,
                        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    >
                      IT ID
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        py: 1.5,
                        color: theme.palette.primary.main,
                        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    >
                      Unit Cell Type
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        py: 1.5,
                        color: theme.palette.primary.main,
                        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    >
                      Mass (g)
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        py: 1.5,
                        color: theme.palette.primary.main,
                        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    >
                      x_bend (mm)
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        py: 1.5,
                        color: theme.palette.primary.main,
                        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    >
                      x_stretch (mm)
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        py: 1.5,
                        color: theme.palette.primary.main,
                        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    >
                      x_vert (mm)
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        py: 1.5,
                        color: theme.palette.primary.main,
                        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    >
                      x_joint (mm)
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        py: 1.5,
                        color: theme.palette.primary.main,
                        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    >
                      Energy Absorbed (J)
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        py: 1.5,
                        color: theme.palette.primary.main,
                        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    >
                      Energy per Mass (J/g)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {experimentData.map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        },
                        bgcolor:
                          index % 2 === 0
                            ? alpha(theme.palette.grey[50], 0.5)
                            : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          color: theme.palette.primary.main,
                        }}
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="center" sx={{ p: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Box
                            component="img"
                            src={row.latticeImage}
                            alt={`Lattice ${row.id}`}
                            sx={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: 1,
                              border: `1px solid ${theme.palette.divider}`,
                            }}
                          />
                        </Box>
                      </TableCell>
                      {showFDFigure && (
                        <TableCell align="center" sx={{ p: 1 }}>
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Box
                              component="img"
                              src={row.fdFigure}
                              alt={`F-D Figure ${row.id}`}
                              sx={{
                                width: "150px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: 1,
                                border: `1px solid ${theme.palette.divider}`,
                              }}
                            />
                          </Box>
                        </TableCell>
                      )}
                      <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                        {row.batch}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                        {row.itId || "-"}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row.unitCellType}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.7rem",
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.dark,
                            borderRadius: "4px",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                        {row.mass}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                        {row.xBend}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                        {row.xStretch}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                        {row.xVert}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                        {row.xJoint}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          color: theme.palette.primary.main,
                        }}
                      >
                        {row.energyAbsorbed}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          color: theme.palette.primary.main,
                        }}
                      >
                        {row.energyPerMass}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Simple pagination footer (could be expanded in a real app) */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {experimentData.length} of {experimentData.length}{" "}
                results
              </Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  label="1"
                  size="small"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
