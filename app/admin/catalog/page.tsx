// app/admin/catalog/page.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container/Container';
import { Button } from '@/components/ui/Button/Button';
import { PlusIcon } from '@/components/ui/icons/PlusIcon';
import { 
  Product, 
  ApiProduct,
  AdminProductFilters, 
  AdminProductSortBy,
  CatalogFilters as CatalogFiltersType
} from '@/types/catalog';
import { Brand } from '@/types/brand';
import { CategoryNode } from '@/types/category';
import { catalogApi } from '@/lib/api/catalogApi';
import { brandsApi } from '@/lib/api/brandsApi';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { 
  searchProducts, 
  sortProducts, 
  filterByBrands, 
  filterByCategories,
  filterByPriceRange,
  getBrandNameForProduct,
  getCategoryNameForProduct
} from '@/lib/utils/catalogUtils';
import { convertApiBrandsToBrands } from '@/lib/utils/brandUtils';
import { buildCategoryTree } from '@/lib/utils/categoryUtils';
import { ProductTable } from './components/ProductTable/ProductTable';
import { AdminSortHeader } from './components/AdminSortHeader/AdminSortHeader';
import { CatalogFilters } from 'app/catalog/components/CatalogUserPage/components/CatalogFilters/CatalogFilters';
import styles from './page.module.css';

