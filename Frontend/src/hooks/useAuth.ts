import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      signIn: async (email: string, password: string) => {
        try {
          const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (response.ok) {
            const data = await response.json();
            set({
              user: {
                id: data.id,
                email: data.email,
                name: email.split("@")[0],
              },
              isAuthenticated: true,
            });
            localStorage.setItem("authToken", data.token);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
          }
        } catch (error) {
          console.error("Error during login:", error);
          throw error;
        }
      },
      signUp: async (email: string, password: string, name: string) => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password, name }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            set({
              user: { id: data.id, email: data.email, name: data.name },
              isAuthenticated: true,
            });
            localStorage.setItem("authToken", data.token);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Registration failed");
          }
        } catch (error) {
          console.error("Error during registration:", error);
          throw error;
        }
      },
      signOut: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem("authToken");
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
