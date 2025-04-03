"use client";

import { useState } from "react";

// Downloading Files
import JSZip from "jszip";
import { saveAs } from "file-saver";

// For throttling API calls
import { set, throttle } from "lodash";

// Custom components
import STLViewer from "@/src/components/Account/STLViewer";

// Metadata for design parameters
import { designMetadata } from "@/src/metadata/design";

// Material-UI components
import {
  TextField,
  Typography,
  Grid,
  Button,
  Slider,
  MenuItem,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

// Material-UI icons
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";

/**********************************************************************************/
// Define interface for design state
interface DesignState {
  [key: string]: number | string;
}

export default function NewExpTab() {
  // State for design parameters
  const [designState, setDesignState] = useState<DesignState>(
    Object.keys(designMetadata).reduce((acc: DesignState, key: string) => {
      const metadata = designMetadata[key];
      acc[key] = metadata.defaultValue ?? "";
      return acc;
    }, {}),
  );

  /**********************************************************************************/
  const [stlUrl, setStlUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generateSTLThrottled = throttle(async (debouncedState: DesignState) => {
    try {
      const { material, ...paramsWithoutMaterial } = debouncedState;
      const params = new URLSearchParams(
        Object.entries(paramsWithoutMaterial).reduce(
          (acc: { [key: string]: string }, [key, value]) => {
            acc[key] = String(value);
            return acc;
          },
          {},
        ),
      );

      // Toggle Backend URL based on environment
      // Use local backend during development
      // Use production backend in production
      const BASE_URL =
        process.env.NODE_ENV === "development"
          ? "http://127.0.0.1:8000" // Local backend during development
          : process.env.NEXT_PUBLIC_BACKEND_URL; // Production backend

      const response = await fetch(
        `${BASE_URL}/generate-stl/?${params.toString()}`
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
    }
  }, 300);

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (confirm: boolean) => {
    setOpenDialog(false);
    if (confirm) {
      handleDownload();
    }
  };

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

  const handleSliderChange = async (key: string, value: number) => {
    setCsvError(null);

    setDesignState((prev) => {
      const newState = { ...prev, [key]: value };
      generateSTLThrottled(newState);
      return newState;
    });
  };

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
  
  const handleTextFieldBlur = (key: string) => {
    setDesignState((prev) => {
      let value = prev[key];
  
      // Ensure value is a valid number
      if (typeof value === "string") {
        if (value === "" || value === "." || value === "-.") {
          value = designMetadata[key].min ?? 0; 
        } else {
          value = Number(value);
        }
      }
  
      // Enforce min/max constraints
      value = Math.max(designMetadata[key].min ?? -Infinity, value);
      value = Math.min(designMetadata[key].max ?? Infinity, value);
  
      const newState = { ...prev, [key]: value };
      generateSTLThrottled(newState); // Trigger STL generation
      return newState;
    });
  };  

  const handleMaterialChange = (value: string) => {
    setDesignState((prev) => ({ ...prev, material: value }));
  };

  // Handle CSV file upload
  const [csvError, setCsvError] = useState<string | null>(null);
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type === "text/csv") {
      const reader = new FileReader();

      reader.onload = (event) => {
        const content = event.target?.result as string;
        const rows = content.trim().split("\n");

        // Make sure the CSV has the right number of rows and format
        if (rows.length < 2) {
          setCsvError("CSV is empty or doesn't contain valid data.");
          return;
        }

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
  /**********************************************************************************/

  return (
    <Box sx={{ maxWidth: "1000px", width: "100%" }}>
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
              {csvError || errorMessage ? (
                <Typography variant="h5" color="error" align="center">
                  {csvError || errorMessage}
                </Typography>
              ) : stlUrl ? (
                <STLViewer stlUrl={stlUrl} />
              ) : (
                <Typography>Loading 3D model...</Typography>
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
