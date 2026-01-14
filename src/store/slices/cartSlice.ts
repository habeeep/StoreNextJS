import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { basketsApi } from '@/lib/api/basketsApi';

export interface FrontCartItem {
  id: string; // local id or backend item id
  productId: string; // goodId
  name?: string;
  price?: number;
  quantity: number;
  status?: 'SELECTED' | 'NOT_SELECTED' | 'PROCESSING_PAYMENT' | 'PAID';
}

export interface CartState {
  items: FrontCartItem[];
  isLoading: boolean;
  error: string | null;
}

const LOCAL_KEY = 'local_cart_v1';

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
};

function readLocal(): FrontCartItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FrontCartItem[];
  } catch {
    return [];
  }
}

function writeLocal(items: FrontCartItem[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  } catch {}
}

export const initCart = createAsyncThunk('cart/init', async (_, { getState }) => {
  const state = getState() as RootState;
  const user = state.auth.user;
  if (!user) {
    // load from localStorage
    return { items: readLocal() };
  }

  const backend = await basketsApi.getBasket(user.email);
  // map backend items to FrontCartItem
  const items = (backend?.items || []).map((it: any) => ({
    id: it.id,
    productId: it.goodId,
    name: it.goodTitle,
    price: it.goodPrice,
    quantity: it.quantity,
    status: it.status,
  }));
  return { items };
});

export const addItem = createAsyncThunk(
  'cart/addItem',
  async (
    { productId, quantity, name, price }: { productId: string; quantity?: number; name?: string; price?: number },
    { getState }
  ) => {
    const state = getState() as RootState;
    const user = state.auth.user;
    const qty = quantity || 1;
    if (!user) {
      // handled in reducer synchronously; include product metadata for local storage
      return { local: true, item: { id: `${productId}`, productId, quantity: qty, name, price } };
    }

    const added = await basketsApi.addItem(user.email, { goodId: productId, quantity: qty, status: 'SELECTED' });
    // backend returns created item
    return { local: false, item: { id: added.id, productId: added.goodId, name: added.goodTitle, price: added.goodPrice, quantity: added.quantity, status: added.status } };
  }
);

export const updateItem = createAsyncThunk(
  'cart/updateItem',
  async ({ id, quantity, status }: { id: string; quantity?: number; status?: string }, { getState }) => {
    const state = getState() as RootState;
    const user = state.auth.user;
    if (!user) {
      return { local: true, item: { id, quantity, status } };
    }
    const updated = await basketsApi.updateItem(id, { quantity, status });
    return { local: false, item: { id: updated.id, productId: updated.goodId, name: updated.goodTitle, price: updated.goodPrice, quantity: updated.quantity, status: updated.status } };
  }
);

export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async ({ id }: { id: string }, { getState }) => {
    const state = getState() as RootState;
    const user = state.auth.user;
    if (!user) {
      return { local: true, id };
    }
    await basketsApi.deleteItem(id);
    return { local: false, id };
  }
);

export const migrateLocalToBackend = createAsyncThunk('cart/migrate', async (_, { getState }) => {
  const state = getState() as RootState;
  const user = state.auth.user;
  if (!user) return { migrated: false };
  const localItems = readLocal();
  for (const it of localItems) {
    try {
      await basketsApi.addItem(user.email, { goodId: it.productId, quantity: it.quantity, status: it.status || 'SELECTED' });
    } catch (err) {
      // continue
      console.warn('migrate item failed', err);
    }
  }
  // clear local
  writeLocal([]);
  // return new basket
  const backend = await basketsApi.getBasket(user.email);
  const items = (backend?.items || []).map((it: any) => ({
    id: it.id,
    productId: it.goodId,
    name: it.goodTitle,
    price: it.goodPrice,
    quantity: it.quantity,
    status: it.status,
  }));
  return { migrated: true, items };
});

const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initCart.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(initCart.fulfilled, (s, a: PayloadAction<{ items: FrontCartItem[] }>) => { s.isLoading = false; s.items = a.payload.items || []; })
      .addCase(initCart.rejected, (s, a) => { s.isLoading = false; s.error = a.error.message || 'init failed'; })

      .addCase(addItem.fulfilled, (s, a: any) => {
        const { local, item } = a.payload;
        if (local) {
          const existing = s.items.find(i => i.productId === item.productId);
          if (existing) {
            existing.quantity = (existing.quantity || 0) + item.quantity;
            // update metadata if provided
            if (item.name) existing.name = item.name;
            if (item.price !== undefined) existing.price = item.price;
          } else {
            s.items.push({ id: item.id, productId: item.productId, quantity: item.quantity, name: item.name, price: item.price });
          }
          writeLocal(s.items);
        } else {
          s.items.push(item);
        }
      })

      .addCase(updateItem.fulfilled, (s, a: any) => {
        const { local, item } = a.payload;
        if (local) {
          const it = s.items.find(x => x.id === item.id || x.productId === item.id);
          if (it) {
            if (item.quantity !== undefined) it.quantity = item.quantity;
            if (item.status) it.status = item.status;
          }
          writeLocal(s.items);
        } else {
          const it = s.items.find(x => x.id === item.id);
          if (it) {
            it.quantity = item.quantity;
            it.status = item.status;
          }
        }
      })

      .addCase(removeItem.fulfilled, (s, a: any) => {
        const { local, id } = a.payload;
        if (local) {
          s.items = s.items.filter(x => x.id !== id && x.productId !== id);
          writeLocal(s.items);
        } else {
          s.items = s.items.filter(x => x.id !== id);
        }
      })

      .addCase(migrateLocalToBackend.fulfilled, (s, a: any) => {
        if (a.payload.migrated) {
          s.items = a.payload.items || [];
        }
      });
  }
});

export const { clearError } = slice.actions;
export default slice.reducer;

export const selectCart = (state: RootState) => state.cart;
