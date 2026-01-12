// lib/api/brandsApi.ts
import { 
  ApiBrand, 
  CreateBrandRequest, 
  UpdateBrandRequest,
  Brand 
} from '@/types/brand';

const API_BASE = process.env.NODE_ENV === 'development' 
  ? '/backend/api/v1/brands' 
  : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brands`;

export const brandsApi = {
  // Получить все бренды
  async getAllBrands(): Promise<ApiBrand[]> {
    const response = await fetch(API_BASE, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при получении брендов');
    }
    
    return await response.json();
  },

  // Получить бренд по ID
  async getBrandById(id: string): Promise<ApiBrand> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при получении бренда');
    }
    
    return await response.json();
  },

  // Создать бренд
  async createBrand(data: CreateBrandRequest): Promise<ApiBrand> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при создании бренда');
    }
    
    return await response.json();
  },

  // Обновить бренд
  async updateBrand(id: string, data: UpdateBrandRequest): Promise<ApiBrand> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при обновлении бренда');
    }
    
    return await response.json();
  },

  // Удалить бренд
  async deleteBrand(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при удалении бренда');
    }
  },

  // Конвертация API бренда в Brand для UI
  convertToBrand(apiBrand: ApiBrand): Brand {
    return {
      id: apiBrand.id,
      title: apiBrand.title,
      country: apiBrand.country,
      description: apiBrand.description,
    };
  },

  // Конвертация массива API брендов
  convertToBrands(apiBrands: ApiBrand[]): Brand[] {
    return apiBrands.map(this.convertToBrand);
  },
};