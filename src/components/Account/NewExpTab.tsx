"use client";

import { useState } from "react";

// Material-UI components
import { 
  TextField, Typography, Grid,
  Button, Slider, MenuItem, Box
} from "@mui/material";

// Material-UI icons
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';

/**********************************************************************************/
// Define interface for metadata
interface Metadata {
  [key: string]: {
    label: string;
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number | string;
    options?: string[];
  };
}

// Define metadata for design parameters
const designMetadata: Metadata = {
  c4BaseFace: {
    label: 'c4 (base face)',
    min: 0,
    max: 1.2,
    step: 0.01,
    defaultValue: 0.6,
  },
  c4TopFace: {
    label: 'c4 (top face)',
    min: 0,
    max: 1.2,
    step: 0.01,
    defaultValue: 0.6,
  },
  c8BaseFace: {
    label: 'c8 (base face)',
    min: -1,
    max: 1,
    step: 0.01,
    defaultValue: 0,
  },
  c8TopFace: {
    label: 'c8 (top face)',
    min: -1,
    max: 1,
    step: 0.01,
    defaultValue: 0,
  },
  linearTwist: {
    label: 'Linear twist (rad)',
    min: 0,
    max: 2 * Math.PI,
    step: 0.001,
    defaultValue: Math.PI,
  },
  oscillatingTwistAmplitude: {
    label: 'Oscillating twist amplitude (rad)',
    min: 0,
    max: Math.PI,
    step: 0.01,
    defaultValue: 0,
  },
  oscillatingTwistCycles: {
    label: 'Oscillating twist cycles',
    min: 0,
    max: 3,
    step: 1,
    defaultValue: 0,
  },
  topToBasePerimeterRatio: {
    label: 'Top to base perimeter ratio',
    min: 1,
    max: 3,
    step: 0.1,
    defaultValue: 2,
  },
  height: {
    label: 'Height (mm)',
    min: 10,
    max: 30,
    step: 1,
    defaultValue: 20,
  },
  mass: {
    label: 'Mass (g)',
    min: 1,
    max: 5,
    step: 0.1,
    defaultValue: 3,
  },
  wallThickness: {
    label: 'Wall thickness (mm)',
    min: 0.4,
    max: 1,
    step: 0.001,
    defaultValue: 0.7,
  },
  material: {
    label: 'Material',
    options: ['Armadillo', 'Cheetah', 'Chinchilla', 'NinjaFlex', 'PETG', 'PLA'],
    defaultValue: 'PLA',
  },
};
/**********************************************************************************/

// Define interface for design state
interface DesignState {
  [key: string]: number | string;
}

export default function NewExpTab() {
  // State for design parameters
  const [designState, setDesignState] = useState<DesignState>(
    Object.keys(designMetadata).reduce((acc: DesignState, key) => {
      const metadata = designMetadata[key];
      if (metadata.options) {
        acc[key] = metadata.defaultValue ?? '';
      } else {
        acc[key] = metadata.defaultValue ?? '';
      }
      return acc;
    }, {})
  );	

	/**********************************************************************************/
  const handleSliderChange = (key: string, value: number) => {
    setDesignState((prev) => ({ ...prev, [key]: value }));
  };

	const handleTextFieldChange = (key: string, value: string) => {
		const metadata = designMetadata[key];
	
		// Allow empty input for deletion
		if (value === "") {
			setDesignState((prev) => ({ ...prev, [key]: value }));
			return;
		}
	
		// Determine if negative numbers are allowed
		const allowNegative = (metadata.min ?? 0) < 0;
		const regex = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;
	
		// Ensure valid numeric input
		if (!regex.test(value)) return;
	
		// Handle cases where user starts with "."
		if (value === ".") {
			value = "0.";
		} else if (value === "-.") {
			value = "-0.";
		}
	
		// Convert to number and enforce min/max **while typing**
		let numericValue = Number(value);
		if (numericValue < (metadata.min ?? -Infinity)) {
			numericValue = metadata.min!;
		}
		if (numericValue > (metadata.max ?? Infinity)) {
			numericValue = metadata.max!;
		}
	
		setDesignState((prev) => ({ ...prev, [key]: value }));
	};
	
	const handleTextFieldBlur = (key: string) => {
		setDesignState((prev) => {
			let value = prev[key];
	
			// Get min value from metadata
			const metadata = designMetadata[key];
			const minValue = metadata.min ?? 0;
	
			// If empty, reset to min value
			if (value === "") {
				return { ...prev, [key]: minValue };
			}
	
			// If ends with '.', '-.', append '0'
			if (typeof value === "string" && value.match(/^-?\d+\.$/)) {
				value += "0";
			}
	
			let numericValue = Number(value);
	
			// Enforce min/max **on blur**
			if (numericValue < minValue) {
				numericValue = minValue;
			}
			if (numericValue > (metadata.max ?? Infinity)) {
				numericValue = metadata.max!;
			}
	
			return { ...prev, [key]: numericValue };
		});
	};	
	
  const handleMaterialChange = (value: string) => {
    setDesignState((prev) => ({ ...prev, material: value }));
  };
	/**********************************************************************************/

  return (
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
                  >
                    {metadata.options.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </TextField>
                </Box>
              );
            } else {
              // Slider and text field for other parameters
              return (
                <Box key={key} sx={{ mb: 2 }}>
                  <Typography variant="body2">{metadata.label}:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Slider 
                      value={designState[key] as number}
                      onChange={(e, newValue) => handleSliderChange(key, newValue as number)}
                      min={metadata.min} 
                      max={metadata.max} 
                      step={metadata.step} 
                      sx={{ flexGrow: 1 }}
                    />
                    <TextField 
                      size="small" 
                      value={designState[key] as string}
                      onChange={(e) => handleTextFieldChange(key, e.target.value)}
											onBlur={() => handleTextFieldBlur(key)}
                      sx={{ width: '80px' }} 
                    />
                  </Box>
                </Box>
              );
            }
          })}
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
                  <FileUploadIcon />
                </Button><Button variant="contained" size="small" sx={{ minWidth: '40px' }}>
                  <FileDownloadIcon />
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
  );
}