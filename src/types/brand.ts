// types/brand.ts

// Бренд из API
export interface ApiBrand {
  id: string;
  title: string; // Изменяю name на title
  country: string;
  description: string;
  created: string;
  updated: string | null;
}

// Запрос на создание/обновление бренда
export interface CreateBrandRequest {
  title: string;
  country: string;
  description: string;
}

export interface UpdateBrandRequest {
  title: string;
  country: string;
  description: string;
}

// Бренд для UI (без полей created/updated если не нужны)
export interface Brand {
  id: string;
  title: string;
  country: string;
  description: string;
}

// Форма для создания/редактирования бренда
export interface BrandFormData {
  title: string;
  country: string;
  description: string;
}

// Для совместимости со старым кодом (если нужно)
export interface BrandForProduct {
  id: string;
  title: string;
}