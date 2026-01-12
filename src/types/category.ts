export interface ApiCategory {
  id: string;
  title: string;
  description: string;
  parentId: string | null;
  created: string;
  updated: string | null;
}

export interface CreateCategoryRequest {
  title: string;
  description: string;
  parentId: string | null;
}

export interface UpdateCategoryRequest {
  title: string;
  description: string;
  parentId: string | null;
}

export type CategorySortOrder = 'asc' | 'desc' | 'none';

export interface CategoryFormData {
  title: string;
  description: string;
  parentId: string | null;
}

export type CategoryOperation = 'add' | 'edit' | 'delete' | 'add-subcategory';

export interface CategoryNode extends ApiCategory {
  children: CategoryNode[];
  level: number;
  isExpanded?: boolean;
}