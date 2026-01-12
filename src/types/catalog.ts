export interface ApiProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  brandId: string;
  amount: number;
  created: string;
  updated: string | null;
  images?: string[];
}

export interface ProductsResponse {
  items: ApiProduct[];
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  brandId: string;
  amount: number;
}

export interface UpdateProductRequest {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  brandId: string;
  amount: number;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface ProductFiltersParams extends PaginationParams {
  brandIds?: string[];
  categoryIds?: string[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  brandId: string;
  amount: number;
  images?: string[];
  inCart?: boolean;
  cartQuantity?: number;
}

export type AdminProductSortBy = 'title' | 'brand' | 'category' | 'price' | 'created' | 'amount';

export interface AdminProductFilters {
  sortBy: AdminProductSortBy;
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  selectedBrands: string[];
  selectedCategories: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  amountRange?: {
    min: number;
    max: number;
  };
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