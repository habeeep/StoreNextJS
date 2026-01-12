// types/catalog.ts

// Товар из API
export interface ApiProduct {
  id: string;
  title: string; // Изменяю name на title
  description: string;
  price: number;
  categoryId: string; // ID самой дочерней категории
  brandId: string; // ID бренда
  amount: number; // Количество на складе
  created: string;
  updated: string | null;
  images?: string[]; // Опционально, добавим позже
}

// Ответ с пагинацией
export interface ProductsResponse {
  items: ApiProduct[];
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

// Запрос на создание товара
export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  brandId: string;
  amount: number;
}

// Запрос на обновление товара
export interface UpdateProductRequest {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  brandId: string;
  amount: number;
}

// Параметры пагинации
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

// Параметры фильтрации (для будущей ручки)
export interface ProductFiltersParams extends PaginationParams {
  brandIds?: string[];
  categoryIds?: string[];
}

// Для UI (упрощенный тип)
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  brandId: string;
  amount: number;
  images?: string[];
  inCart?: boolean; // Для корзины
  cartQuantity?: number; // Для корзины
}

// Для админки
export type AdminProductSortBy = 'title' | 'brand' | 'category' | 'price' | 'created' | 'amount';

export interface AdminProductFilters {
  sortBy: AdminProductSortBy;
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  selectedBrands: string[]; // ID брендов
  selectedCategories: string[]; // ID категорий
  priceRange?: {
    min: number;
    max: number;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

// Для пользовательского каталога (старые типы, оставляем для совместимости)
export type SortOption = 'price-asc' | 'price-desc' | 'popularity-asc' | 'popularity-desc';

export interface CatalogFilters {
  sortBy: SortOption;
  searchQuery: string;
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: {
    min: number;
    max: number;
  };
}