import React from "react";
import { render, screen } from "@testing-library/react";
import AdminNavbar from "@/app/components/Admin/Navigation";

describe("AdminNavbar", () => {
	// Mock user data
  const mockUser = {
    id: "1",
    firstName: "user",
    lastName: "name",
    email: "alanl193@bu.edu",
    imageUrl: "",
  };

	//------------------------------------------------------------------------------------------------------------------------
  test("renders user initials when sidebar is collapsed", () => {
		// Mock the collapsed state
    render(<AdminNavbar user={mockUser} />);
    const initials = screen.getAllByText("UN")[0];
    expect(initials).toBeInTheDocument();
  });

	//------------------------------------------------------------------------------------------------------------------------
	test("renders all expected menu items", () => {
		render(<AdminNavbar user={mockUser} />);
		const menuItems = [
			"Dashboard",
			"User Management",
			"Manage Approvals",
			"Token Management",
			"System Logs",
		];
	
		// Check if all menu items are rendered
		menuItems.forEach((text) => {
			const matches = screen.getAllByText(text);
			expect(matches.length).toBeGreaterThan(0);
		});
	});

	/**
	 * Can test for navigation routing...
	 */
});
