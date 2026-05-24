import { create } from "zustand";

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (admin: AdminUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  admin: null,
  isAuthenticated: false,
  login: (admin) => set({ admin, isAuthenticated: true }),
  logout: () => set({ admin: null, isAuthenticated: false }),
}));
