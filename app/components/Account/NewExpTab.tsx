"use client";

import { useState } from "react";

// File handling libraries
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Authentication
import { useUser } from "@clerk/nextjs";

// Performance optimization
import { throttle } from "lodash";

// Custom components
import STLViewer from "./STLViewer";

// Configuration
import { designMetadata } from "@/app/metadata/design";

// Material-UI components
import {
  TextField, Typography, Grid,
  Button, Slider, MenuItem,
  Box, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
  CircularProgress,
} from "@mui/material";

// Material-UI icons
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";

/**
 * Interface for design state
 * @interface DesignState
 * @property {string} key - The parameter name
 * @property {number | string} value - The parameter value (number for sliders, string for dropdowns)
 */
interface DesignState {
  [key: string]: number | string;
}

/**
 * New Experiment Tab Component
 * 
 * Provides an interactive interface for:
 * - Adjusting design parameters via sliders and dropdowns
 * - Real-time 3D model visualization
 * - Importing/exporting design configurations
 * - Submitting designs to the backend
 * 
 * Features:
 * - Throttled API calls to prevent excessive requests
 * - CSV import/export functionality
 * - Authentication-aware UI elements
 */
export default function NewExpTab() {
  // Initialize design state with default values from metadata
  const [designState, setDesignState] = useState<DesignState>(
    Object.keys(designMetadata).reduce((acc: DesignState, key: string) => {
      const metadata = designMetadata[key];
      acc[key] = metadata.defaultValue ?? "";
      return acc;
    }, {}),
  );

  // Model and error states
  const [stlUrl, setStlUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingSTL, setIsLoadingSTL] = useState<boolean>(false);

  /**
   * Fetches the STL model from the backend and updates the component state.
   * @param {DesignState} currentState - The current design state
   */
  const fetchAndSetSTL = async (currentState: DesignState) => {
    setIsLoadingSTL(true); // Set loading to true
    setErrorMessage(null); // Clear previous errors
    setCsvError(null); // Clear previous CSV errors
    try {
      const { material, ...paramsWithoutMaterial } = currentState;
      const params = new URLSearchParams(
        Object.entries(paramsWithoutMaterial).reduce(
          (acc: { [key: string]: string }, [key, value]) => {
            acc[key] = String(value);
            return acc;
          },
          {},
        ),
      );

      // Dynamic backend URL based on environment
      const BASE_URL =
        process.env.NODE_ENV === "development"
          ? "http://127.0.0.1:8000" // Local backend during development
          : process.env.NEXT_PUBLIC_BACKEND_URL; // Production backend

      const response = await fetch(
        `${BASE_URL}/generate-stl/?${params.toString()}`,
      );

      // If the response is not OK or not an STL file
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Invalid STL file received");
        setStlUrl(null); // Clear the 3D model viewer
        return;
      }

      const blob = await response.blob();
      setStlUrl(URL.createObjectURL(blob));
      setErrorMessage(null); // Clear the error message on success
    } catch (error) {
      console.error("Error fetching STL:", error);
      setStlUrl(null); // Clear the 3D model viewer
      setErrorMessage((error as any).message); // Set the error message
    } finally {
      setIsLoadingSTL(false); // Set loading to false when fetch completes
    }
  };

  /**
   * Throttled STL generation function
   * @param {DesignState} debouncedState - The current design state
   */
  const generateSTLThrottled = throttle(fetchAndSetSTL, 300);

  // Dialog state for download confirmation
  const [openDialog, setOpenDialog] = useState(false);

  /**
   * Handles the opening of the download confirmation dialog
   */
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  /**
   * Handles the closing of the download confirmation dialog
   * @param {boolean}
   * @param {boolean} confirm - Indicates whether the user confirmed the download
   */
  const handleCloseDialog = (confirm: boolean) => {
    setOpenDialog(false);
    if (confirm) {
      handleDownload();
    }
  };

  /**
   * Downloads design files as a ZIP archive containing:
   * - STL model file
   * - CSV with design parameters
   */
  const handleDownload = async () => {
    if (!stlUrl) {
      alert("No STL file available for download.");
      return;
    }

    try {
      const zip = new JSZip();

      // Add the STL file to the ZIP
      const stlResponse = await fetch(stlUrl);
      const stlBlob = await stlResponse.blob();
      zip.file("model.stl", stlBlob);

      // Create a CSV file with design parameters
      let csvContent = "Parameter,Value\n";
      Object.keys(designState).forEach((key) => {
        csvContent += `${key},${designState[key]}\n`;
      });
      zip.file("parameters.csv", csvContent);

      // Generate the ZIP file and trigger download
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "design_files.zip");
    } catch (error) {
      console.error("Error creating ZIP file:", error);
    }
  };

  /**
   * Handles slider changes with throttled STL generation
   * @param {string} key - The parameter name
   * @param {number} value - New slider value
   */
  const handleSliderChange = async (key: string, value: number) => {
    setCsvError(null);

    setDesignState((prev) => {
      const newState = { ...prev, [key]: value };
      // generateSTLThrottled(newState); // Removed from here
      return newState;
    });
  };

  /**
   * Handles the end of a slider change, triggering STL generation.
   * @param {string} key - The parameter name
   * @param {number | number[]} value - New slider value (or array if range slider)
   */
  const handleSliderChangeCommitted = (key: string, value: number | number[]) => {
    const singleValue = Array.isArray(value) ? value[0] : value;
    setDesignState((prev) => {
      const newState = { ...prev, [key]: singleValue };
      fetchAndSetSTL(newState); // Call the non-throttled version directly
      return newState;
    });
  };

  /**
   * Handles text field input changes with validation
   * @param {string} key - The parameter name
   * @param {string} value - New input value
   */
  const handleTextFieldChange = (key: string, value: string) => {
    setCsvError(null);
    const metadata = designMetadata[key];

    // Allow empty input for editing
    if (value === "") {
      setDesignState((prev) => ({ ...prev, [key]: value }));
      return;
    }

    // Allow numbers and decimals, with optional negative sign
    const allowNegative = (metadata.min ?? 0) < 0;
    const regex = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;

    if (!regex.test(value)) return; // Ignore invalid input

    setDesignState((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Handles text field blur with value normalization
   * @param {string} key - The parameter name
   */
  const handleTextFieldBlur = (key: string) => {
    setDesignState((prev) => {
      let value = prev[key];

      // Normalize value
      if (typeof value === "string") {
        if (value === "" || value === "." || value === "-.") {
          value = designMetadata[key].min ?? 0;
        } else {
          value = Number(value);
        }
      }

      // Apply min/max constraints
      value = Math.max(designMetadata[key].min ?? -Infinity, value);
      value = Math.min(designMetadata[key].max ?? Infinity, value);

      const newState = { ...prev, [key]: value };
      generateSTLThrottled(newState); // Trigger STL generation
      return newState;
    });
  };

  /**
   * Handles material selection changes
   * @param {string} value - The selected material
   */
  const handleMaterialChange = (value: string) => {
    setDesignState((prev) => ({ ...prev, material: value }));
  };

  /**
   * Handles CSV file upload and parameter updates
   * @param {React.ChangeEvent<HTMLInputElement>} e - The file input event
   */
  const [csvError, setCsvError] = useState<string | null>(null);
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type === "text/csv") {
      const reader = new FileReader();

      reader.onload = (event) => {
        const content = event.target?.result as string;
        const rows = content.trim().split("\n");

        // Validate CSV structure
        if (rows.length < 2) {
          setCsvError("CSV is empty or doesn't contain valid data.");
          return;
        }
        
        // Ensure the first row has 'Parameter,Value' headers
        const headers = rows[0].split(",");
        if (
          headers.length !== 2 ||
          headers[0].trim() !== "Parameter" ||
          headers[1].trim() !== "Value"
        ) {
          setCsvError(
            "Invalid CSV format. Ensure the first row has 'Parameter,Value' headers.",
          );
          return;
        }
        
        // Process the CSV data
        const newState: DesignState = { ...designState };
        let isValid = true;

        rows.slice(1).forEach((row) => {
          const [key, value] = row.split(",");

          if (!key || !value) {
            isValid = false;
            return; // Skip invalid rows
          }

          const trimmedKey = key.trim();
          const trimmedValue = value.trim();

          // Check if the parameter exists in designMetadata
          if (designMetadata[trimmedKey]) {
            newState[trimmedKey] = parseFloat(trimmedValue);
          } else {
            isValid = false;
          }
        });

        if (!isValid) {
          setCsvError("CSV contains invalid parameters or values.");
          return;
        }

        // Update the state and re-render the model
        setDesignState(newState);
        generateSTLThrottled(newState); // Re-render model with new params
        setCsvError(null); // Clear any previous errors
      };

      reader.readAsText(file);
    } else {
      setCsvError("Please upload a valid CSV file.");
    }
  };

  // Check if the user is signed in
  const { isSignedIn } = useUser();

  return (
    <Box sx={{ maxWidth: "1000px", width: "100%" }}>
      {/* Header */}
      <Typography variant="h5" gutterBottom align="center">
        Forward Design Dashboard
      </Typography>

      <Typography
        variant="subtitle1"
        gutterBottom
        align="center"
        sx={{ mb: 3 }}
      >
        Interactively create and visualize GCS and observe their predicted
        performance.
      </Typography>

      {/* Main layout - Two panels: Left for design parameters, Right for 3D model */}
      <Grid container spacing={3}>
        {/* Left panel - Design Parameters */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Design Parameters
          </Typography>

          {/* Render design parameters dynamically */}
          {Object.keys(designMetadata).map((key) => {
            const metadata = designMetadata[key];
            if (metadata.options) {
              // Material dropdown
              return (
                <Box key={key} sx={{ mb: 2 }}>
                  <Typography variant="body2">{metadata.label}:</Typography>
                  <TextField
                    select
                    fullWidth
                    value={designState.material}
                    onChange={(e) => handleMaterialChange(e.target.value)}
                    size="medium"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#CC0000",
                        },
                        "&:hover fieldset": {
                          borderColor: "#AA0000",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#CC0000",
                        },
                      },
                      "& .MuiSelect-select": {
                        backgroundColor: "#F9F9F9",
                      },
                    }}
                  >
                    {metadata.options.map((option) => (
                      <MenuItem
                        key={option}
                        value={option}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#FFE5E5",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "#CC0000",
                            color: "#FFFFFF",
                            "&:hover": {
                              backgroundColor: "#CC0000",
                            },
                          },
                        }}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              );
            } else {
              // Slider and text field for other parameters
              return (
                <Box key={key} sx={{ mb: 2 }}>
                  <Typography variant="body2">{metadata.label}:</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Slider
                      value={designState[key] as number}
                      onChange={(e, newValue) =>
                        handleSliderChange(key, newValue as number)
                      }
                      onChangeCommitted={(e, newValue) =>
                        handleSliderChangeCommitted(key, newValue as number)
                      }
                      min={metadata.min}
                      max={metadata.max}
                      step={metadata.step}
                      sx={{
                        flexGrow: 1,
                        color: "#CC0000",
                        "& .MuiSlider-thumb": {
                          backgroundColor: "#CC0000",
                        },
                        "& .MuiSlider-track": {
                          backgroundColor: "#CC0000",
                        },
                        "& .MuiSlider-rail": {
                          backgroundColor: "#CC0000",
                        },
                      }}
                    />
                    <TextField
                      size="small"
                      value={designState[key] as string}
                      onChange={(e) =>
                        handleTextFieldChange(key, e.target.value)
                      }
                      onBlur={() => handleTextFieldBlur(key)}
                      sx={{
                        width: "80px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#CC0000" },
                          "&:hover fieldset": { borderColor: "#AA0000" },
                          "&.Mui-focused fieldset": { borderColor: "#CC0000" },
                        },
                        "& .MuiSelect-select": { backgroundColor: "#F9F9F9" },
                      }}
                    />
                  </Box>
                </Box>
              );
            }
          })}
        </Grid>

        {/* Right panel - Design visualization (expanded) */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Typography variant="h6" gutterBottom>
              Design
            </Typography>
            <Box
              sx={{
                position: "relative", 
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #eee",
                borderRadius: "4px",
                mb: 2,
                minHeight: "400px",
              }}
            >
              {/* Primary content: Error, STL, or Initial Text */}
              {csvError || errorMessage ? (
                <Typography variant="h5" color="error" align="center">
                  {csvError || errorMessage}
                </Typography>
              ) : stlUrl ? (
                <STLViewer stlUrl={stlUrl} />
              ) : !isLoadingSTL ? ( 
                <Typography>3D model will appear here.</Typography>
              ) : null
              }

              {/* Loader Overlay */}
              {isLoadingSTL && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.2)", 
                    zIndex: 1, 
                  }}
                >
                  <CircularProgress sx={{ color: "#CC0000" }} />
                </Box>
              )}
            </Box>

            {/* Control buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  component="label"
                  size="small"
                  sx={{
                    minWidth: "40px",
                    backgroundColor: "#CC0000",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#AA0000",
                    },
                  }}
                >
                  <FileUploadIcon />
                  <input
                    type="file"
                    accept=".csv"
                    style={{ display: "none" }}
                    onChange={handleCSVUpload}
                  />
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleOpenDialog}
                  sx={{
                    minWidth: "40px",
                    backgroundColor: "#CC0000",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#AA0000",
                    },
                  }}
                >
                  <FileDownloadIcon />
                </Button>
              </Box>

              {/* Submit button */}
              {isSignedIn && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#CC0000",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#AA0000",
                    },
                  }}
                >
                  Submit
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => handleCloseDialog(false)}>
        <DialogTitle>Confirm Download</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to download the design files?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleCloseDialog(true)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
