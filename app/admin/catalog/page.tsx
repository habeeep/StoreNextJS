'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container/Container';
import { Button } from '@/components/ui/Button/Button';
import { PlusIcon } from '@/components/ui/icons/PlusIcon';
import { 
  Product, 
  Brand, 
  Category, 
  AdminProductFilters, 
  AdminProductSortBy,
  CatalogFilters as CatalogFiltersType
} from '@/types/catalog';
import { ProductTable } from './components/ProductTable/ProductTable';
import { AdminSortHeader } from './components/AdminSortHeader/AdminSortHeader';
import { CatalogFilters } from 'app/catalog/components/CatalogUserPage/components/CatalogFilters/CatalogFilters';
import styles from './page.module.css';

export default function AdminCatalogPage() {
  const router = useRouter();
  
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Монстера',
      description: 'Тропическое растение с резными листьями',
      price: 2500,
      imagePath: '/images/catalog/plants1.png',
      categoryId: '1',
      subCategoryId: '11',
      brand: 'GreenHouse',
      inCart: false
    },
    {
      id: '2',
      name: 'Чики',
      description: 'Тропическое растение с резными листьями',
      price: 2100,
      imagePath: '/images/catalog/plants2.png',
      categoryId: '2',
      subCategoryId: '21',
      brand: 'GreenHouse',
      inCart: false
    },
    {
      id: '3',
      name: 'Лоло',
      description: 'Тропическое растение с резными листьями',
      price: 4500,
      imagePath: '/images/catalog/plants3.png',
      categoryId: '1',
      subCategoryId: '13',
      brand: 'GreenHouse',
      inCart: false
    },
    {
      id: '4',
      name: 'Амстел',
      description: 'Тропическое растение с резными листьями',
      price: 2600,
      imagePath: '/images/catalog/plants4.png',
      categoryId: '1',
      subCategoryId: '12',
      brand: 'GreenHouse',
      inCart: false
    },
    {
      id: '5',
      name: 'Коростик',
      description: 'Тропическое растение с резными листьями',
      price: 2800,
      imagePath: '/images/catalog/plants1.png',
      categoryId: '2',
      subCategoryId: '24',
      brand: 'GreenHouse',
      inCart: false
    },
    {
      id: '6',
      name: 'Алекса',
      description: 'Тропическое растение с резными листьями',
      price: 8500,
      imagePath: '/images/catalog/plants2.png',
      categoryId: '2',
      subCategoryId: '22',
      brand: 'GreenHouse',
      inCart: false
    },
    {
      id: '7',
      name: 'Растение от Botanic',
      description: 'Французское растение',
      price: 3200,
      imagePath: '/images/catalog/plants3.png',
      categoryId: '1',
      subCategoryId: '12',
      brand: 'Botanic',
      inCart: false
    },
    {
      id: '8',
      name: 'Растение от PlantShop',
      description: 'Немецкое качество',
      price: 1800,
      imagePath: '/images/catalog/plants4.png',
      categoryId: '2',
      subCategoryId: '21',
      brand: 'PlantShop',
      inCart: false
    },
  ]);

  const [brands] = useState<Brand[]>([
    { id: '1', name: 'GreenHouse', country: 'Нидерланды', categories: ['1', '2'], description: 'Ведущий производитель растений' },
    { id: '2', name: 'PlantShop', country: 'Германия', categories: ['1'], description: 'Немецкое качество' },
    { id: '3', name: 'Botanic', country: 'Франция', categories: ['2'], description: 'Французский шик' },
  ]);

  const [categories] = useState<Category[]>([
    {
      id: '1',
      name: 'Комнатные растения',
      subCategories: [
        { id: '11', name: 'Декоративно-лиственные' },
        { id: '12', name: 'Цветущие' },
        { id: '13', name: 'Кактусы и суккуленты' },
      ]
    },
    {
      id: '2',
      name: 'Садовые растения',
      subCategories: [
        { id: '21', name: 'Хвойные' },
        { id: '22', name: 'Лиственные деревья' },
        { id: '23', name: 'Кустарники' },
        { id: '24', name: 'Многолетники' }
      ]
    }
  ]);

  const [sortingFilters, setSortingFilters] = useState<AdminProductFilters>({
    sortBy: 'name',
    sortOrder: 'asc',
    searchQuery: '',
    selectedBrands: [],
    selectedCategories: [],
  });

  const [sidebarFilters, setSidebarFilters] = useState<CatalogFiltersType>({
    sortBy: 'price-asc', 
    searchQuery: '',
    selectedCategories: [],
    selectedBrands: [],
    priceRange: { min: 0, max: 0 }
  });

  const handleSidebarFiltersChange = (newFilters: CatalogFiltersType) => {
    setSidebarFilters(newFilters);
  };

  const handleApplyFilters = () => {
    setSortingFilters(prev => ({
      ...prev,
      selectedBrands: sidebarFilters.selectedBrands,
      selectedCategories: sidebarFilters.selectedCategories,
    }));
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (sortingFilters.searchQuery) {
      const query = sortingFilters.searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }

    if (sidebarFilters.selectedBrands.length > 0) {
      result = result.filter(p => sidebarFilters.selectedBrands.includes(p.brand));
    }

    if (sidebarFilters.selectedCategories.length > 0) {
      result = result.filter(p => 
        sidebarFilters.selectedCategories.includes(p.categoryId) || 
        sidebarFilters.selectedCategories.includes(p.subCategoryId)
      );
    }

    if (sidebarFilters.priceRange.min > 0 || sidebarFilters.priceRange.max > 0) {
      result = result.filter(p => {
        const price = p.price;
        const min = sidebarFilters.priceRange.min || 0;
        const max = sidebarFilters.priceRange.max || Infinity;
        return price >= min && price <= max;
      });
    }

    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortingFilters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'brand':
          comparison = a.brand.localeCompare(b.brand);
          break;
        case 'category':
          const catA = categories.find(c => c.id === a.categoryId)?.name || '';
          const catB = categories.find(c => c.id === b.categoryId)?.name || '';
          comparison = catA.localeCompare(catB);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
      }
      
      return sortingFilters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [products, sortingFilters, sidebarFilters, categories]);

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

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Удалить товар?')) {
      // TODO: Удаление через API
      console.log('Удаление товара:', productId);
    }
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/catalog/${productId}`);
  };

  const handleCreateProduct = () => {
    router.push('/admin/catalog/create');
  };

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
                categories={categories}
                brands={brands.map(b => b.name)}
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