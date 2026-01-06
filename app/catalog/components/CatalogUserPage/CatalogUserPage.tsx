'use client';

import { useState, useEffect } from 'react';
import { Product, Category, CatalogFilters } from '@/types/catalog';
import { CatalogHeader } from './components/CatalogHeader/CatalogHeader';
import { CatalogFilters as FiltersComponent } from './components/CatalogFilters/CatalogFilters';
import { ProductGrid } from './components/ProductGrid/ProductGrid';
import styles from './CatalogUserPage.module.css';

export const CatalogUserPage = () => {
  const [filters, setFilters] = useState<CatalogFilters>({
    sortBy: 'price-asc',
    searchQuery: '',
    selectedCategories: [],
    selectedBrands: [],
    priceRange: { min: 0, max: 0 }
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Монстера',
      description: 'Тропическое растение с резными листьями',
      price: 2500,
      imageUrl: '/images/products/monstera.jpg',
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
      imageUrl: '/images/products/monstera.jpg',
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
      imageUrl: '/images/products/monstera.jpg',
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
      imageUrl: '/images/products/monstera.jpg',
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
      imageUrl: '/images/products/monstera.jpg',
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
      imageUrl: '/images/products/monstera.jpg',
      categoryId: '2',
      subCategoryId: '22',
      brand: 'GreenHouse',
      inCart: false
    },
  ];

  const mockCategories: Category[] = [
    {
      id: '1',
      name: 'Комнатные растения',
      subCategories: [
        { id: '11', name: 'Декоративно-лиственные' },
        { id: '12', name: 'Цветущие' },
        { id: '13', name: 'Кактусы и суккуленты' },
        { id: '14', name: 'Пальмы' }
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
  ];

  const mockBrands = ['GreenHouse', 'PlantShop', 'Botanic', 'Flora', 'Qel', 'Popo'];

  useEffect(() => {
    setProducts(mockProducts);
    setCategories(mockCategories);
    setBrands(mockBrands);
  }, []);

  const applyFilters = () => {
    let result = [...products];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }

    if (filters.selectedCategories.length > 0) {
      result = result.filter(p => 
        filters.selectedCategories.includes(p.categoryId) || 
        filters.selectedCategories.includes(p.subCategoryId)
      );
    }

    if (filters.selectedBrands.length > 0) {
      result = result.filter(p => filters.selectedBrands.includes(p.brand));
    }

    result = result.filter(p => 
      p.price >= (filters.priceRange.min || 0) && 
      p.price <= (filters.priceRange.max || Infinity)
    );

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popularity-desc':
          return b.id.localeCompare(a.id);
        case 'popularity-asc':
          return a.id.localeCompare(b.id);
        default:
          return 0;
      }
    });

    setFilteredProducts(result);
  };

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const handleAddToCart = (id: string) => {
    setProducts(prev => prev.map(p => 
      p.id === id 
        ? { ...p, inCart: true, cartQuantity: 1 }
        : p
    ));
  };

  const handleRemoveFromCart = (id: string) => {
    setProducts(prev => prev.map(p => 
      p.id === id 
        ? { ...p, inCart: false, cartQuantity: undefined }
        : p
    ));
  };

  return (
    <div className={styles.page}>
      <CatalogHeader 
        filters={filters}
        onFiltersChange={setFilters}
      />

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <FiltersComponent
            filters={filters}
            categories={categories}
            brands={brands}
            onFiltersChange={setFilters}
            onApplyFilters={applyFilters}
          />
        </aside>

        <main className={styles.main}>
          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
          />
        </main>
      </div>
    </div>
  );
};