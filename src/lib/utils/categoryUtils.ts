// lib/utils/categoryUtils.ts
import { ApiCategory, CategoryNode } from '@/types/category';

// Функция для преобразования плоского списка в дерево
export function buildCategoryTree(categories: ApiCategory[]): CategoryNode[] {
  const nodesMap = new Map<string, CategoryNode>();
  const rootCategories: CategoryNode[] = [];
  
  // Сначала создаем все узлы без детей
  categories.forEach(category => {
    const node: CategoryNode = {
      // Поля из ApiCategory
      id: category.id,
      title: category.title,
      description: category.description,
      parentId: category.parentId,
      created: category.created,
      updated: category.updated,
      // Дополнительные поля для дерева
      children: [],
      level: 0,
      isExpanded: false,
    };
    nodesMap.set(category.id, node);
  });
  
  // Затем распределяем детей по родителям
  nodesMap.forEach(node => {
    if (node.parentId && nodesMap.has(node.parentId)) {
      const parent = nodesMap.get(node.parentId)!;
      parent.children.push(node);
      node.level = parent.level + 1;
    } else {
      rootCategories.push(node);
    }
  });
  
  return rootCategories;
}

// Функция для поиска в дереве
export function searchInCategoryTree(
  nodes: CategoryNode[], 
  query: string
): CategoryNode[] {
  if (!query.trim()) return nodes;

  const filtered: CategoryNode[] = [];
  
  nodes.forEach(node => {
    // Проверяем текущую категорию
    const matches = node.title.toLowerCase().includes(query.toLowerCase()) ||
                    node.description.toLowerCase().includes(query.toLowerCase());
    
    // Рекурсивно проверяем детей
    const filteredChildren = searchInCategoryTree(node.children, query);
    
    // Если категория или её дети подходят, добавляем
    if (matches || filteredChildren.length > 0) {
      filtered.push({
        ...node,
        children: filteredChildren,
        isExpanded: filteredChildren.length > 0 ? true : node.isExpanded,
      });
    }
  });
  
  return filtered;
}

// Функция для сортировки дерева
export function sortCategoryTree(
  nodes: CategoryNode[], 
  order: 'asc' | 'desc' | 'none'
): CategoryNode[] {
  if (order === 'none') return nodes;

  return [...nodes].sort((a, b) => {
    const comparison = a.title.localeCompare(b.title);
    return order === 'asc' ? comparison : -comparison;
  }).map(node => ({
    ...node,
    children: sortCategoryTree(node.children, order),
  }));
}

// Функция для нахождения всех детей категории (включая вложенных)
export function getAllChildrenIds(node: CategoryNode): string[] {
  const ids: string[] = [];
  
  const collectIds = (category: CategoryNode) => {
    ids.push(category.id);
    category.children.forEach(collectIds);
  };
  
  collectIds(node);
  return ids;
}

// Функция для получения пути к категории (от корня до категории)
export function getCategoryPath(
  categories: CategoryNode[], 
  categoryId: string
): CategoryNode[] {
  const findPath = (nodes: CategoryNode[], targetId: string, path: CategoryNode[] = []): CategoryNode[] | null => {
    for (const node of nodes) {
      const currentPath = [...path, node];
      
      if (node.id === targetId) {
        return currentPath;
      }
      
      if (node.children.length > 0) {
        const foundPath = findPath(node.children, targetId, currentPath);
        if (foundPath) return foundPath;
      }
    }
    
    return null;
  };
  
  return findPath(categories, categoryId) || [];
}

// Функция для нахождения родительских категорий
export function getParentCategories(
  categories: CategoryNode[],
  categoryId: string
): CategoryNode[] {
  const path = getCategoryPath(categories, categoryId);
  return path.slice(0, -1); // Все кроме самой категории
}