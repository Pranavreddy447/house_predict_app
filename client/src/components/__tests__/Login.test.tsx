import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import * as api from '../../api';

// Mock the api module
vi.mock('../../api', () => ({
  login: vi.fn(),
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

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders login form', () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </GoogleOAuthProvider>
    );
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Sign in$/i })).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    (api.login as any).mockResolvedValue({ token: 'fake-token', user: { username: 'test' } });
    
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </GoogleOAuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /^Sign in$/i }));

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
      expect(navigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles login failure', async () => {
    (api.login as any).mockRejectedValue(new Error('Invalid credentials'));
    
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </GoogleOAuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    
    fireEvent.click(screen.getByRole('button', { name: /^Sign in$/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
