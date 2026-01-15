import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CustomizerState } from '@/types/customizer';
import { customizerApi } from '@/lib/api/customizerApi';

const initialState: CustomizerState = {
  title: 'Store',
  theme: 'default',
  background: 'default',
  font: 'default',
  loading: false,
  error: null,
};

export const fetchCustomizations = createAsyncThunk(
  'customizer/fetchCustomizations',
  async (_, { rejectWithValue }) => {
    try {
      const customizations = await customizerApi.getAllCustomizations();
      return customizations;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch customizations'
      );
    }
  }
);

const customizerSlice = createSlice({
  name: 'customizer',
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
    setBackground: (state, action: PayloadAction<string>) => {
      state.background = action.payload;
    },
    setFont: (state, action: PayloadAction<string>) => {
      state.font = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomizations.fulfilled, (state, action) => {
        state.loading = false;
        state.title = action.payload.title;
        state.theme = action.payload.theme;
        state.background = action.payload.background;
        state.font = action.payload.font;
      })
      .addCase(fetchCustomizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTitle, setTheme, setBackground, setFont } = customizerSlice.actions;
export default customizerSlice.reducer;
