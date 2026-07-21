"use client";

import { create } from "zustand";

interface AppState {
  remainingSeconds: number;
  isExpired: boolean;
  hasPosted: boolean;

  tickTimer: () => void;
  setPosted: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  remainingSeconds: 300,
  isExpired: false,
  hasPosted: false,

  tickTimer: () =>
    set((state) => {
      if (state.remainingSeconds <= 1) {
        return { remainingSeconds: 0, isExpired: true };
      }
      return { remainingSeconds: state.remainingSeconds - 1 };
    }),

  setPosted: () => set({ hasPosted: true }),
}));
