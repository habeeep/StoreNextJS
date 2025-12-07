import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  AuthState, 
  User, 
  VerifyCodeRequest, 
  VerifyCodeResponse,
  RequestCodeRequest,
  ResendCodeRequest
} from '@/types/auth';
import { authApi } from '@/lib/api/authApi';

export const requestCode = createAsyncThunk(
  'auth/requestCode',
  async (data: RequestCodeRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.requestCode(data);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка отправки кода');
    }
  }
);

export const verifyCode = createAsyncThunk(
  'auth/verifyCode',
  async (credentials: VerifyCodeRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyCode(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка входа');
    }
  }
);

export const resendCode = createAsyncThunk(
  'auth/resendCode',
  async (data: ResendCodeRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.resendCode(data);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка повторной отправки');
    }
  }
);

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestCode.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(requestCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(verifyCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.user && action.payload.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(resendCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendCode.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resendCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;