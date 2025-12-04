export interface User {
    id: string;
    email: string;
    name: string;
    surname: string;
    role: 'user' | 'admin';
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

export interface RequestCodeRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
  code: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}