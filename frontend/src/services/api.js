import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, role) => api.post('/auth/register', { name, email, password, role }),
  getProfile: () => api.get('/auth/me'),
};

// Course APIs
export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  getLessons: (courseId) => api.get(`/courses/${courseId}/lessons`),
  create: (courseData) => api.post('/courses', courseData),
  update: (id, courseData) => api.put(`/courses/${id}`, courseData),
  delete: (id) => api.delete(`/courses/${id}`),
  addSection: (courseId, sectionData) => api.post(`/courses/${courseId}/sections`, sectionData),
  addLesson: (courseId, sectionId, lessonData) => api.post(`/courses/${courseId}/sections/${sectionId}/lessons`, lessonData),
};

// Enrollment APIs
export const enrollmentsAPI = {
  enroll: (courseId) => api.post(`/enrollments/${courseId}/enroll`),
  getMyCourses: () => api.get('/enrollments/my-courses'),
  getCourseStudents: (courseId) => api.get(`/enrollments/course/${courseId}/students`),
  checkStatus: (courseId) => api.get(`/enrollments/course/${courseId}/status`),
};

// Progress APIs
export const progressAPI = {
  markComplete: (courseId, lessonId) => api.post('/progress/lesson/complete', { courseId, lessonId }),
  getCourseProgress: (courseId) => api.get(`/progress/${courseId}`),
  getProgressPercentage: (courseId) => api.get(`/progress/${courseId}/percentage`),
  getLastWatched: (courseId) => api.get(`/progress/${courseId}/last-watched`),
  updateProgress: (courseId, lessonId, completed) => api.put('/progress/update', { courseId, lessonId, completed }),
};

export default api;
