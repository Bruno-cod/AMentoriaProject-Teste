import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserData } from "@/types/auth";

interface AuthState {
  user: UserData | null;
  registeredUsers: UserData[];
  register: (userData: UserData) => boolean;
  login: (email: string) => UserData | null; 
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      registeredUsers: [], 

      register: (userData) => {
        const currentUsers = get().registeredUsers;

        const emailJaExiste = currentUsers.some(
          (u) => u.email === userData.email
        );
        if (emailJaExiste) return false;

        set({
          registeredUsers: [...currentUsers, userData],
          user: userData, 
        });
        return true;
      },

      login: (email) => {
        const foundUser = get().registeredUsers.find(
          (u) => u.email === email
        );

        if (foundUser) {
          set({ user: foundUser });
          return foundUser; 
        }
        return null;
      },

      logout: () => {
        set({ user: null }); 
      },
    }),
    {
      name: "amentoria-auth",
    }
  )
);