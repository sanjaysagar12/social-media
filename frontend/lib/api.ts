// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  
  // API Endpoints
  ENDPOINTS: {
    // Auth
    LOGIN: '/api/auth/login',
    
    // User
    USER_PROFILE: '/api/user/me',
    USER_BY_ID: (id: string) => `/api/user/${id}`,
    USER_BY_USERNAME: (username: string) => `/api/user/username/${username}`,
    
    // Steps
  STEPS: '/api/step',
  MY_STEPS: '/api/step/my',
  EXPLORE: '/api/step/explore',
  STEP_BY_ID: (id: string) => `/api/step/${id}`,
  JOIN_STEP: (id: string) => `/api/step/${id}/join`,
  STEP_POSTS: (id: string) => `/api/step/${id}/posts`,
  UPVOTE_POST: (postId: string) => `/api/step/post/${postId}/upvote`,
  REMOVE_UPVOTE_POST: (postId: string) => `/api/step/post/${postId}/remove-upvote`,
  CREATE_COMMENT_REPLY: (commentId: string) => `/api/step/comment/${commentId}/reply`,
  CREATE_POST_COMMENT: (postId: string) => `/api/step/post/${postId}/comment`,
  STEP_PARTICIPANTS: (id: string) => `/api/step/${id}/participants`,
  SELECT_WINNER: (id: string) => `/api/step/${id}/select-winner`,
  CREATE_STEP_POST: (stepId: string) => `/api/step/${stepId}/post`,
  LIKE_STEP: (stepId: string) => `/api/step/${stepId}/like`,
  UNLIKE_STEP: (stepId: string) => `/api/step/${stepId}/unlike`,
    
    // Posts
    POSTS: '/api/post',
    
    // Images
    UPLOAD_IMAGE: '/api/image',
    
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