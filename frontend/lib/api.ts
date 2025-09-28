// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  
  // API Endpoints
  ENDPOINTS: {
    // Auth
    LOGIN: '/api/auth/login',
    
    // User
    USER_PROFILE: '/api/user/me',
    
    // Events
  EVENTS: '/api/step',
  MY_EVENTS: '/api/step/my',
  EXPLORE: '/api/step/explore',
  EVENT_BY_ID: (id: string) => `/api/step/${id}`,
  JOIN_EVENT: (id: string) => `/api/step/${id}/join`,
  EVENT_POSTS: (id: string) => `/api/step/${id}/posts`,
    
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