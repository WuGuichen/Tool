import { create } from "zustand";
import { api } from "@/lib/api";
import type { PluginMeta, UserInfo } from "@/types";

interface AuthState {
  token: string | null;
  user: UserInfo | null;
  plugins: PluginMeta[];
  initialized: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: UserInfo | null) => void;
  setPlugins: (plugins: PluginMeta[]) => void;
  initialize: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem("token"),
  user: null,
  plugins: [],
  initialized: false,
  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
  },
  setUser: (user) => set({ user }),
  setPlugins: (plugins) => set({ plugins }),
  initialize: async () => {
    const token = get().token;
    if (!token) {
      set({ user: null, plugins: [], initialized: true });
      return;
    }
    try {
      const [userResp, pluginsResp] = await Promise.all([
        api.get<UserInfo>("/users/me"),
        api.get<PluginMeta[]>("/plugins/me"),
      ]);
      set({
        user: userResp.data,
        plugins: pluginsResp.data,
        initialized: true,
      });
    } catch {
      localStorage.removeItem("token");
      set({ token: null, user: null, plugins: [], initialized: true });
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null, plugins: [], initialized: true });
    window.location.href = "/login";
  },
}));
