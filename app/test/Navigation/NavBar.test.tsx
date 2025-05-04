import React from 'react';
import { render, screen } from '@testing-library/react';
import NavBar from '@/app/components/Navigation/NavBar';

// Mock the Clerk authentication hooks
jest.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-in">{children}</div>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-out">{children}</div>,
  SignInButton: ({ children }: { children: React.ReactNode }) => <div data-testid="sign-in-button">{children}</div>,
  SignUpButton: ({ children }: { children: React.ReactNode }) => <div data-testid="sign-up-button">{children}</div>,
  UserButton: () => <div data-testid="user-button">UserButton</div>,
  useUser: jest.fn()
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('NavBar Component', () => {
  const defaultProps = {
    bugReportFormURL: 'https://example.com/bug-report',
    font: 'Whitney SemiBold, sans-serif'
  };
  
  beforeEach(() => {
    // Reset the useUser mock before each test
    const { useUser } = require('@clerk/nextjs');
    useUser.mockReturnValue({ user: null });
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('renders the navbar with title', () => {
		// Check if the title is rendered correctly
    render(<NavBar {...defaultProps} />);
    expect(screen.getByText('The Experimental Mechanics Challenge')).toBeInTheDocument();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('renders sign-in and sign-up buttons when user is not signed in', () => {
		// Check if the sign-in and sign-up buttons are rendered
    render(<NavBar {...defaultProps} />);
    expect(screen.getByTestId('signed-out')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('renders user navigation buttons when user is signed in', () => {
		// Check if the user navigation buttons are rendered
    const { useUser } = require('@clerk/nextjs');
    useUser.mockReturnValue({ 
      user: { 
        primaryEmailAddress: { emailAddress: 'test@example.com' } 
      } 
    });
    
    render(<NavBar {...defaultProps} />);
    
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Library')).toBeInTheDocument();
    expect(screen.getByText('BEAR status')).toBeInTheDocument();
    expect(screen.getByText('Leaderboards')).toBeInTheDocument();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('does not render admin button for non-admin users', () => {
		// Check if the admin button is not rendered for non-admin users
    const { useUser } = require('@clerk/nextjs');
    useUser.mockReturnValue({ 
      user: { 
        primaryEmailAddress: { emailAddress: 'regular@example.com' } 
      } 
    });
    
    render(<NavBar {...defaultProps} />);
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('renders admin button for admin users', () => {
		// Check if the admin button is rendered for admin users
    const { useUser } = require('@clerk/nextjs');
    useUser.mockReturnValue({ 
      user: { 
        primaryEmailAddress: { emailAddress: 'sulafaj@bu.edu' } 
      } 
    });
    
    render(<NavBar {...defaultProps} />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('bug report button links to the correct URL', () => {
		// Check if the bug report button links to the correct URL
    render(<NavBar {...defaultProps} />);
    const bugReportButton = screen.getByRole('link', { name: '' });
    expect(bugReportButton).toHaveAttribute('href', defaultProps.bugReportFormURL);
    expect(bugReportButton).toHaveAttribute('target', '_blank');
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('navigation links have correct hrefs', () => {
		// Check if the navigation links have the correct hrefs
    const { useUser } = require('@clerk/nextjs');
    useUser.mockReturnValue({ 
      user: { 
        primaryEmailAddress: { emailAddress: 'test@example.com' } 
      } 
    });
    
    render(<NavBar {...defaultProps} />);
    
    expect(screen.getByRole('link', { name: /The Experimental Mechanics Challenge/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /Account/i })).toHaveAttribute('href', '/pages/account');
    expect(screen.getByRole('link', { name: /Library/i })).toHaveAttribute('href', '/pages/library');
    expect(screen.getByRole('link', { name: /BEAR status/i })).toHaveAttribute('href', '/pages/bear-status');
    expect(screen.getByRole('link', { name: /Leaderboards/i })).toHaveAttribute('href', '/pages/leaderboard');
  });
});
