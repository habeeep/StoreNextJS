// lib/api/categoriesApi.ts
import { 
  ApiCategory, 
  CreateCategoryRequest, 
  UpdateCategoryRequest,
  CategoryNode 
} from '@/types/category';

const API_BASE = process.env.NEXT_PUBLIC_API_URL_CATALOG;

export const categoriesApi = {
  // Получить все категории
  async getAllCategories(): Promise<ApiCategory[]> {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при получении категорий');
    }
    
    return await response.json();
  },

  // Получить категорию по ID
  async getCategoryById(id: string): Promise<ApiCategory> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при получении категории');
    }
    
    return await response.json();
  },

  // Создать категорию
  async createCategory(data: CreateCategoryRequest): Promise<ApiCategory> {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при создании категории');
    }
    
    return await response.json();
  },

  // Обновить категорию
  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<ApiCategory> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при обновлении категории');
    }
    
    return await response.json();
  },

  // Удалить категорию
  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при удалении категории');
    }
  },

  // Получить дерево категорий
  async getCategoriesTree(): Promise<CategoryNode[]> {
    const categories = await this.getAllCategories();
    return this.buildCategoriesTree(categories);
  },

  // Построение дерева категорий из плоского списка
  buildCategoriesTree(categories: ApiCategory[]): CategoryNode[] {
    const categoryMap = new Map<string, ApiCategory>();
    const childrenMap = new Map<string, ApiCategory[]>();
    
    // Создаем карту категорий
    categories.forEach(category => {
      categoryMap.set(category.id, category);
      
      // Инициализируем массив детей для каждого родителя
      if (category.parentId) {
        if (!childrenMap.has(category.parentId)) {
          childrenMap.set(category.parentId, []);
        }
        childrenMap.get(category.parentId)!.push(category);
      }
    });
    
    // Рекурсивная функция для построения узла
    const buildNode = (category: ApiCategory, level: number): CategoryNode => {
      const children = childrenMap.get(category.id) || [];
      
      return {
        id: category.id,
        title: category.title,
        description: category.description,
        parentId: category.parentId,
        children: children.map(child => buildNode(child, level + 1)),
        level,
        isExpanded: false,
        // Добавляем поля из ApiCategory если нужно
        created: category.created,
        updated: category.updated,
      };
    };
    
    // Находим корневые категории (те, у которых нет родителя)
    const rootCategories = categories.filter(category => !category.parentId);
    
    // Строим дерево
    return rootCategories.map(category => buildNode(category, 0));
  },

  // Конвертация API категорий в CategoryNode для админки
  convertToCategoryNodes(
    categories: ApiCategory[], 
    expandedIds: Set<string> = new Set()
  ): CategoryNode[] {
    const tree = this.buildCategoriesTree(categories);
    
    // Обновляем флаг isExpanded для узлов
    const updateExpanded = (nodes: CategoryNode[]): CategoryNode[] => {
      return nodes.map(node => ({
        ...node,
        isExpanded: expandedIds.has(node.id),
        children: updateExpanded(node.children),
      }));
    };
    
    return updateExpanded(tree);
  },
};