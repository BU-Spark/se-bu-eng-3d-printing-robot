import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InfoTab from '@/app/components/Account/InfoTab'; 
import '@testing-library/jest-dom';

// Mock user and session data
const mockUser = {
  fullName: 'John Doe',
  primaryEmailAddress: {
    emailAddress: 'johndoe@bu.edu',
  },
  imageUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3ADefault_pfp.jpg&psig=AOvVaw1pXeUOt31X13IQTTuP7KJg&ust=1746383498261000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKDO9NH3h40DFQAAAAAdAAAAABAE',
};
const mockSession = {
  id: 'session_1234567890abcdef',
  lastActiveAt: '2023-06-15T12:00:00Z',
  expireAt: '2023-06-16T12:00:00Z',
};

// Mock the clipboard API
describe('InfoTab Component', () => {
  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('renders loading state when no user is provided', () => {
    // Check if loading state is displayed
    render(<InfoTab user={null} session={null} />);
    expect(screen.getByText('Please sign in to view your account.')).toBeInTheDocument();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('renders user profile section correctly', () => {
    render(<InfoTab user={mockUser} session={mockSession} />);
    
    // Check user name
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Check email
    expect(screen.getByText('johndoe@bu.edu')).toBeInTheDocument();
    
    // Check verified chip
    expect(screen.getByText('Verified Account')).toBeInTheDocument();
    
    // Check affiliation chip (should be detected from email)
    expect(screen.getByText('Boston University')).toBeInTheDocument();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('displays account details correctly', () => {
    render(<InfoTab user={mockUser} session={mockSession} />);
    
    // Check full name field
    const nameField = screen.getByLabelText('Full Name') as HTMLInputElement;
    expect(nameField.value).toBe('John Doe');
    expect(nameField).toBeDisabled();
    
    // Check email field
    const emailField = screen.getByLabelText('Email Address') as HTMLInputElement;
    expect(emailField.value).toBe('johndoe@bu.edu');
    expect(emailField).toBeDisabled();
    
    // Check affiliation field
    const affiliationField = screen.getByLabelText('Institution Affiliation') as HTMLInputElement;
    expect(affiliationField.value).toBe('Boston University');
    expect(affiliationField).toBeDisabled();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('copies session ID to clipboard when copy button is clicked', async () => {
    render(<InfoTab user={mockUser} session={mockSession} />);
    
    // Mock clipboard API
    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);
    
    // Check that clipboard API was called
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockSession.id);
    
    // Check that snackbar appears
    await waitFor(() => {
      expect(screen.getByText('Session ID copied to clipboard')).toBeInTheDocument();
    });
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('handles missing session data', () => {
    const incompleteSession = {
      id: null,
      lastActiveAt: null,
      expireAt: null,
    };
    
    // Check if "Not available" is displayed for session data
    render(<InfoTab user={mockUser} session={incompleteSession} />);
    expect(screen.getAllByText('Not available')).toHaveLength(3);
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('detects affiliation from email domain', () => {
    const harvardUser = {
      ...mockUser,
      primaryEmailAddress: {
        emailAddress: 'john.doe@harvard.edu',
      },
    };

    // Check if the affiliation is detected correctly
    render(<InfoTab user={harvardUser} session={mockSession} />);
    expect(screen.getByText('Harvard University')).toBeInTheDocument();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('shows "No Affiliation Detected" for unknown domains', () => {
    const unknownDomainUser = {
      ...mockUser,
      primaryEmailAddress: {
        emailAddress: 'johndoe@unknown.edu',
      },
    };
    
    // Check if "No Affiliation Detected" is displayed
    render(<InfoTab user={unknownDomainUser} session={mockSession} />);
    expect(screen.getByText('No Affiliation Detected')).toBeInTheDocument();
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('displays avatar with user image', () => {
    render(<InfoTab user={mockUser} session={mockSession} />);
    
    // Check if the avatar image is displayed
    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toHaveAttribute('src', mockUser.imageUrl);
  });

	//------------------------------------------------------------------------------------------------------------------------
  test('displays default avatar when no image is provided', () => {
		const userWithoutImage = {
			...mockUser,
			imageUrl: undefined,
		};
		
    // Check if the default avatar is displayed
		render(<InfoTab user={userWithoutImage} session={mockSession} />);
		const defaultAvatar = screen.getByTestId('PersonIcon');
		expect(defaultAvatar).toBeInTheDocument();
	});
	//------------------------------------------------------------------------------------------------------------------------
});