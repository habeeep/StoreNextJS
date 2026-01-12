import { Product, ApiProduct } from '@/types/catalog';
import { Brand } from '@/types/brand';
import { CategoryNode } from '@/types/category';
import { isCategoryOrAncestorSelected } from '@/lib/utils/categoryUtils';

export function convertApiProductToProduct(apiProduct: ApiProduct): Product {
  return {
    id: apiProduct.id,
    title: apiProduct.title,
    description: apiProduct.description,
    price: apiProduct.price,
    categoryId: apiProduct.categoryId,
    brandId: apiProduct.brandId,
    amount: apiProduct.amount,
    images: apiProduct.images || ['/images/catalog/plants1.png'],
    inCart: false,
    cartQuantity: 0,
  };
}

export function convertApiProductsToProducts(apiProducts: ApiProduct[]): Product[] {
  return apiProducts.map(convertApiProductToProduct);
}

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;

  const searchLower = query.toLowerCase();
  return products.filter(product => 
    product.title.toLowerCase().includes(searchLower) ||
    product.description.toLowerCase().includes(searchLower)
  );
}

export function sortProducts<T extends { title?: string; price?: number; amount?: number; created?: string }>(
  products: T[],
  field: 'title' | 'price' | 'amount' | 'created',
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...products].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'title':
        comparison = (a.title || '').localeCompare(b.title || '');
        break;
      case 'price':
        comparison = (a.price || 0) - (b.price || 0);
        break;
      case 'amount':
        comparison = (a.amount || 0) - (b.amount || 0);
        break;
      case 'created':
        comparison = new Date(a.created || '').getTime() - new Date(b.created || '').getTime();
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });
}

export function filterByBrands(products: Product[], brandIds: string[]): Product[] {
  if (brandIds.length === 0) return products;
  return products.filter(product => brandIds.includes(product.brandId));
}

export function filterByCategories(
  products: Product[],
  categoryIds: string[],
  categories?: CategoryNode[]
): Product[] {
  if (!categoryIds || categoryIds.length === 0) return products;

  if (categories && categories.length > 0) {
    return products.filter(product =>
      isCategoryOrAncestorSelected(categories, product.categoryId, categoryIds)
    );
  }

  return products.filter(product => categoryIds.includes(product.categoryId));
}

export function filterByPriceRange(products: Product[], min?: number, max?: number): Product[] {
  return products.filter(product => {
    const price = product.price;
    const minPrice = min || 0;
    const maxPrice = max || Infinity;
    return price >= minPrice && price <= maxPrice;
  });
}

export function filterByAmountRange(products: Product[], min?: number, max?: number): Product[] {
  return products.filter(product => {
    const amount = product.amount;
    const minAmount = min || 0;
    const maxAmount = max || Infinity;
    return amount >= minAmount && amount <= maxAmount;
  });
}

export function getBrandNameForProduct(product: Product, brands: Brand[]): string {
  const brand = brands.find(b => b.id === product.brandId);
  return brand?.title || 'Неизвестный бренд';
}

export function getCategoryNameForProduct(
  product: Product, 
  categories: CategoryNode[]
): string {
  const findCategory = (nodes: CategoryNode[], targetId: string): CategoryNode | null => {
    for (const node of nodes) {
      if (node.id === targetId) {
        return node;
      }
      if (node.children.length > 0) {
        const found = findCategory(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };
  
  const category = findCategory(categories, product.categoryId);
  return category?.title || 'Неизвестная категория';
}

export function getCategoryPathForProduct(
  product: Product,
  categories: CategoryNode[]
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
  
  return findPath(categories, product.categoryId) || [];
}

export function groupProductsByBrand(products: Product[], brands: Brand[]): Record<string, Product[]> {
  const grouped: Record<string, Product[]> = {};
  
  brands.forEach(brand => {
    grouped[brand.id] = products.filter(product => product.brandId === brand.id);
  });
  
  return grouped;
}

export function groupProductsByCategory(products: Product[], categories: CategoryNode[]): Record<string, Product[]> {
  const grouped: Record<string, Product[]> = {};
  
  const addToGroup = (nodes: CategoryNode[]) => {
    nodes.forEach(node => {
      grouped[node.id] = products.filter(product => product.categoryId === node.id);
      if (node.children.length > 0) {
        addToGroup(node.children);
      }
    });
  };
  
  addToGroup(categories);
  return grouped;
}