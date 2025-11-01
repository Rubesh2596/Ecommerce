import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

// Define the state structure and actions
interface CartState {
  items: CartItem[];
  // accept any product shape here (may include quantity) to support modal calls
  addItem: (product: any) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

// Create the Zustand store
const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product: any) =>
            set((state) => {
              // product might include quantity when called from ProductDetailModal
              const qty = (product as any).quantity ?? 1;
              const existingItem = state.items.find((item) => item.id === product.id);
              if (existingItem) {
                // If item exists, add the passed quantity
                return {
                  items: state.items.map((item) =>
                    item.id === product.id
                      ? { ...item, quantity: item.quantity + qty }
                      : item
                  ),
                };
              }
              // Otherwise, add the new product with passed quantity
              return { items: [...state.items, { ...product, quantity: qty }] };
            }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === productId ? { ...item, quantity } : item
            )
            .filter((item) => item.quantity > 0), // Remove item if quantity drops to 0 or less
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // key in localStorage
      // zustand persist accepts `storage` option; in browser this maps to localStorage
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

// Ensure you are using 'export default' here
export default useCartStore;

