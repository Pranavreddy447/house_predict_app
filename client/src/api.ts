const BASE_URL = '/api';

export interface PredictionRequest {
  total_sqft: number;
  bhk: number;
  bath: number;
  location: string;
}

export interface PredictionResponse {
  estimated_price: number;
}

export interface LocationsResponse {
  locations: string[];
}

export const getLocations = async (): Promise<string[]> => {
  const response = await fetch(`${BASE_URL}/get_location_names/`);
  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }
  const data: LocationsResponse = await response.json();
  return data.locations;
};

export const login = async (credentials: any) => {
  const response = await fetch(`${BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }
  return response.json();
};

export const signup = async (userData: any) => {
  const response = await fetch(`${BASE_URL}/auth/signup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Signup failed');
  }
  return response.json();
};

export const logout = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/auth/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
  });
  if (!response.ok) {
    console.error('Logout failed on server');
  }
  // Always clear local storage even if server fails
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const predictPrice = async (req: PredictionRequest): Promise<number> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/predict_home_price/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(req),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || errorData.error || 'Failed to predict price');
  }
  
  const data: PredictionResponse = await response.json();
  return data.estimated_price;
};

export const googleLogin = async (access_token: string) => {
  const response = await fetch(`${BASE_URL}/auth/google/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: access_token,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Google login failed');
  }
  return response.json();
};
