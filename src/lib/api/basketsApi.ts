const BASE = 'http://89.169.177.64:8085/api/v1/baskets';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(`Baskets API error ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const basketsApi = {
  getBasket: (userEmail: string) => request(`/${encodeURIComponent(userEmail)}`),
  addItem: (userEmail: string, payload: { goodId: string; quantity: number; status?: string }) =>
    request(`/${encodeURIComponent(userEmail)}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  updateItem: (itemId: string, payload: { quantity?: number; status?: string }) =>
    request(`/items/${encodeURIComponent(itemId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  deleteItem: (itemId: string) =>
    request(`/items/${encodeURIComponent(itemId)}`, { method: 'DELETE' }),
  startPayment: (userEmail: string) => request(`/${encodeURIComponent(userEmail)}/start-payment`, { method: 'POST' }),
  confirmPayment: (payload: { paymentId: string; success: boolean }) =>
    request(`/confirm-payment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  deletePaid: (userEmail: string) => request(`/${encodeURIComponent(userEmail)}/paid`, { method: 'DELETE' }),
  deleteCurrent: (userEmail: string) => request(`/${encodeURIComponent(userEmail)}/current`, { method: 'DELETE' }),
};

export default basketsApi;
