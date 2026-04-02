const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  BASE: API_BASE_URL,
  AUTH: `${API_BASE_URL}/api/auth`,
  PROJECTS: `${API_BASE_URL}/api/projects`,
  POSTS: `${API_BASE_URL}/api/posts`,
  SKILLS: `${API_BASE_URL}/api/skills`,
  UPLOAD: `${API_BASE_URL}/api/upload`,
  ANALYTICS: `${API_BASE_URL}/api/analytics`,
  RESUME: `${API_BASE_URL}/api/resume`,
  SETTINGS: `${API_BASE_URL}/api/settings`,
  CONTACT: `${API_BASE_URL}/api/contact`,
  CONTENT: `${API_BASE_URL}/api/content`,
  EXPERIENCE: `${API_BASE_URL}/api/experience`,
  EDUCATION: `${API_BASE_URL}/api/education`
};

export default API_ENDPOINTS;
