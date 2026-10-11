import { create } from "zustand";
import type { Artist, User } from "./types/common";

type UserStore = {
  user: User | null;
  isLoggedIn: boolean;
  addUser: (user: UserStore["user"]) => void;
  updateUser: (updates: Partial<User>) => void;
  removeUser: () => void;
};

type ArtistStore = {
  artist: Artist | null;
  addArtist: (artist: ArtistStore["artist"]) => void;
  removeArtist: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoggedIn: false,
  addUser: (user) => {
    set({ user, isLoggedIn: !!user });
  },
  updateUser: (updates: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },
  removeUser: () => {
    set({ user: null, isLoggedIn: false });
  },
}));

export const useArtistStore = create<ArtistStore>((set) => ({
  artist: null,
  addArtist: (artist) => {
    set({ artist });
  },
  removeArtist: () => {
    set({ artist: null });
  },
}));
