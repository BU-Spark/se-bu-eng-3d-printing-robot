export interface Metadata {
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
export const designMetadata: Metadata = {
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