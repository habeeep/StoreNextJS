import { 
  ApiBrand, 
  CreateBrandRequest, 
  UpdateBrandRequest,
  Brand 
} from '@/types/brand';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL_CATALOG}/brands`;

export const brandsApi = {
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

  async deleteBrand(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при удалении бренда');
    }
  },

  convertToBrand(apiBrand: ApiBrand): Brand {
    return {
      id: apiBrand.id,
      title: apiBrand.title,
      country: apiBrand.country,
      description: apiBrand.description,
    };
  },

  convertToBrands(apiBrands: ApiBrand[]): Brand[] {
    return apiBrands.map(this.convertToBrand);
  },
};