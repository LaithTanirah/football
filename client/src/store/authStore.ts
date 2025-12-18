import { create } from 'zustand';
import { authApi } from '@/lib/api';

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
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    try {
      set({ isLoading: true });
      const response = await authApi.me();
      // Response will have null user if not authenticated (handled by interceptor)
      set({ user: response.data.data.user || null, isLoading: false });
    } catch (error: any) {
      // This should rarely happen now since interceptor handles 401s
      console.error('Fetch user error:', error);
      set({ user: null, isLoading: false });
    }
  },
  // Method to set loading state directly (for auth pages)
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null });
    }
  },
}));

