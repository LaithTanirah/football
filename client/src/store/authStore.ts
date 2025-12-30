import { create } from 'zustand';
import { authApi } from '@/lib/api';
import { getToken, setToken, clearToken } from '@/auth/token';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN' | 'PITCH_OWNER';
  city?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  setTokenAndUser: (token: string, user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    try {
      set({ isLoading: true });
      const token = getToken();
      
      // If no token, user is not authenticated
      if (!token) {
        set({ user: null, isLoading: false });
        return;
      }
      
      // Token exists, try to fetch user
      const response = await authApi.me();
      set({ user: response.data.data.user || null, isLoading: false });
    } catch (error: any) {
      // If 401, token is invalid - clear it
      if (error.response?.status === 401) {
        clearToken();
      }
      console.error('Fetch user error:', error);
      set({ user: null, isLoading: false });
    }
  },
  // Method to set loading state directly (for auth pages)
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  // Method to set both token and user (used after login/register)
  setTokenAndUser: (token: string, user: User) => {
    setToken(token);
    set({ user });
  },
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearToken();
      set({ user: null });
    }
  },
}));

