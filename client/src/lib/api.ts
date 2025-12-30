import axios from 'axios';
import { getToken, clearToken } from '@/auth/token';

const api = axios.create({
  baseURL: '/api',
});

// Add Accept-Language header and Authorization header based on current locale and token
api.interceptors.request.use((config) => {
  // Get locale from localStorage (since we can't use hooks in interceptor)
  const locale = (localStorage.getItem('locale') as 'ar' | 'en') || 'ar';
  config.headers['Accept-Language'] = locale;
  
  // Add Authorization header if token exists
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});

// Handle 401 errors - clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // On 401 (Unauthorized), clear token and user state
    if (error.response?.status === 401) {
      // Don't clear token for login/register endpoints (they handle their own errors)
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                             error.config?.url?.includes('/auth/register');
      
      if (!isAuthEndpoint) {
        clearToken();
        // Redirect to login if we're not already there
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);


export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

// Auth
export const authApi = {
  register: (data: { name: string; username: string; email: string; password: string; phone?: string; city?: string }) =>
    api.post<ApiResponse<{ user: any; token: string }>>('/auth/register', data),
  login: (data: { username: string; password: string }) =>
    api.post<ApiResponse<{ user: any; token: string }>>('/auth/login', data),
  logout: () => api.post<ApiResponse<{ message: string }>>('/auth/logout'),
  me: () => api.get<ApiResponse<{ user: any }>>('/auth/me'),
};

// Pitches
export const pitchesApi = {
  getAll: (params?: { city?: string; indoor?: string; minPrice?: number; maxPrice?: number; search?: string }) =>
    api.get<ApiResponse<any[]>>('/pitches', { params }),
  getById: (id: string) => api.get<ApiResponse<any>>(`/pitches/${id}`),
  getAvailability: (id: string, date: string) =>
    api.get<ApiResponse<{ availableSlots: string[]; date: string }>>(`/pitches/${id}/availability`, { params: { date } }),
};

// Bookings
export const bookingsApi = {
  create: (data: { pitchId: string; date: string; startTime: string; durationMinutes?: number }) =>
    api.post<ApiResponse<any>>('/bookings', data),
  getMyBookings: () => api.get<ApiResponse<any[]>>('/bookings/me'),
  cancel: (id: string) => api.patch<ApiResponse<any>>(`/bookings/${id}/cancel`),
};

// Teams
export const teamsApi = {
  create: (data: { name: string; city: string; logoUrl?: string; preferredPitchId?: string }) =>
    api.post<ApiResponse<any>>('/teams', data),
  getAll: (params?: { city?: string; search?: string }) =>
    api.get<ApiResponse<any[]>>('/teams', { params }),
  getById: (id: string) => api.get<ApiResponse<any>>(`/teams/${id}`),
  update: (id: string, data: { name?: string; city?: string; logoUrl?: string; preferredPitchId?: string }) =>
    api.patch<ApiResponse<any>>(`/teams/${id}`, data),
  getSuggestions: (id: string) => api.get<ApiResponse<any[]>>(`/teams/${id}/suggestions`),
  addMember: (id: string, data: { userId: string }) =>
    api.post<ApiResponse<any>>(`/teams/${id}/members`, data),
  removeMember: (id: string, userId: string) =>
    api.delete<ApiResponse<any>>(`/teams/${id}/members/${userId}`),
  getSquad: (id: string) => api.get<ApiResponse<any>>(`/teams/${id}/squad`),
  updateSquad: (id: string, data: { mode: 5 | 6; formationId?: string; slots: Array<{ slotKey: string; playerId: string | null }> }) =>
    api.put<ApiResponse<any>>(`/teams/${id}/squad`, data),
};

// Users
export const usersApi = {
  search: (params: { q: string; excludeTeamId?: string; limit?: number }) =>
    api.get<ApiResponse<any[]>>('/users/search', { params }),
  getMe: () => api.get<ApiResponse<any>>('/users/me'),
  updateMe: (data: { name?: string; username?: string; city?: string; bio?: string | null; avatar?: string | null }) =>
    api.patch<ApiResponse<any>>('/users/me', data),
  getStats: () => api.get<ApiResponse<{ teamsCount: number; leaguesCount: number; bookingsCount: number; postsCount: number }>>('/users/me/stats'),
};

// Leagues
export const leaguesApi = {
  create: (data: { name: string; city: string; season?: string; startDate?: string }) =>
    api.post<ApiResponse<any>>('/leagues', data),
  getAll: (params?: { city?: string; status?: string; search?: string }) =>
    api.get<ApiResponse<any[]>>('/leagues', { params }),
  getById: (id: string) => api.get<ApiResponse<any>>(`/leagues/${id}`),
  update: (id: string, data: { name?: string; city?: string; season?: string; startDate?: string }) =>
    api.patch<ApiResponse<any>>(`/leagues/${id}`, data),
  addTeam: (id: string, data: { teamId: string }) =>
    api.post<ApiResponse<any>>(`/leagues/${id}/teams`, data),
  removeTeam: (id: string, teamId: string) =>
    api.delete<ApiResponse<any>>(`/leagues/${id}/teams/${teamId}`),
  lock: (id: string) => api.post<ApiResponse<any>>(`/leagues/${id}/lock`),
  getStandings: (id: string) => api.get<ApiResponse<any[]>>(`/leagues/${id}/standings`),
};

// Matches
export const matchesApi = {
  generateSchedule: (leagueId: string) =>
    api.post<ApiResponse<any>>(`/matches/leagues/${leagueId}/generate-schedule`),
  getLeagueMatches: (leagueId: string) =>
    api.get<ApiResponse<any[]>>(`/matches/leagues/${leagueId}/matches`),
  recordResult: (id: string, data: { homeScore: number; awayScore: number }) =>
    api.post<ApiResponse<any>>(`/matches/${id}/result`, data),
  update: (id: string, data: { scheduledDate?: string; scheduledTime?: string; pitchId?: string; bookingId?: string }) =>
    api.patch<ApiResponse<any>>(`/matches/${id}`, data),
};

// Admin
export const adminApi = {
  createPitch: (data: any) => api.post<ApiResponse<any>>('/admin/pitches', data),
  updatePitch: (id: string, data: any) => api.patch<ApiResponse<any>>(`/admin/pitches/${id}`, data),
  updateWorkingHours: (id: string, data: { dayOfWeek: number; openTime: string; closeTime: string }) =>
    api.patch<ApiResponse<any>>(`/admin/pitches/${id}/working-hours`, data),
  blockSlot: (id: string, data: { date: string; startTime: string; endTime: string; reason?: string }) =>
    api.post<ApiResponse<any>>(`/admin/pitches/${id}/block-slot`, data),
  deleteBlockedSlot: (id: string) => api.delete<ApiResponse<any>>(`/admin/blocked-slots/${id}`),
  getBookings: (params?: { pitchId?: string; date?: string }) =>
    api.get<ApiResponse<any[]>>('/admin/bookings', { params }),
};

// Uploads
export const uploadsApi = {
  uploadTeamLogo: (data: { image: string }) =>
    api.post<ApiResponse<{ url: string }>>('/uploads/team-logo', data),
};

// Posts
export const postsApi = {
  getAll: (params?: {
    search?: string;
    city?: string;
    tagType?: 'pitches' | 'teams';
    tagId?: string;
    page?: number;
    limit?: number;
    sort?: 'newest' | 'mostLiked';
  }) => api.get<ApiResponse<any[]>>('/posts', { params }),
  getById: (id: string) => api.get<ApiResponse<any>>(`/posts/${id}`),
  create: (data: {
    content: string;
    city?: string;
    pitchId?: string;
    teamId?: string;
    mediaType?: 'none' | 'image';
    mediaUrl?: string;
  }) => api.post<ApiResponse<any>>('/posts', data),
  update: (id: string, data: {
    content?: string;
    mediaType?: 'none' | 'image';
    mediaUrl?: string | null;
  }) => api.patch<ApiResponse<any>>(`/posts/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<{ message: string }>>(`/posts/${id}`),
  like: (id: string) => api.post<ApiResponse<{ message: string }>>(`/posts/${id}/like`),
  unlike: (id: string) => api.delete<ApiResponse<{ message: string }>>(`/posts/${id}/like`),
  getComments: (id: string, params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse<any[]>>(`/posts/${id}/comments`, { params }),
  createComment: (id: string, data: { content: string }) =>
    api.post<ApiResponse<any>>(`/posts/${id}/comments`, data),
  deleteComment: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/posts/comments/${id}`),
};

export default api;

