import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../Signup';
import * as api from '../../api';

// Mock the api module
vi.mock('../../api', () => ({
  signup: vi.fn(),
}));

// Mock useNavigate
const navigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders signup form', () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      </GoogleOAuthProvider>
    );
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Sign up$/i })).toBeInTheDocument();
  });

  test('handles successful signup', async () => {
    (api.signup as any).mockResolvedValue({ token: 'fake-token', user: { username: 'test' } });
    
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      </GoogleOAuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /^Sign up$/i }));

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(navigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles signup failure', async () => {
    (api.signup as any).mockRejectedValue(new Error('Signup failed'));
    
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      </GoogleOAuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /^Sign up$/i }));

    await waitFor(() => {
      expect(screen.getByText('Signup failed')).toBeInTheDocument();
    });
  });
});
