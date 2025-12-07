import { 
  RequestCodeRequest, 
  VerifyCodeRequest, 
  VerifyCodeResponse,
  ResendCodeRequest,
  BaseResponse 
} from '@/types/auth';

const API_BASE = process.env.NODE_ENV === 'development' 
  ? '/backend' 
  : process.env.NEXT_PUBLIC_API_URL;

// Моковый пользователь для демо
const createMockUser = (email: string) => ({
  id: Date.now().toString(),
  email: email,
  role: 'user' as const,
});

export const authApi = {
  // 1. Запрос кода на почту (возвращает только status)
  async requestCode(data: RequestCodeRequest): Promise<BaseResponse> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email }),
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при отправке кода');
    }
    
    // Если ответ успешный (200-299), но без JSON тела
    try {
      // Пробуем прочитать JSON, если он есть
      const result = await response.json();
      return result;
    } catch {
      // Если нет JSON, возвращаем успешный статус
      return { success: true };
    }
  },

  // 2. Проверка кода (вероятно тоже только status)
  async verifyCode(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    const response = await fetch(`${API_BASE}/auth/code/verify`, {
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
      // Пробуем прочитать JSON ответ
      const result = await response.json();
      
      // Если бекенд возвращает данные пользователя
      if (result.user && result.token) {
        return result;
      }
      
      // Если бекенд возвращает только success
      return {
        success: true,
        user: createMockUser(data.email),
        token: 'jwt-token-' + Date.now(),
      };
    } catch {
      // Если нет JSON тела, создаем ответ сами
      return {
        success: true,
        user: createMockUser(data.email),
        token: 'jwt-token-' + Date.now(),
      };
    }
  },

  // 3. Повторная отправка кода
  async resendCode(data: ResendCodeRequest): Promise<BaseResponse> {
    const response = await fetch(`${API_BASE}/auth/code/resend`, {
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