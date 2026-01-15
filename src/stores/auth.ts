"use client";

import { create } from "zustand";

interface User {
  id: number;
  uuid: string;
  email: string;
  name?: string;
  role: "customer" | "admin";
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  isAuthenticated: () => get().user !== null,
  isAdmin: () => get().user?.role === "admin",
}));

