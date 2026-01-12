import { 
  ApiCategory, 
  CreateCategoryRequest, 
  UpdateCategoryRequest,
  CategoryNode 
} from '@/types/category';

const API_BASE = process.env.NEXT_PUBLIC_API_URL_CATALOG;

export const categoriesApi = {
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

  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при удалении категории');
    }
  },

  async getCategoriesTree(): Promise<CategoryNode[]> {
    const categories = await this.getAllCategories();
    return this.buildCategoriesTree(categories);
  },

  buildCategoriesTree(categories: ApiCategory[]): CategoryNode[] {
    const categoryMap = new Map<string, ApiCategory>();
    const childrenMap = new Map<string, ApiCategory[]>();
    
    categories.forEach(category => {
      categoryMap.set(category.id, category);
      
      if (category.parentId) {
        if (!childrenMap.has(category.parentId)) {
          childrenMap.set(category.parentId, []);
        }
        childrenMap.get(category.parentId)!.push(category);
      }
    });
    
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
        created: category.created,
        updated: category.updated,
      };
    };
    
    const rootCategories = categories.filter(category => !category.parentId);
    
    return rootCategories.map(category => buildNode(category, 0));
  },

  convertToCategoryNodes(
    categories: ApiCategory[], 
    expandedIds: Set<string> = new Set()
  ): CategoryNode[] {
    const tree = this.buildCategoriesTree(categories);
    
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