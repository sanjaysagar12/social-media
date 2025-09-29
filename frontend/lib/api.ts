// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  
  // API Endpoints
  ENDPOINTS: {
    // Auth
    LOGIN: '/api/auth/login',
    
    // User
    USER_PROFILE: '/api/user/me',
    
    // Steps
  STEPS: '/api/step',
  MY_STEPS: '/api/step/my',
  EXPLORE: '/api/step/explore',
  STEP_BY_ID: (id: string) => `/api/step/${id}`,
  JOIN_STEP: (id: string) => `/api/step/${id}/join`,
  STEP_POSTS: (id: string) => `/api/step/${id}/posts`,
    
    // Posts
    POSTS: '/api/post',
    
    // Blockchain
    DISTRIBUTE_FUNDS: '/etherlink/distribute-funds',
  }
};

// Helper function to get full URL
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for common fetch options
export const getAuthHeaders = (token?: string) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};