import { ApiCategory, CategoryNode } from '@/types/category';

export function buildCategoryTree(categories: ApiCategory[]): CategoryNode[] {
  const nodesMap = new Map<string, CategoryNode>();
  const rootCategories: CategoryNode[] = [];
  
  categories.forEach(category => {
    const node: CategoryNode = {
      id: category.id,
      title: category.title,
      description: category.description,
      parentId: category.parentId,
      created: category.created,
      updated: category.updated,
      children: [],
      level: 0,
      isExpanded: false,
    };
    nodesMap.set(category.id, node);
  });
  
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

export function searchInCategoryTree(
  nodes: CategoryNode[], 
  query: string
): CategoryNode[] {
  if (!query.trim()) return nodes;

  const filtered: CategoryNode[] = [];
  
  nodes.forEach(node => {
    const matches = node.title.toLowerCase().includes(query.toLowerCase()) ||
                    node.description.toLowerCase().includes(query.toLowerCase());
    
    const filteredChildren = searchInCategoryTree(node.children, query);
    
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

export function getAllChildrenIds(node: CategoryNode): string[] {
  const ids: string[] = [];
  
  const collectIds = (category: CategoryNode) => {
    ids.push(category.id);
    category.children.forEach(collectIds);
  };
  
  collectIds(node);
  return ids;
}

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

export function getParentCategories(
  categories: CategoryNode[],
  categoryId: string
): CategoryNode[] {
  const path = getCategoryPath(categories, categoryId);
  return path.slice(0, -1);
}

export function isCategoryOrAncestorSelected(
  categories: CategoryNode[],
  categoryId: string,
  selectedIds: string[]
): boolean {
  if (!selectedIds || selectedIds.length === 0) return true;

  const path = getCategoryPath(categories, categoryId);
  for (const node of path) {
    if (selectedIds.includes(node.id)) return true;
  }
  return false;
}