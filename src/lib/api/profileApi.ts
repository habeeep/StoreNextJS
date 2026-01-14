import { } from '@/types/auth';

const API_BASE = 'http://89.169.177.64:8080/api/v1/auth';

export type Recipient = {
  description?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  address?: string | null;
  phone?: string | null;
};

export type UserInfoResponse = {
  userId?: string;
  userMail?: string;
  recipient?: Recipient | null;
};

export const profileApi = {
  async getUserInfo(email: string): Promise<UserInfoResponse> {
    const res = await fetch(`${API_BASE}/user/info/${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error(`GET /user/info failed: ${res.status}`);
    return res.json();
  },

  async updateRecipient(payload: {
    userMail: string;
    description?: string | null;
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    address?: string | null;
    phone?: string | null;
  }): Promise<void> {
    const res = await fetch(`${API_BASE}/user/recipient/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`PUT /user/recipient/update failed: ${res.status}`);
    return;
  },
};

export default profileApi;
