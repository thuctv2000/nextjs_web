'use client';

import { create } from 'zustand';
import { UserResponseDto } from '@/core/application/dtos';

interface UserState {
  user: UserResponseDto | null;
  users: UserResponseDto[];
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  setUser: (user: UserResponseDto | null) => void;
  setUsers: (users: UserResponseDto[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: UserState = {
  user: null,
  users: [],
  isLoading: false,
  error: null,
};

export const useUserStore = create<UserState & UserActions>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),
  setUsers: (users) => set({ users }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