export default function AdminCatalogPage() {
  const router = useRouter();
  
  // Состояния данных
  const [products, setProducts] = useState<Product[]>([]);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Фильтры
  const [sortingFilters, setSortingFilters] = useState<AdminProductFilters>({
    sortBy: 'title', // Изменяю 'name' на 'title'
    sortOrder: 'asc',
    searchQuery: '',
    selectedBrands: [],
    selectedCategories: [],
  });

  const [sidebarFilters, setSidebarFilters] = useState<CatalogFiltersType>({
    sortBy: 'price-asc', 
    searchQuery: '',
    selectedCategories: [],
    selectedBrands: [], // Теперь это названия брендов для совместимости с CatalogFilters
    priceRange: { min: 0, max: 0 }
  });

  // Загрузка данных
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Загружаем товары
      const productsResponse = await catalogApi.getProducts({ limit: 100, offset: 0 });
      setApiProducts(productsResponse.items);
      const convertedProducts = catalogApi.convertToProducts(productsResponse.items);
      setProducts(convertedProducts);

      // Загружаем бренды
      const apiBrands = await brandsApi.getAllBrands();
      const convertedBrands = convertApiBrandsToBrands(apiBrands);
      setBrands(convertedBrands);

      // Загружаем категории
      const apiCategories = await categoriesApi.getAllCategories();
      const categoryTree = buildCategoryTree(apiCategories);
      setCategories(categoryTree);

    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Преобразование ID брендов в названия для CatalogFilters
  const brandNames = useMemo(() => {
    return brands.map(brand => brand.title);
  }, [brands]);

  // Преобразование категорий в старый формат для CatalogFilters
  const legacyCategories = useMemo(() => {
    return categories.map(category => ({
      id: category.id,
      name: category.title,
      subCategories: category.children.map(child => ({
        id: child.id,
        name: child.title,
      })),
    }));
  }, [categories]);

  const handleSidebarFiltersChange = (newFilters: CatalogFiltersType) => {
    setSidebarFilters(newFilters);
  };

  const handleApplyFilters = () => {
    // Конвертируем названия брендов в ID
    const brandIds = sidebarFilters.selectedBrands.map(brandName => {
      const brand = brands.find(b => b.title === brandName);
      return brand?.id || '';
    }).filter(id => id !== '');

    setSortingFilters(prev => ({
      ...prev,
      selectedBrands: brandIds,
      selectedCategories: sidebarFilters.selectedCategories,
    }));
  };

  // Фильтрация и сортировка товаров
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Поиск по названию
    if (sortingFilters.searchQuery) {
      result = searchProducts(result, sortingFilters.searchQuery);
    }

    // Фильтрация по брендам (по ID)
    if (sortingFilters.selectedBrands.length > 0) {
      result = filterByBrands(result, sortingFilters.selectedBrands);
    }

    // Фильтрация по категориям
    if (sortingFilters.selectedCategories.length > 0) {
      result = filterByCategories(result, sortingFilters.selectedCategories);
    }

    // Фильтрация по цене из сайдбара
    if (sidebarFilters.priceRange.min > 0 || sidebarFilters.priceRange.max > 0) {
      result = filterByPriceRange(
        result, 
        sidebarFilters.priceRange.min, 
        sidebarFilters.priceRange.max
      );
    }

    // Сортировка
    const sortFieldMap: Record<AdminProductSortBy, 'title' | 'price' | 'amount' | 'created'> = {
      'title': 'title',
      'brand': 'title', // Для сортировки по бренду нужна отдельная логика
      'category': 'title', // Для сортировки по категории нужна отдельная логика
      'price': 'price',
      'created': 'created',
      'amount': 'amount',
    };

    const sortField = sortFieldMap[sortingFilters.sortBy];
    
    // Если сортировка по бренду или категории - особая логика
    if (sortingFilters.sortBy === 'brand') {
      result.sort((a, b) => {
        const brandA = getBrandNameForProduct(a, brands);
        const brandB = getBrandNameForProduct(b, brands);
        const comparison = brandA.localeCompare(brandB);
        return sortingFilters.sortOrder === 'asc' ? comparison : -comparison;
      });
    } else if (sortingFilters.sortBy === 'category') {
      result.sort((a, b) => {
        const categoryA = getCategoryNameForProduct(a, categories);
        const categoryB = getCategoryNameForProduct(b, categories);
        const comparison = categoryA.localeCompare(categoryB);
        return sortingFilters.sortOrder === 'asc' ? comparison : -comparison;
      });
    } else {
      result = sortProducts(result, sortField, sortingFilters.sortOrder);
    }

    return result;
  }, [products, sortingFilters, sidebarFilters, brands, categories]);

  const handleSearch = (query: string) => {
    setSortingFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleClearSearch = () => {
    setSortingFilters(prev => ({ ...prev, searchQuery: '' }));
  };

  const handleSortChange = (field: AdminProductSortBy) => {
    setSortingFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleEditProduct = (product: Product) => {
    router.push(`/admin/catalog/edit/${product.id}`);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Удалить товар?')) {
      try {
        await catalogApi.deleteProduct(productId);
        fetchData(); // Обновляем данные
      } catch (err) {
        console.error('Ошибка при удалении товара:', err);
        alert('Не удалось удалить товар');
      }
    }
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/catalog/${productId}`);
  };

  const handleCreateProduct = () => {
    router.push('/admin/catalog/create');
  };

  const handleRefresh = () => {
    fetchData();
  };

  if (isLoading) {
    return (
      <Container>
        <div className={styles.loading}>Загрузка товаров...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className={styles.error}>
          <p>{error}</p>
          <Button onClick={handleRefresh} variant="secondary">
            Попробовать снова
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className={styles.page}>
        <AdminSortHeader
          sortBy={sortingFilters.sortBy}
          sortOrder={sortingFilters.sortOrder}
          searchQuery={sortingFilters.searchQuery}
          onSortChange={handleSortChange}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
        />

        <div className={styles.content}>
          <div className={styles.main}>
            <div className={styles.tableHeader}>
              <div className={styles.tableInfo}>
                <span className={styles.productsCount}>
                  Товаров: {filteredProducts.length}
                </span>
                <Button 
                  onClick={handleRefresh}
                  variant="secondary"
                  className={styles.refreshButton}
                >
                  Обновить
                </Button>
              </div>
            </div>
            
            <div className={styles.tableSection}>
              <ProductTable
                products={filteredProducts}
                brands={brands}
                categories={categories}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onView={handleViewProduct}
              />
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.filtersContainer}>
              <CatalogFilters
                filters={sidebarFilters}
                categories={legacyCategories}
                brands={brandNames}
                onFiltersChange={handleSidebarFiltersChange}
                onApplyFilters={handleApplyFilters}
              />
            </div>
            
            <div className={styles.sidebarActions}>
              <Button 
                onClick={handleCreateProduct}
                className={styles.createButton}
              >
                <PlusIcon size={20} />
                Создать товар
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </Container>
  );
}