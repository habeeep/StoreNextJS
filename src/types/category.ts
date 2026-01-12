// types/category.ts

// Базовая категория из API
export interface ApiCategory {
  id: string;
  title: string;
  description: string;
  parentId: string | null;
  created: string;
  updated: string | null;
}

// Запрос на создание/обновление категории
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

// Сортировка для категорий
export type CategorySortOrder = 'asc' | 'desc' | 'none';

// Форма для создания/редактирования категории
export interface CategoryFormData {
  title: string;
  description: string;
  parentId: string | null;
}

// Операции с категориями
export type CategoryOperation = 'add' | 'edit' | 'delete' | 'add-subcategory';

// Для каталога пользователя (старые типы, оставляем для совместимости)
export interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface CategoryNode extends ApiCategory {
  children: CategoryNode[];
  level: number;
  isExpanded?: boolean;
}