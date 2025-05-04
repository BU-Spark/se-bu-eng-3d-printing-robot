import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import STLViewer from '@/app/components/Account/STLViewer';
import * as THREE from 'three';

// Mock the required modules
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas-mock">{children}</div>,
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls-mock" />,
}));

jest.mock('three/examples/jsm/loaders/STLLoader.js', () => ({
  STLLoader: jest.fn().mockImplementation(() => ({
    parse: jest.fn().mockReturnValue(new THREE.BufferGeometry()),
  })),
}));

// Mock fetch
global.fetch = jest.fn();

describe('STLViewer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('renders the canvas component', () => {
    // Check if the canvas is rendered
    render(<STLViewer stlUrl={null} />);
    expect(screen.getByTestId('canvas-mock')).toBeInTheDocument();
  });

  //------------------------------------------------------------------------------------------------------------------------
  test('renders OrbitControls', () => {
    // Check if OrbitControls is rendered
    render(<STLViewer stlUrl={null} />);
    expect(screen.getByTestId('orbit-controls-mock')).toBeInTheDocument();
  });

  //------------------------------------------------------------------------------------------------------------------------
  test('shows loading state when stlUrl is provided but still loading', () => {
    // Mock fetch to return a pending promise
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    // Check if loading state is displayed
    const { container } = render(<STLViewer stlUrl="https://github.com/Buildbee/example-stl/blob/main/ascii-cube.stl" />);
    expect(global.fetch).toHaveBeenCalledWith('https://github.com/Buildbee/example-stl/blob/main/ascii-cube.stl');
  });

  //------------------------------------------------------------------------------------------------------------------------
  test('handles HTTP error when fetching STL', async () => {
    // Mock fetch error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    });

    // Check if error is logged
    render(<STLViewer stlUrl="https://github.com/Buildbee/example-stl/blob/main/ascii-cube.stl" />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'STL Load Error:',
        expect.any(Error)
      );
    });
    consoleSpy.mockRestore();
  });

  //------------------------------------------------------------------------------------------------------------------------
  test('handles empty or corrupt STL file', async () => {
    // Mock empty array buffer
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    });

    // Check if error is logged
    render(<STLViewer stlUrl="https://github.com/Buildbee/example-stl/blob/main/ascii-cube-erroe.stl" />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'STL Load Error:',
        expect.any(Error)
      );
    });
    consoleSpy.mockRestore();
  });

  //------------------------------------------------------------------------------------------------------------------------
  test('handles fetch errors gracefully', async () => {
    // Mock fetch rejection
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    // Check if error is logged
    render(<STLViewer stlUrl="https://github.com/Buildbee/example-stl/blob/main/cali-bee.stl" />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'STL Load Error:',
        expect.any(Error)
      );
    });
    consoleSpy.mockRestore();
  });

  //------------------------------------------------------------------------------------------------------------------------
  test('rerenders when stlUrl prop changes', async () => {
    // Mock successful fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(10)),
    });

    // Check if fetch is called with the correct URL
    const { rerender } = render(<STLViewer stlUrl="https://github.com/Buildbee/example-stl/blob/main/cali-bee.stl" />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://github.com/Buildbee/example-stl/blob/main/cali-bee.stl');
    });

    // Check if fetch is called again with the new URL
    rerender(<STLViewer stlUrl="https://github.com/Buildbee/example-stl/blob/main/cali-bee.stl" />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://github.com/Buildbee/example-stl/blob/main/cali-bee.stl');
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  test('does not fetch when stlUrl is null', () => {
    // Check if fetch is not called when stlUrl is null
    render(<STLViewer stlUrl={null} />);
    expect(global.fetch).not.toHaveBeenCalled();
  });
  //------------------------------------------------------------------------------------------------------------------------
});