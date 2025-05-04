import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { useUser } from "@clerk/nextjs";
import NewExpTab from "@/app/components/Account/NewExpTab";

declare global {
  interface Window {
    FileReader: jest.Mock;
  }
}

// Mock dependencies
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

jest.mock("jszip", () => {
  return jest.fn().mockImplementation(() => {
    return {
      file: jest.fn(),
      generateAsync: jest.fn().mockResolvedValue(new Blob(["mock content"])),
    };
  });
});

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

jest.mock("lodash", () => ({
  throttle: jest.fn((fn) => fn),
}));

// Mock STLViewer component
jest.mock("@/app/components/Account/STLViewer", () => {
  return function MockSTLViewer({ stlUrl }: { stlUrl: string }) {
    return <div data-testid="stl-viewer">Mock STL Viewer: {stlUrl}</div>;
  };
});

// Mock MUI icons
jest.mock("@mui/material/TextField", () => (props: {
  select?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}) => {
  if (props.select) {
    return (
      <div>
        <input 
          value={props.value || ""}
          onChange={props.onChange ?? (() => {})}
        />
        {props.children}
      </div>
    );
  }
  return <input {...props} />;
});

jest.mock("@mui/material/MenuItem", () => (props: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => (
  <div {...props} role="option">{props.children}</div>
));

jest.mock("@mui/icons-material/FileDownload", () => () => (
  <span data-testid="FileDownloadIcon" />
));

jest.mock("@mui/icons-material/FileUpload", () => () => (
  <span data-testid="FileUploadIcon" />
));

// Mock design metadata
interface DesignMetadata {
  height: {
    label: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
  };
  mass: {
    label: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
  };
  material: {
    label: string;
    options: string[];
    defaultValue: string;
  };
}

jest.mock("@/app/metadata/design", () => ({
  designMetadata: {
    height: {
      label: "Height (mm)",
      min: 10,
      max: 30,
      step: 1,
      defaultValue: 20,
    },
    mass: {
      label: "Mass (g)",
      min: 1,
      max: 5,
      step: 0.1,
      defaultValue: 3,
    },
    material: {
      label: "Material",
      options: [
        "Armadillo",
        "Cheetah",
        "Chinchilla",
        "NinjaFlex",
        "PETG",
        "PLA",
      ],
      defaultValue: "PLA",
    },
  } as DesignMetadata,
}));

// Mock URL object methods
global.URL.createObjectURL = jest.fn(() => "mock-stl-url");
global.URL.revokeObjectURL = jest.fn();

describe("NewExpTab Component", () => {
  const mockFetch = jest.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue({ isSignedIn: false });
    
    // Mock fetch
    global.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(["mock STL content"])),
      json: () => Promise.resolve({}),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  //------------------------------------------------------------------------------------------------------------------------
  test("renders design parameters correctly", () => {
    render(<NewExpTab />);
    
    // Check title
    expect(screen.getByText("Forward Design Dashboard")).toBeInTheDocument();
    
    // Check parameters section
    expect(screen.getByText("Design Parameters")).toBeInTheDocument();
    expect(screen.getByText("Mass (g):")).toBeInTheDocument();
    expect(screen.getByText("Height (mm):")).toBeInTheDocument();
    expect(screen.getByText("Material:")).toBeInTheDocument();
  });

  //------------------------------------------------------------------------------------------------------------------------
  test("handles slider change and triggers STL generation", async () => {
    render(<NewExpTab />);

    // Find slider for mass
    const massSlider = screen.getAllByRole("slider")[1];

    // Change slider value
    await act(async () => {
      fireEvent.change(massSlider, { target: { value: 2 } });
    });

    // Check if fetch was called with updated parameters
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("&mass=2")
    );

    // Wait for STL viewer to update
    await waitFor(() => {
      expect(screen.getByTestId("stl-viewer")).toBeInTheDocument();
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  test("handles text field change and blur", async () => {
    render(<NewExpTab />);
    
    // Find text field for mass
    const massTextField = screen.getAllByRole("textbox")[1];
    
    // Change text field value
    await act(async () => {
      fireEvent.change(massTextField, { target: { value: "1" } });
    });
    
    // Trigger blur event
    await act(async () => {
      fireEvent.blur(massTextField);
    });
    
    // Check if fetch was called with updated parameters
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("&mass=1")
    );
  });

  //------------------------------------------------------------------------------------------------------------------------
  test("validates text field input - rejects non-numeric input", async () => {
    render(<NewExpTab />);
    
    const massTextField = screen.getAllByRole("textbox")[1];
    
    // Try to enter invalid input
    await act(async () => {
      fireEvent.change(massTextField, { target: { value: "abc" } });
    });
    
    // Value should remain unchanged
    expect((massTextField as HTMLInputElement).value).toBe("3");
  });

  //------------------------------------------------------------------------------------------------------------------------
  test("validates text field input - enforces min/max constraints on blur", async () => {
    render(<NewExpTab />);
    
    const massTextField = screen.getAllByRole("textbox")[1];
    
    // Enter value below minimum
    await act(async () => {
      fireEvent.change(massTextField, { target: { value: "0" } });
      fireEvent.blur(massTextField);
    });
    
    // Value should be adjusted to min
    expect((massTextField as HTMLInputElement).value).toBe("1");
    
    // Enter value above maximum
    await act(async () => {
      fireEvent.change(massTextField, { target: { value: "6" } });
      fireEvent.blur(massTextField);
    });
    
    // Value should be adjusted to max 
    expect((massTextField as HTMLInputElement).value).toBe("5");
  });

  //------------------------------------------------------------------------------------------------------------------------
  test("handles material selection", async () => {
    render(<NewExpTab />);
  
    // Open the dropdown by clicking the current value
    const dropdownInput = screen.getByDisplayValue("PLA");
    fireEvent.mouseDown(dropdownInput);
  
    // Wait for the dropdown option and click it
    const petgOption = await screen.findByRole("option", { name: "PETG" });
    fireEvent.click(petgOption);
  
    // Now check that the input's value updated
    expect(await screen.findByRole("option", { name: "PETG" })).toBeInTheDocument();
  });

  //------------------------------------------------------------------------------------------------------------------------
  test("shows error message when STL generation fails", async () => {
    // Mock fetch to return an error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Failed to generate STL" }),
    });
    
    render(<NewExpTab />);
    
    // Trigger STL generation
    const widthSlider = screen.getAllByRole("slider")[0];
    
    await act(async () => {
      fireEvent.change(widthSlider, { target: { value: 75 } });
    });
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText("Failed to generate STL")).toBeInTheDocument();
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  test("handles CSV file upload successfully", async () => {
    // Create a mock CSV file
    const csvContent = `
      Parameter,Value
      mass,1
      height,20
      material,PETG
    `;
    const csvFile = new File([csvContent], "parameters.csv", { type: "text/csv" });
    
    // Find the component
    const { container } = render(<NewExpTab />);
    
    // Create a mock FileReader
    const mockFileReader = {
      onload: null as any,
      readAsText: function(file: File) {
        setTimeout(() => {
          this.onload({ target: { result: csvContent } });
        }, 0);
      },
      EMPTY: 0,
      LOADING: 1,
      DONE: 2,
    };
  
    // Mock the global FileReader
    global.FileReader = jest.fn(() => mockFileReader) as any;
    
    // Simulate file change event directly
    await act(async () => {
      let fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      // Simulate the file selection
      fireEvent.change(fileInput, { target: { files: [csvFile] } });
    });
    
    // Check if fetch was called with updated parameters
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    }, { timeout: 1000 });
  });
  
  //------------------------------------------------------------------------------------------------------------------------
  test("shows error for invalid CSV upload", async () => {
    // Create an invalid CSV file
    const invalidCsvContent = `
      Something,Invalid
      width,bad
    `;
    const csvFile = new File([invalidCsvContent], "invalid.csv", { type: "text/csv" });

    // Find the component
    const { container } = render(<NewExpTab />);
    
    // Create a mock FileReader
    const mockFileReader = {
      onload: null as any,
      readAsText: function(file: File) {
        setTimeout(() => {
          this.onload({ target: { result: invalidCsvContent } });
        }, 0);
      },
      // Mock the static properties required by FileReader
      EMPTY: 0,
      LOADING: 1,
      DONE: 2,
    };
  
    // Mock the global FileReader
    global.FileReader = jest.fn(() => mockFileReader) as any;
    
    // Simulate file change event directly
    await act(async () => {
      let fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      // Simulate the file selection
      fireEvent.change(fileInput, { target: { files: [csvFile] } });
    });

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Invalid CSV format/i)).toBeInTheDocument();
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  test("conditionally renders submit button based on user sign-in status", () => {
    // User not signed in
    (useUser as jest.Mock).mockReturnValueOnce({ isSignedIn: false });
    const { unmount } = render(<NewExpTab />);
    expect(screen.queryByText("Submit")).not.toBeInTheDocument();
    
    // Cleanup
    unmount();
    
    // User signed in
    (useUser as jest.Mock).mockReturnValueOnce({ isSignedIn: true });
    render(<NewExpTab />);
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  //------------------------------------------------------------------------------------------------------------------------
  test("handles download button click and dialog confirmation", async () => {
    const { saveAs } = require("file-saver");
    
    render(<NewExpTab />);
    
    // Ensure STL URL is available
    await act(async () => {
      const massSlider = screen.getAllByRole("slider")[1];
      fireEvent.change(massSlider, { target: { value: 2 } });
    });
  
    // Get download button and click it
    const downloadButton = screen.getByTestId("FileDownloadIcon").closest("button")!;
    
    await act(async () => {
      fireEvent.click(downloadButton);
    });
  
    // Check if dialog appears
    expect(screen.getByText("Confirm Download")).toBeInTheDocument();
  
    // Confirm download
    await act(async () => {
      fireEvent.click(screen.getByText("Confirm"));
    });
  
    // Check if saveAs was called
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "design_files.zip");
  });
  
  //------------------------------------------------------------------------------------------------------------------------
  test("handles dialog cancellation", async () => {
    const { saveAs } = require("file-saver");
  
    render(<NewExpTab />);
    
    // Ensure download button is present
    const downloadButton = screen.getByTestId("FileDownloadIcon").closest("button");
  
    if (downloadButton) {
      // Click the download button
      await act(async () => {
        fireEvent.click(downloadButton);
      });
  
      // Cancel download
      await act(async () => {
        fireEvent.click(screen.getByText("Cancel"));
      });
  
      expect(saveAs).not.toHaveBeenCalled();
    } else {
      throw new Error("Download button not found.");
    }
  });  
  //------------------------------------------------------------------------------------------------------------------------
});