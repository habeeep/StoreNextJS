export interface BaseUser {
    id: string;
    email: string;
    surname?: string;
    name?: string;
    patronymic?: string;
    phoneNumber?: string;
    role: 'user' | 'admin';
}

export interface Customer extends BaseUser {
    role: 'user';
    address?: string;
}

export interface Admin extends BaseUser {
    role: 'admin';
}

export type User = Customer | Admin;

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

export interface RequestCodeRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface ResendCodeRequest {
  email: string;
}

export interface BaseResponse {
  success: boolean;
  message?: string;
}

export interface VerifyCodeResponse extends BaseResponse {
  user?: User;
  token?: string;
}