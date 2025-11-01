import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  dark: boolean;
  toggle: () => void;
  set: (val: boolean) => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      dark: false,
      toggle: () => set((s) => ({ dark: !s.dark })),
      set: (val: boolean) => set({ dark: val }),
    }),
    {
      name: 'theme-storage',
      storage: {
        getItem: (name) => {
          const v = localStorage.getItem(name);
          return Promise.resolve(v ? JSON.parse(v) : null);
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
            return Promise.resolve();
          } catch (e) {
            return Promise.reject(e);
          }
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
          return Promise.resolve();
        },
      },
    }
  )
);

export default useThemeStore;
