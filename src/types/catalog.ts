// types/catalog.ts
import { Brand } from '@/types/brand';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imagePath: string;
  categoryId: string;
  subCategoryId: string;
  brandId: string; // Изменяю с brand: string на brandId: string
  inCart: boolean;
  cartQuantity?: number;
}

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

// Для админки товаров
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categories: string[]; // массив ID категорий
  brandId: string; // ID бренда
  images: File[] | string[];
}

export type AdminProductSortBy = 'name' | 'brand' | 'category' | 'price' | 'created';

export interface AdminProductFilters {
  sortBy: AdminProductSortBy;
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  selectedBrands: string[]; // ID брендов
  selectedCategories: string[];
}