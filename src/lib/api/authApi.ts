import { 
  RequestCodeRequest, 
  VerifyCodeRequest, 
  VerifyCodeResponse,
  ResendCodeRequest,
  BaseResponse 
} from '@/types/auth';

const API_BASE = '/backend/auth';

const createMockUser = (email: string) => ({
  id: Date.now().toString(),
  email: email,
  role: 'admin' as const,
});

export const authApi = {
  async requestCodeLogin(data: RequestCodeRequest): Promise<BaseResponse> {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email }),
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при отправке кода');
    }
    
    try {
      const result = await response.json();
      return result;
    } catch {
      return { success: true };
    }
  },

  async requstCodeRegister(data: RequestCodeRequest): Promise<BaseResponse> {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email }),
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при отправке кода');
    }
    
    try {
      const result = await response.json();
      return result;
    } catch {
      return { success: true };
    }
  },

  async verifyCode(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    const response = await fetch(`${API_BASE}/code/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: data.email, 
        code: data.code 
      }),
    });
    
    if (!response.ok) {
      throw new Error('Неверный код подтверждения');
    }
    
    try {
      const result = await response.json();
      
      if (result.user && result.token) {
        return result;
      }
      
      return {
        success: true,
        user: createMockUser(data.email),
        token: 'jwt-token-' + Date.now(),
      };
    } catch {
      return {
        success: true,
        user: createMockUser(data.email),
        token: 'jwt-token-' + Date.now(),
      };
    }
  },

  async resendCode(data: ResendCodeRequest): Promise<BaseResponse> {
    const response = await fetch(`${API_BASE}/code/resend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email }),
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при повторной отправке кода');
    }
    
    try {
      const result = await response.json();
      return result;
    } catch {
      return { success: true };
    }
  },
};