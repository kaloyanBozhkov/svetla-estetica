"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: number;
  productUuid: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  imageUrl?: string;
  outOfStock?: boolean;
}

interface SyncResult {
  removedCount: number;
  adjustedCount: number;
  outOfStockCount: number;
}

interface CartState {
  items: CartItem[];
  lastAddedAt: number;
  isSyncing: boolean;
  lastSyncedAt: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  syncWithDb: () => Promise<SyncResult>;
  hasOutOfStockItems: () => boolean;
  saveToDb: () => void;
}

// Debounced save to database
let saveTimeout: NodeJS.Timeout | null = null;
const debouncedSaveToDb = (items: CartItem[]) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      await fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
    } catch (error) {
      console.error("Failed to save cart to DB:", error);
    }
  }, 1000);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastAddedAt: 0,
      isSyncing: false,
      lastSyncedAt: 0,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            const newQuantity = Math.min(existing.quantity + 1, item.stock);
            const newItems = state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: newQuantity, stock: item.stock, outOfStock: false }
                : i
            );
            debouncedSaveToDb(newItems);
            return { lastAddedAt: Date.now(), items: newItems };
          }
          const newItems = [...state.items, { ...item, quantity: 1, outOfStock: false }];
          debouncedSaveToDb(newItems);
          return { lastAddedAt: Date.now(), items: newItems };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.productId !== productId);
          debouncedSaveToDb(newItems);
          return { items: newItems };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => {
          const newItems = state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: i.stock ? Math.min(quantity, i.stock) : quantity }
              : i
          );
          debouncedSaveToDb(newItems);
          return { items: newItems };
        });
      },

      clearCart: () => {
        debouncedSaveToDb([]);
        set({ items: [] });
      },

      saveToDb: () => {
        debouncedSaveToDb(get().items);
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      hasOutOfStockItems: () => {
        return get().items.some((item) => item.outOfStock || item.stock <= 0);
      },

      syncWithDb: async () => {
        const { items } = get();
        if (items.length === 0) {
          return { removedCount: 0, adjustedCount: 0, outOfStockCount: 0 };
        }

        set({ isSyncing: true });

        try {
          const res = await fetch("/api/cart/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
            }),
          });

          if (!res.ok) {
            throw new Error("Failed to validate cart");
          }

          const data = await res.json();
          const removedCount = data.removed.length;
          let adjustedCount = 0;
          let outOfStockCount = 0;

          // Build new items array from validated data
          const newItems: CartItem[] = data.items.map((item: {
            product_id: number;
            product_uuid: string;
            name: string;
            price: number;
            stock: number;
            image_url: string | null;
            quantity: number;
            quantity_adjusted: boolean;
            out_of_stock: boolean;
          }) => {
            if (item.quantity_adjusted) adjustedCount++;
            if (item.out_of_stock) outOfStockCount++;

            return {
              productId: item.product_id,
              productUuid: item.product_uuid,
              name: item.name,
              price: item.price,
              stock: item.stock,
              imageUrl: item.image_url || undefined,
              quantity: item.quantity,
              outOfStock: item.out_of_stock,
            };
          });

          set({ items: newItems, isSyncing: false, lastSyncedAt: Date.now() });

          return { removedCount, adjustedCount, outOfStockCount };
        } catch (error) {
          console.error("Cart sync error:", error);
          set({ isSyncing: false });
          return { removedCount: 0, adjustedCount: 0, outOfStockCount: 0 };
        }
      },
    }),
    { name: "cart-storage" }
  )
);

