import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

interface WishlistState {
  items: Product[];
  add: (product: Product) => void;
  remove: (productId: number) => void;
  toggle: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  clear: () => void;
}

const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product: Product) =>
        set((state) => ({
          items: state.items.find((i) => i.id === product.id) ? state.items : [...state.items, product],
        })),
      remove: (productId: number) => set((state) => ({ items: state.items.filter((i) => i.id !== productId) })),
      toggle: (product: Product) => {
        const found = get().items.find((i) => i.id === product.id);
        if (found) get().remove(product.id);
        else get().add(product);
      },
      isInWishlist: (productId: number) => !!get().items.find((i) => i.id === productId),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
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

export default useWishlist;
