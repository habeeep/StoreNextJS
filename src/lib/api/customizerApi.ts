import { CustomizationResponse } from '@/types/customizer';

const API_BASE = 'http://89.169.177.64:8089/api/v1/customizer';

export const customizerApi = {
  async getTheme(): Promise<string> {
    try {
      const response = await fetch(
        `${API_BASE}/customization/active?customizationType=THEME`,
        { headers: { 'accept': '*/*' } }
      );
      if (!response.ok) throw new Error('Failed to fetch theme');
      const data: CustomizationResponse = await response.json();
      return data.title;
    } catch (error) {
      console.error('Error fetching theme:', error);
      return 'default';
    }
  },

  async getBackground(): Promise<string> {
    try {
      const response = await fetch(
        `${API_BASE}/customization/active?customizationType=BACKGROUND`,
        { headers: { 'accept': '*/*' } }
      );
      if (!response.ok) throw new Error('Failed to fetch background');
      const data: CustomizationResponse = await response.json();
      return data.title;
    } catch (error) {
      console.error('Error fetching background:', error);
      return 'default';
    }
  },

  async getFont(): Promise<string> {
    try {
      const response = await fetch(
        `${API_BASE}/customization/active?customizationType=FONT`,
        { headers: { 'accept': '*/*' } }
      );
      if (!response.ok) throw new Error('Failed to fetch font');
      const data: CustomizationResponse = await response.json();
      return data.title;
    } catch (error) {
      console.error('Error fetching font:', error);
      return 'default';
    }
  },

  async getSiteName(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE}/customization/site`, {
        headers: { 'accept': '*/*' }
      });
      if (!response.ok) throw new Error('Failed to fetch site name');
      const data: CustomizationResponse = await response.json();
      return data.title;
    } catch (error) {
      console.error('Error fetching site name:', error);
      return 'Store';
    }
  },

  async getAllCustomizations() {
    const [title, theme, background, font] = await Promise.all([
      this.getSiteName(),
      this.getTheme(),
      this.getBackground(),
      this.getFont(),
    ]);
    return { title, theme, background, font };
  },
};
