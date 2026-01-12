'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Product, CatalogFilters } from '@/types/catalog';
import { CategoryNode } from '@/types/category';
import { CatalogHeader } from './components/CatalogHeader/CatalogHeader';
import { CatalogFilters as FiltersComponent } from './components/CatalogFilters/CatalogFilters';
import { ProductGrid } from './components/ProductGrid/ProductGrid';
import styles from './CatalogUserPage.module.css';
import { catalogApi } from '@/lib/api/catalogApi';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { brandsApi } from '@/lib/api/brandsApi';
import { buildCategoryTree } from '@/lib/utils/categoryUtils';

export const CatalogUserPage = () => {
  const [sidebarFilters, setSidebarFilters] = useState<CatalogFilters>({
    sortBy: 'price-asc',
    searchQuery: '',
    selectedCategories: [],
    selectedBrands: [],
    priceRange: { min: 0, max: 0 }
  });

  const [appliedFilters, setAppliedFilters] = useState<CatalogFilters>({
    sortBy: 'price-asc',
    searchQuery: '',
    selectedCategories: [],
    selectedBrands: [],
    priceRange: { min: 0, max: 0 }
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialCategoryParam = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsList, apiCategories, apiBrands] = await Promise.all([
          catalogApi.getAllProducts(),
          categoriesApi.getAllCategories(),
          brandsApi.getAllBrands(),
        ]);

        if (!mounted) return;

        setProducts(productsList);
        const tree = buildCategoryTree(apiCategories);
        setCategories(tree);
        setBrands(apiBrands.map(b => b.title));
      } catch (err) {
        console.error('Ошибка при загрузке данных каталога:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const param = searchParams?.get ? searchParams.get('category') : null;
    if (!param) return;
    if (isLoading) return;

    const exists = (nodes: CategoryNode[], id: string): boolean => {
      for (const n of nodes) {
        if (n.id === id) return true;
        if (n.children.length > 0 && exists(n.children, id)) return true;
      }
      return false;
    };

    if (categories.length > 0 && exists(categories, param)) {
      setSidebarFilters(prev => ({ ...prev, selectedCategories: [param] }));
      setAppliedFilters(prev => ({ ...prev, selectedCategories: [param] }));
      initialCategoryParam.current = param;
    }
  }, [searchParams, isLoading, categories]);

  useEffect(() => {
    if (!initialCategoryParam.current) return;

    try {
      const param = searchParams?.get ? searchParams.get('category') : null;
      if (!param) return;

      if (appliedFilters.selectedCategories.length === 1 && appliedFilters.selectedCategories[0] === param) return;

      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.delete('category');
      const q = params.toString();
      const newUrl = q ? `${pathname}?${q}` : pathname;
      router.replace(newUrl);
    } catch (err) {
      console.warn('Не удалось очистить параметр category из URL', err);
    }
  }, [appliedFilters.selectedCategories, searchParams, router, pathname]);

  const applyFilters = () => {
    let result = [...products];

    if (appliedFilters.searchQuery) {
      const query = appliedFilters.searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(query));
    }

    if (appliedFilters.selectedCategories.length > 0) {
      result = result.filter(p => {
        const findPath = (nodes: CategoryNode[], targetId: string, path: CategoryNode[] = []): CategoryNode[] | null => {
          for (const node of nodes) {
            const currentPath = [...path, node];
            if (node.id === targetId) return currentPath;
            if (node.children.length > 0) {
              const found = findPath(node.children, targetId, currentPath);
              if (found) return found;
            }
          }
          return null;
        };

        const path = findPath(categories, p.categoryId) || [];
        if (path.length === 0) return false;
        return path.some(node => appliedFilters.selectedCategories.includes(node.id));
      });
    }

    if (appliedFilters.selectedBrands.length > 0) {
      result = result.filter(p => appliedFilters.selectedBrands.includes(p.brandId));
    }

    result = result.filter(p => 
      p.price >= (appliedFilters.priceRange.min || 0) && 
      p.price <= (appliedFilters.priceRange.max || Infinity)
    );

    result.sort((a, b) => {
      switch (appliedFilters.sortBy) {
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
  }, [products, appliedFilters]);

  const handleAddToCart = (id: string) => {
  setProducts(prev => prev.map(p => 
    p.id === id 
      ? { 
          ...p, 
          inCart: true, 
          cartQuantity: 1
        }
      : p
  ));
};

const handleRemoveFromCart = (id: string) => {
  setProducts(prev => prev.map(p => 
    p.id === id 
      ? { 
          ...p, 
          inCart: false, 
          cartQuantity: undefined
        }
      : p
  ));
};

const handleIncrementQuantity = (id: string) => {
  setProducts(prev => prev.map(p => 
    p.id === id && p.inCart
      ? { 
          ...p, 
          cartQuantity: (p.cartQuantity || 1) + 1 
        }
      : p
  ));
};

const handleDecrementQuantity = (id: string) => {
  setProducts(prev => prev.map(p => 
    p.id === id && p.inCart
      ? { 
          ...p, 
          cartQuantity: (p.cartQuantity || 1) - 1 
        }
      : p
  ));
};

  return (
    <div className={styles.page}>
      <CatalogHeader 
        filters={appliedFilters}
        onFiltersChange={setAppliedFilters}
      />

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <FiltersComponent
            filters={sidebarFilters}
            categories={categories}
            brands={brands}
            onFiltersChange={setSidebarFilters}
            onApplyFilters={() => setAppliedFilters(sidebarFilters)}
          />
        </aside>

        <main className={styles.main}>
          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onIncrementQuantity={handleIncrementQuantity}
            onDecrementQuantity={handleDecrementQuantity}
          />
        </main>
      </div>
    </div>
  );
};