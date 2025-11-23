import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import PredictionForm from '../PredictionForm';
import * as api from '../../api';

// Mock the api module
vi.mock('../../api', () => ({
  getLocations: vi.fn(),
  predictPrice: vi.fn(),
}));

describe('PredictionForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders form and fetches locations', async () => {
    (api.getLocations as any).mockResolvedValue(['Electronic City', 'Whitefield']);
    
    render(<PredictionForm />);

    expect(screen.getByText('Enter Property Details')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(api.getLocations).toHaveBeenCalled();
    });

    // Check if locations are populated
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Electronic City')).toBeInTheDocument();
    expect(screen.getByText('Whitefield')).toBeInTheDocument();
  });

  test('handles successful prediction', async () => {
    (api.getLocations as any).mockResolvedValue(['Electronic City']);
    (api.predictPrice as any).mockResolvedValue(50.5);
    
    render(<PredictionForm />);

    await waitFor(() => {
        expect(api.getLocations).toHaveBeenCalled();
    });

    fireEvent.change(screen.getByLabelText(/Area/i), { target: { value: '1200' } });
    fireEvent.change(screen.getByLabelText(/Bedrooms/i), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/Bathrooms/i), { target: { value: '2' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Electronic City' } });
    
    fireEvent.click(screen.getByRole('button', { name: /estimate price/i }));

    await waitFor(() => {
      expect(api.predictPrice).toHaveBeenCalledWith({
        total_sqft: 1200,
        bhk: 3,
        bath: 2,
        location: 'Electronic City',
      });
      expect(screen.getByText('50.50')).toBeInTheDocument();
    });
  });

  test('handles prediction failure', async () => {
    (api.getLocations as any).mockResolvedValue(['Electronic City']);
    (api.predictPrice as any).mockRejectedValue(new Error('Prediction failed'));
    
    render(<PredictionForm />);

    await waitFor(() => {
        expect(api.getLocations).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole('button', { name: /estimate price/i }));

    await waitFor(() => {
      expect(screen.getByText('Prediction failed')).toBeInTheDocument();
    });
  });
});
