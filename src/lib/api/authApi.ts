import { RequestCodeRequest, LoginRequest, LoginResponse } from '@/types/auth';

const mockUser = {
  id: '1',
  email: 'user@example.com',
  name: 'John',
  surname: 'Doe',
  role: 'user' as const,
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authApi = {
  async requestCode(data: RequestCodeRequest): Promise<void> {
    await delay(1000);
    console.log('Code requested for:', data.email);

  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    await delay(1500);
    
    if (data.code !== '123456') {
      throw new Error('Invalid code');
    }

    return {
      user: mockUser,
      token: 'mock-jwt-token-here',
    };
  },
};