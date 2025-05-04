import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusTab from '@/app/components/Account/StatusTab'; 

// Mock framer-motion to avoid animation-related issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => <div {...props}>{children}</div>,
  },
}));

// Mock the images to avoid image loading issues
jest.mock('next/image', () => ({
	__esModule: true,
	default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
		return <img {...props} />;
	},
}));

describe('StatusTab Component', () => {
  beforeEach(() => {
    // Reset any mocks between tests
    jest.clearAllMocks();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('renders the component with all main sections', () => {
    render(<StatusTab />);
    
    // Check main sections
    expect(screen.getByText('Resources & Queue')).toBeInTheDocument();
    expect(screen.getByText('Previous Experiments')).toBeInTheDocument();
    
    // Check token section
    expect(screen.getByText('10 Tokens')).toBeInTheDocument();
    expect(screen.getByText('Available for new experiments')).toBeInTheDocument();
    
    // Check queue section
    expect(screen.getByText('Active Queue (3)')).toBeInTheDocument();
    expect(screen.getByText('Experiment A')).toBeInTheDocument();
    expect(screen.getByText('Experiment B')).toBeInTheDocument();
    expect(screen.getByText('Experiment C')).toBeInTheDocument();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('displays correct status chips for experiments in queue', () => {
		render(<StatusTab />);
		
		// Find all Running and Queued chips by text
		const runningChips = screen.getAllByText('Running');
		const queuedChips = screen.getAllByText('Queued');
	
		// Validate count
		expect(runningChips.length).toBe(1);
		expect(queuedChips.length).toBe(2);
	});
	
	//------------------------------------------------------------------------------------------------------------------------
  test('renders previous experiments table with correct columns', () => {
    render(<StatusTab />);
    
    // Check table headers
    const expectedHeaders = [
      'ID', 'Date', 'Lattice', 'F-D Curve', 'Rank', 'F (N)', 'Unit Cell',
      'Mass (g)', 'L_bend (mm)', 'L_stretch (mm)', 'L_rest (mm)', 
      'Energy (J)', 'Energy/Mass (J/g)'
    ];
    
    expectedHeaders.forEach(header => {
      expect(screen.getByRole('columnheader', { name: header })).toBeInTheDocument();
    });
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('renders correct number of rows in previous experiments table', () => {
    render(<StatusTab />);
    
    // Previous experiments data has 3 items
    const tableRows = screen.getAllByRole('row').filter(
      row => !row.querySelector('th')
    ); // Filter out the header row
    
    expect(tableRows.length).toBe(3);
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('displays experiment IDs in the correct format', () => {
    render(<StatusTab />);
    
    // Check for formatted IDs (WAZL-1, WAZL-2, WAZL-3)
    expect(screen.getByText('WAZL-1')).toBeInTheDocument();
    expect(screen.getByText('WAZL-2')).toBeInTheDocument();
    expect(screen.getByText('WAZL-3')).toBeInTheDocument();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('displays lattice and F-D curve images for each experiment', () => {
    render(<StatusTab />);
    
    // Check for lattice images
    const latticeImages = screen.getAllByAltText(/Lattice \d/);
    expect(latticeImages.length).toBe(3);
    latticeImages.forEach(img => {
      expect(img).toHaveAttribute('src', '/images/lattice.png');
      expect(img).toHaveAttribute('width', '80');
      expect(img).toHaveAttribute('height', '80');
    });
    
    // Check for F-D curve images
    const fdCurveImages = screen.getAllByAltText(/F-D Curve \d/);
    expect(fdCurveImages.length).toBe(3);
    fdCurveImages.forEach(img => {
      expect(img).toHaveAttribute('src', '/images/curve.png');
      expect(img).toHaveAttribute('width', '120');
      expect(img).toHaveAttribute('height', '80');
    });
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('shows correct time remaining for experiments in queue', () => {
    render(<StatusTab />);
    
    expect(screen.getByText('2h 15m remaining')).toBeInTheDocument();
    expect(screen.getByText('4h 30m remaining')).toBeInTheDocument();
    expect(screen.getByText('8h 45m remaining')).toBeInTheDocument();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('shows info button for tokens section', () => {
    render(<StatusTab />);
    
    // Find the info button
    const infoButton = screen.getByRole('button', { name: /learn more about tokens/i });
    expect(infoButton).toBeInTheDocument();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('displays correct experiment values in the table', () => {
    render(<StatusTab />);
    
    // Check values for force, mass, energy
    expect(screen.getByText('0.84')).toBeInTheDocument();
    expect(screen.getByText('0.83')).toBeInTheDocument();
    expect(screen.getByText('0.81')).toBeInTheDocument();
    
    // Use getAllByText for values that appear multiple times in the table
    expect(screen.getByText('0.44')).toBeInTheDocument();
    expect(screen.getAllByText('0.38').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('0.34').length).toBeGreaterThanOrEqual(1);
    
    expect(screen.getByText('3.68')).toBeInTheDocument();
    expect(screen.getByText('3.52')).toBeInTheDocument();
    expect(screen.getByText('3.6')).toBeInTheDocument();
    
    expect(screen.getByText('8.36')).toBeInTheDocument();
    expect(screen.getByText('9.26')).toBeInTheDocument();
    expect(screen.getByText('9.44')).toBeInTheDocument();
  });


	//------------------------------------------------------------------------------------------------------------------------
  test('displays footer information in the previous experiments table', () => {
    render(<StatusTab />);
    
    expect(screen.getByText('Showing 3 experiments')).toBeInTheDocument();
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('displays unit cell types correctly', () => {
    render(<StatusTab />);
    
    // All experiments use "Octet" unit cell type
    const octetChips = screen.getAllByText('Octet');
    expect(octetChips.length).toBe(3);
  });
	//------------------------------------------------------------------------------------------------------------------------
});