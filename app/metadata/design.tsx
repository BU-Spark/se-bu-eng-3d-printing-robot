/**
 * Interface for design parameter metadata
 * 
 * Defines the structure for parameter configuration including:
 * - Display labels
 * - Value constraints (min/max/step)
 * - Default values
 * - Options for dropdown parameters
 */
export interface Metadata {
  [key: string]: {
    /** Display label for the parameter */
    label: string;
    
    /** Minimum allowed value (for numeric parameters) */
    min?: number;
    
    /** Maximum allowed value (for numeric parameters) */
    max?: number;
    
    /** Increment step size (for numeric parameters) */
    step?: number;
    
    /** Default value for the parameter */
    defaultValue?: number | string;
    
    /** Available options (for dropdown parameters) */
    options?: string[];
  };
}

/**
 * Design parameter metadata configuration
 * 
 * Contains specifications for all adjustable parameters in the design interface,
 * including mechanical properties and material options.
 */
export const designMetadata: Metadata = {
  // Curvature parameters for base and top faces
  c4BaseFace: {
    label: "c4 (base face)",
    min: 0,
    max: 1.2,
    step: 0.01,
    defaultValue: 0.6, // Moderate curvature by default
  },
  c4TopFace: {
    label: "c4 (top face)",
    min: 0,
    max: 1.2,
    step: 0.01,
    defaultValue: 0.6, // Matches base face curvature
  },
  c8BaseFace: {
    label: "c8 (base face)",
    min: -1, // Allows for concave or convex curvature
    max: 1,
    step: 0.01,
    defaultValue: 0, // Flat by default
  },
  c8TopFace: {
    label: "c8 (top face)",
    min: -1,
    max: 1,
    step: 0.01,
    defaultValue: 0, // Flat by default
  },

  // Twist parameters for structural deformation
  linearTwist: {
    label: "Linear twist (rad)",
    min: 0,
    max: 2 * Math.PI, // Full rotation range
    step: 0.001, // Fine control for precise adjustments
    defaultValue: Math.PI, // Half twist by default
  },
  oscillatingTwistAmplitude: {
    label: "Oscillating twist amplitude (rad)",
    min: 0,
    max: Math.PI, // Limited to 180 degrees
    step: 0.01,
    defaultValue: 0, // No oscillation by default
  },
  oscillatingTwistCycles: {
    label: "Oscillating twist cycles",
    min: 0,
    max: 3, // Up to 3 full oscillations
    step: 1, // Whole numbers only
    defaultValue: 0, // No cycles by default
  },

  // Geometric proportions
  topToBasePerimeterRatio: {
    label: "Top to base perimeter ratio",
    min: 1, // Cannot be smaller than base
    max: 3, // Maximum expansion factor
    step: 0.1,
    defaultValue: 2, // Significant taper by default
  },

  // Physical dimensions
  height: {
    label: "Height (mm)",
    min: 10, // Minimum practical height
    max: 30, // Maximum practical height
    step: 1, // Whole millimeters
    defaultValue: 20, // Medium height
  },
  mass: {
    label: "Mass (g)",
    min: 1, // Minimum mass
    max: 5, // Maximum mass
    step: 0.1, // 0.1g precision
    defaultValue: 3, // Average mass
  },
  wallThickness: {
    label: "Wall thickness (mm)",
    min: 0.4, // Minimum printable thickness
    max: 1, // Maximum before becoming too bulky
    step: 0.001, // High precision for fine tuning
    defaultValue: 0.7, // Standard thickness
  },

  // Material selection
  material: {
    label: "Material",
    options: [
      "Armadillo",  // Flexible TPU variant
      "Cheetah",    // High-speed PLA
      "Chinchilla", // Soft flexible material
      "NinjaFlex",  // Professional flexible filament
      "PETG",       // Durable and impact-resistant
      "PLA"         // Standard material
    ],
    defaultValue: "PLA", // Most common/default material
  },
};