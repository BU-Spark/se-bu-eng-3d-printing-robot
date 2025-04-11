"use client";
import { useState, useEffect } from "react";
import {
  Box, Typography, TextField,
  Paper, Table, TableBody,
  TableCell, TableContainer, TableHead,
  TableRow, Button, InputAdornment,
  FormControl, Select, MenuItem,
  InputLabel, SelectChangeEvent, IconButton,
  Tooltip, Chip, CircularProgress,
  useTheme, useMediaQuery, Card,
  Divider, createTheme, ThemeProvider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

const theme = createTheme({
  palette: {
    primary: {
      main: '#CC0000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#CC0000',
    },
  },
});

// Custom debounce hook 
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface LeaderboardEntry {
  Request_ID: number;
  Toughness: number | null;
  RecordedMass: number | null;
  CriticalStress: number | null;
  TargetHeight: number | null;
  ratio: number | null;
}

interface Filter {
  field: string;
  value: string;
}

const sortOptions = [
  { value: "ratio", label: "Toughness/Mass" },
  { value: "Toughness", label: "Toughness" },
  { value: "RecordedMass", label: "Recorded Mass" },
  { value: "CriticalStress", label: "Critical Stress" },
  { value: "TargetHeight", label: "Target Height" },
  { value: "Request_ID", label: "Experiment ID" },
];

function LeaderboardContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPageToFetch, setNextPageToFetch] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("ratio");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showingMore, setShowingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [currentFilterField, setCurrentFilterField] = useState("ratio");
  
  // Debounce the search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Get the current search field label for display purposes
  const getCurrentSearchFieldLabel = () => {
    const option = sortOptions.find(opt => opt.value === currentFilterField);
    return option ? option.label : "Experiment ID";
  };

  // Combined fetchData function with filter support
  const fetchData = async (
    resetData: boolean = false,
    explicitValues?: {
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      search?: string;
      filters?: Filter[];
    }
  ) => {
    setIsLoading(true);
    try {
      const pageToFetch = resetData ? 1 : nextPageToFetch;
      
      const queryParams = new URLSearchParams({
        page: pageToFetch.toString(),
        pageSize: resetData ? '20' : '10',
        sortBy: explicitValues?.sortBy || sortBy,
        sortOrder: explicitValues?.sortOrder || sortOrder,
      });

      const filtersToUse = explicitValues?.filters || activeFilters;
      
      // Apply all active filters
      filtersToUse.forEach(filter => {
        queryParams.append("searchField", filter.field);
        queryParams.append("searchValue", filter.value);
      });

      // Apply current search if not already covered by filters
      const searchValue = explicitValues?.search !== undefined 
        ? explicitValues.search 
        : debouncedSearchTerm;
        
      if (searchValue && !filtersToUse.some(f => f.field === currentFilterField)) {
        queryParams.append("searchField", currentFilterField);
        queryParams.append("searchValue", searchValue);
      }

      const response = await fetch(`/api/leaderboard?${queryParams}`);
      
      if (!response.ok) throw new Error("Failed to fetch data");
      
      const newData: LeaderboardEntry[] = await response.json();
      
      // Check if we received fewer items than requested, indicating no more data
      setHasMoreData(newData.length === (resetData ? 20 : 10));
      
      if (resetData) {
        setLeaderboardData(newData);
        setNextPageToFetch(3); 
      } else {
        setLeaderboardData(prev => {
          const existingIds = new Set(prev.map(entry => entry.Request_ID));
          return [...prev, ...newData.filter(entry => !existingIds.has(entry.Request_ID))];
        });
        setNextPageToFetch(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFilter = () => {
    if (!searchTerm.trim()) return;
    
    const newFilter = {
      field: currentFilterField,
      value: searchTerm.trim()
    };
    
    const filterExists = activeFilters.some(
      f => f.field === newFilter.field && f.value === newFilter.value
    );
    
    if (!filterExists) {
      const updatedFilters = [...activeFilters, newFilter];
      setActiveFilters(updatedFilters);
      setSearchTerm("");
      fetchData(true, { filters: updatedFilters });
    }
  };

  const removeFilter = (filterToRemove: Filter) => {
    const updatedFilters = activeFilters.filter(
      f => !(f.field === filterToRemove.field && f.value === filterToRemove.value)
    );
    setActiveFilters(updatedFilters);
    fetchData(true, { filters: updatedFilters });
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchTerm("");
    fetchData(true, { filters: [] });
  };

  // Control handlers
  const handleSortChange = (event: SelectChangeEvent) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
    setCurrentFilterField(newSortBy);
    setSearchTerm("");
    fetchData(true, { sortBy: newSortBy, search: "" });
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => {
      const newOrder = prev === "asc" ? "desc" : "asc";
      fetchData(true, { sortOrder: newOrder });
      return newOrder;
    });
  };

  const handleShowMore = () => {
    fetchData(false);
    setShowingMore(true);
  };

  const handleHideExtra = () => {
    fetchData(true);
    setShowingMore(false);
  };

  const handleRefresh = () => {
    fetchData(true);
  };

  // Effect to listen for Enter key to add filter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && searchTerm.trim()) {
        addFilter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm, currentFilterField]);

  // Initial load with cleanup 
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await fetchData(true);
      }
    };
    
    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatValue = (value: any): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return "-";
    }
    try {
      const numValue = Number(value);
      return numValue.toFixed(4);
    } catch (error) {
      console.error("Error formatting value:", value, error);
      return "-";
    }
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      maxWidth: "1200px", 
      mx: "auto",
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      <Card elevation={0} sx={{ 
        borderRadius: 3, 
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        mb: 4
      }}>
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column',
          background: `linear-gradient(145deg, #CC000015, ${theme.palette.primary.main}15)`,
        }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Leaderboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and compare experiment performance metrics
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ 
          p: 3, 
          display: "flex", 
          flexWrap: "wrap", 
          gap: 2, 
          alignItems: "center",
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <TextField
            placeholder={`Filter by ${getCurrentSearchFieldLabel()} (press Enter to add)`}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              flexGrow: 1, 
              minWidth: isMobile ? "100%" : "250px",
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 0 0 2px rgba(0,0,0,0.05)'
                },
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <Tooltip title="Add filter">
                    <IconButton
                      edge="end"
                      onClick={addFilter}
                      size="small"
                      sx={{
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main + '10',
                        }
                      }}
                    >
                      <FilterListIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'center',
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'space-between' : 'flex-start'
          }}>
            <FormControl size="small" sx={{ 
              minWidth: isMobile ? "calc(100% - 96px)" : 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}>
              <InputLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FilterListIcon fontSize="small" />
                  <span>Filter Field</span>
                </Box>
              </InputLabel>
              <Select 
                value={currentFilterField} 
                label="Filter Field" 
                onChange={(e) => setCurrentFilterField(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tooltip title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
              <IconButton 
                onClick={toggleSortOrder} 
                color="primary"
                sx={{ 
                  bgcolor: theme.palette.primary.main + '10',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: theme.palette.primary.main + '20',
                  }
                }}
              >
                {sortOrder === 'asc' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Refresh data">
              <IconButton 
                onClick={handleRefresh} 
                color="primary"
                sx={{ 
                  bgcolor: theme.palette.primary.main + '10',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: theme.palette.primary.main + '20',
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Card>

      {(activeFilters.length > 0 || debouncedSearchTerm) && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" mr={1}>
              Filters:
            </Typography>
            
            {activeFilters.map((filter, index) => (
              <Chip
                key={`${filter.field}-${filter.value}-${index}`}
                label={`${sortOptions.find(opt => opt.value === filter.field)?.label || filter.field}: ${filter.value}`}
                onDelete={() => removeFilter(filter)}
                size="small"
                color="primary"
                variant="outlined"
                deleteIcon={<CloseIcon />}
                sx={{ 
                  mr: 1,
                  '& .MuiChip-deleteIcon': {
                    color: theme.palette.primary.main,
                    '&:hover': {
                      color: theme.palette.primary.dark,
                    }
                  }
                }}
              />
            ))}
            
            {debouncedSearchTerm && !activeFilters.some(f => f.field === currentFilterField && f.value === debouncedSearchTerm) && (
              <Chip 
                label={`${getCurrentSearchFieldLabel()}: ${debouncedSearchTerm}`}
                onDelete={() => setSearchTerm('')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            
            {activeFilters.length > 0 && (
              <Button
                size="small"
                onClick={clearAllFilters}
                sx={{
                  ml: 1,
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.error.main,
                  }
                }}
              >
                Clear all
              </Button>
            )}
          </Box>
        </Box>
      )}

      <Card elevation={0} sx={{ 
        borderRadius: 3, 
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>
        <TableContainer sx={{ 
          position: 'sticky',
          top: 0,
          zIndex: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.text.primary
                }}>Experiment ID</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.text.primary
                }}>Toughness</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.text.primary
                }}>Mass</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.text.primary
                }}>Toughness/Mass</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.text.primary
                }}>Critical Stress</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.text.primary
                }}>Target Height</TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>

        {/* Scrollable table body */}
        <TableContainer sx={{ 
          position: 'relative',
          minHeight: '200px',
          maxHeight: '500px',
          overflow: 'auto',
          flexGrow: 1
        }}>
          <Table stickyHeader>
            <TableBody>
              {isLoading && leaderboardData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={30} thickness={4} />
                    <Typography variant="body2" color="text.secondary" mt={2}>
                      Loading data...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : leaderboardData.length > 0 ? (
                leaderboardData.map((entry: LeaderboardEntry, index) => (
                  <TableRow 
                    key={entry.Request_ID}
                    sx={{ 
                      '&:nth-of-type(odd)': { 
                        bgcolor: theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.03)' 
                          : 'rgba(0,0,0,0.02)' 
                      },
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.07)' 
                          : 'rgba(0,0,0,0.04)'
                      },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'medium' }}>{entry.Request_ID}</TableCell>
                    <TableCell>{formatValue(entry.Toughness)}</TableCell>
                    <TableCell>{formatValue(entry.RecordedMass)}</TableCell>
                    <TableCell sx={{ 
                      color: sortBy === 'ratio' ? theme.palette.primary.main : 'inherit',
                      fontWeight: sortBy === 'ratio' ? 'bold' : 'inherit'
                    }}>
                      {formatValue(entry.ratio)}
                    </TableCell>
                    <TableCell>{formatValue(entry.CriticalStress)}</TableCell>
                    <TableCell>{formatValue(entry.TargetHeight)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography variant="body1" color="text.secondary">
                      No data found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Try adjusting your search criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {isLoading && leaderboardData.length > 0 && (
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.7)',
              zIndex: 1
            }}>
              <CircularProgress size={40} />
            </Box>
          )}
        </TableContainer>

        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0,
          position: 'sticky',
          bottom: 0,
          bgcolor: theme.palette.background.paper,
          zIndex: 2
        }}>
          <Typography variant="body2" color="text.secondary">
            Showing {leaderboardData.length} entries
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'space-between' : 'flex-end'
          }}>
            {showingMore && (
              <Button
                variant="outlined"
                color="inherit"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium'
                }}
                disabled={isLoading}
                onClick={handleHideExtra}
                startIcon={<ArrowUpwardIcon />}
              >
                Show Less
              </Button>
            )}
            
            {hasMoreData && (
              <Button
                variant="contained"
                color="primary"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                  }
                }}
                disabled={isLoading || leaderboardData.length === 0}
                onClick={handleShowMore}
                endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <ArrowDownwardIcon />}
              >
                {isLoading ? "Loading..." : "Show 10 More"}
              </Button>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

export default function Leaderboard() {
  return (
    <ThemeProvider theme={theme}>
      <LeaderboardContent />
    </ThemeProvider>
  );
}