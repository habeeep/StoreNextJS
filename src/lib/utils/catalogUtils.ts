import { Product, ApiProduct } from '@/types/catalog';
import { Brand } from '@/types/brand';
import { CategoryNode } from '@/types/category';

// Конвертация API товара в Product для UI
export function convertApiProductToProduct(apiProduct: ApiProduct): Product {
  return {
    id: apiProduct.id,
    title: apiProduct.title,
    description: apiProduct.description,
    price: apiProduct.price,
    categoryId: apiProduct.categoryId,
    brandId: apiProduct.brandId,
    amount: apiProduct.amount,
    images: apiProduct.images || ['/images/catalog/plants1.png'], // Хардкод изображения
    inCart: false,
    cartQuantity: 0,
  };
}

// Конвертация массива API товаров
export function convertApiProductsToProducts(apiProducts: ApiProduct[]): Product[] {
  return apiProducts.map(convertApiProductToProduct);
}

// Поиск товаров по названию или описанию
export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;

  const searchLower = query.toLowerCase();
  return products.filter(product => 
    product.title.toLowerCase().includes(searchLower) ||
    product.description.toLowerCase().includes(searchLower)
  );
}

// Сортировка товаров
export function sortProducts(
  products: ApiProduct[],
  field: 'title' | 'price' | 'amount' | 'created',
  order: 'asc' | 'desc' = 'asc'
): ApiProduct[] {
  return [...products].sort((a, b) => {
    let comparison = 0;
    
    switch (field) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'created':
        comparison = new Date(a.created || '').getTime() - new Date(b.created || '').getTime();
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
}

// Фильтрация по брендам
export function filterByBrands(products: Product[], brandIds: string[]): Product[] {
  if (brandIds.length === 0) return products;
  return products.filter(product => brandIds.includes(product.brandId));
}

// Фильтрация по категориям
export function filterByCategories(products: Product[], categoryIds: string[]): Product[] {
  if (categoryIds.length === 0) return products;
  return products.filter(product => categoryIds.includes(product.categoryId));
}

// Фильтрация по цене
export function filterByPriceRange(products: Product[], min?: number, max?: number): Product[] {
  return products.filter(product => {
    const price = product.price;
    const minPrice = min || 0;
    const maxPrice = max || Infinity;
    return price >= minPrice && price <= maxPrice;
  });
}

// Фильтрация по количеству
export function filterByAmountRange(products: Product[], min?: number, max?: number): Product[] {
  return products.filter(product => {
    const amount = product.amount;
    const minAmount = min || 0;
    const maxAmount = max || Infinity;
    return amount >= minAmount && amount <= maxAmount;
  });
}

// Получение названия бренда для товара
export function getBrandNameForProduct(product: Product, brands: Brand[]): string {
  const brand = brands.find(b => b.id === product.brandId);
  return brand?.title || 'Неизвестный бренд';
}

// Получение названия категории для товара
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

// Получение пути категории (для хлебных крошек)
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

// Группировка товаров по брендам
export function groupProductsByBrand(products: Product[], brands: Brand[]): Record<string, Product[]> {
  const grouped: Record<string, Product[]> = {};
  
  brands.forEach(brand => {
    grouped[brand.id] = products.filter(product => product.brandId === brand.id);
  });
  
  return grouped;
}

// Группировка товаров по категориям
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