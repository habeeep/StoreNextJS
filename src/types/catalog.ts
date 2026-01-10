export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imagePath: string;
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

export interface CategoryNode {
  id: string;
  name: string;
  parentId: string | null;
  children: CategoryNode[];
  level: number;
  isExpanded?: boolean;
}

export type CategorySortOrder = 'asc' | 'desc' | 'none';

export interface CategoryFormData {
  name: string;
  parentId: string | null;
}

export type CategoryOperation = 'add' | 'edit' | 'delete' | 'add-subcategory';