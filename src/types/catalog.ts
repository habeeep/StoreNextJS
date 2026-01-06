export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  subCategoryId: string;
  brand: string;
  inCart: boolean;
  cartQuantity?: number;
}

export interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
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