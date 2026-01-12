import {
  Product,
  ApiProduct,
  ProductsResponse,
  CreateProductRequest,
  UpdateProductRequest,
  PaginationParams,
  ProductFiltersParams,
} from '@/types/catalog';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL_CATALOG}/goods`;

export const catalogApi = {
  async getProducts(params?: PaginationParams): Promise<ProductsResponse> {
    const limit = params?.limit || 100;
    const offset = params?.offset || 0;
    
    const response = await fetch(
      `${API_BASE}?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при получении товаров');
    }
    
    return await response.json();
  },

  async getProductById(id: string): Promise<ApiProduct> {
    const response = await fetch(
      `${API_BASE}/${id}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при получении товара');
    }
    
    return await response.json();
  },

  async createProduct(data: CreateProductRequest): Promise<ApiProduct> {
    const response = await fetch(
      API_BASE,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при создании товара');
    }
    
    return await response.json();
  },

  async updateProduct(id: string, data: UpdateProductRequest): Promise<ApiProduct> {
    const response = await fetch(
      `${API_BASE}/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при обновлении товара');
    }
    
    return await response.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(
      `${API_BASE}/${id}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    if (!response.ok) {
      throw new Error('Ошибка при удалении товара');
    }
  },

  // TODO: Фильтрация товаров (когда появится ручка)
  // async getFilteredProducts(params: ProductFiltersParams): Promise<ProductsResponse> {
  //   const url = new URL(`${API_BASE}/filter`);
  //   if (params.brandIds) {
  //     params.brandIds.forEach(id => url.searchParams.append('brandId', id));
  //   }
  //   if (params.categoryIds) {
  //     params.categoryIds.forEach(id => url.searchParams.append('categoryId', id));
  //   }
  //   if (params.limit) url.searchParams.append('limit', params.limit.toString());
  //   if (params.offset) url.searchParams.append('offset', params.offset.toString());
  //   
  //   const response = await fetch(url.toString(), {
  //     method: 'GET',
  //     headers: { 'Content-Type': 'application/json' },
  //   });
  //   
  //   if (!response.ok) {
  //     throw new Error('Ошибка при фильтрации товаров');
  //   }
  //   
  //   return await response.json();
  // },

  convertToProduct(apiProduct: ApiProduct): Product {
    return {
      id: apiProduct.id,
      title: apiProduct.title,
      description: apiProduct.description,
      price: apiProduct.price,
      categoryId: apiProduct.categoryId,
      brandId: apiProduct.brandId,
      amount: apiProduct.amount,
      images: apiProduct.images || ['/images/catalog/plants1.png'], // Хардкод изображения
      inCart: false,
      cartQuantity: 0,
    };
  },

  convertToProducts(apiProducts: ApiProduct[]): Product[] {
    return apiProducts.map(this.convertToProduct);
  },

  async getAllProducts(): Promise<Product[]> {
    const allProducts: ApiProduct[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getProducts({ limit, offset });
      allProducts.push(...response.items);
      hasMore = response.hasMore;
      offset += limit;
    }

    return this.convertToProducts(allProducts);
  },
};