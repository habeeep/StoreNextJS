'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Product, CatalogFilters } from '@/types/catalog';
import { CategoryNode } from '@/types/category';
import { CatalogHeader } from './components/CatalogHeader/CatalogHeader';
import { CatalogFilters as FiltersComponent } from './components/CatalogFilters/CatalogFilters';
import { ProductGrid } from './components/ProductGrid/ProductGrid';
import styles from './CatalogUserPage.module.css';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { addItem, removeItem, updateItem } from '@/store/slices/cartSlice';
import { catalogApi } from '@/lib/api/catalogApi';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { brandsApi } from '@/lib/api/brandsApi';
import { convertApiBrandsToBrands, getBrandOptions } from '@/lib/utils/brandUtils';
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
  const [brands, setBrands] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialCategoryParam = useRef<string | null>(null);

  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);
  const [limit] = useState(100);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchInitial = async () => {
      setIsLoading(true);
      try {
        const [productsResp, apiCategories, apiBrands] = await Promise.all([
          catalogApi.getProducts({ limit, offset: 0 }),
          categoriesApi.getAllCategories(),
          brandsApi.getAllBrands(),
        ]);

        if (!mounted) return;

          const convertedProducts = catalogApi.convertToProducts(productsResp.items);
          setProducts(convertedProducts);
        setHasMore(productsResp.hasMore);
        const newOffset = (productsResp.items?.length || 0);
        setOffset(newOffset);
        offsetRef.current = newOffset;

        const tree = buildCategoryTree(apiCategories);
        setCategories(tree);
          const convertedBrands = convertApiBrandsToBrands(apiBrands);
          setBrands(getBrandOptions(convertedBrands));
      } catch (err) {
        console.error('Ошибка при загрузке данных каталога:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchInitial();

    return () => { mounted = false; };
  }, [limit]);

  const loadNextPage = async () => {
    if (!hasMore) return;
    setIsLoading(true);
    try {
      const requestOffset = products.length;
      const resp = await catalogApi.getProducts({ limit, offset: requestOffset });
      const incoming = catalogApi.convertToProducts(resp.items);
      setProducts(prev => {
        const map = new Map<string, Product>();
        prev.forEach(p => map.set(p.id, p));
        incoming.forEach(p => {
          if (!map.has(p.id)) map.set(p.id, p);
        });
        return Array.from(map.values());
      });
      setHasMore(resp.hasMore);
      const newOffset = requestOffset + (resp.items?.length || 0);
      setOffset(newOffset);
      offsetRef.current = newOffset;
    } catch (err) {
      console.error('Ошибка при загрузке следующей страницы:', err);
    } finally {
      setIsLoading(false);
    }
  };

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

  // keep products in sync with cart state so buttons reflect current cart
  const { items: cartItems } = useAppSelector(s => s.cart);
  useEffect(() => {
    // run only after products are loaded to avoid race with fetchData
    if (products.length === 0) return;

    // if cart is empty, only update if any product currently shows inCart/quantity
    if (!cartItems || cartItems.length === 0) {
      const needUpdate = products.some(p => p.inCart || p.cartQuantity !== undefined);
      if (needUpdate) {
        setProducts(prev => prev.map(p => ({ ...p, inCart: false, cartQuantity: undefined })));
      }
      return;
    }

    const next = products.map(prod => {
      const found = cartItems.find(ci => ci.productId === prod.id || ci.id === prod.id);
      if (found) {
        return { ...prod, inCart: true, cartQuantity: found.quantity };
      }
      return { ...prod, inCart: false, cartQuantity: undefined };
    });

    const changed = next.some((np, i) => {
      const cur = products[i];
      const curQty = cur.cartQuantity === undefined ? undefined : cur.cartQuantity;
      const npQty = np.cartQuantity === undefined ? undefined : np.cartQuantity;
      return np.inCart !== cur.inCart || npQty !== curQty;
    });

    if (changed) setProducts(next);
  }, [cartItems, products.length]);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector(s => s.auth);

  const handleAddToCart = (id: string) => {
    // optimistic UI update
    setProducts(prev => prev.map(p => 
      p.id === id 
        ? { 
            ...p, 
            inCart: true, 
            cartQuantity: 1
          }
        : p
    ));
    const product = products.find(p => p.id === id);
    dispatch(addItem({ productId: id, quantity: 1, name: product?.title, price: product?.price }));
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
    // find cart item (could have backend id) and remove by its id when available
    const cartItem = cartItems.find(ci => ci.productId === id || ci.id === id);
    const removeId = cartItem ? cartItem.id : id;
    dispatch(removeItem({ id: removeId }));
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
    // dispatch update using cart item's id when available
    const cartItem = cartItems.find(ci => ci.productId === id || ci.id === id);
    if (cartItem) {
      const newQty = (cartItem.quantity || 0) + 1;
      dispatch(updateItem({ id: cartItem.id, quantity: newQty }));
    } else {
      // not in cart yet, add it
      const product = products.find(p => p.id === id);
      dispatch(addItem({ productId: id, quantity: 1, name: product?.title, price: product?.price }));
    }
  };

  const handleDecrementQuantity = (id: string) => {
    // if current quantity is 1 -> remove; otherwise decrement
    const cartItem = cartItems.find(ci => ci.productId === id || ci.id === id);
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      // optimistic UI
      setProducts(prev => prev.map(p => 
        p.id === id 
          ? { ...p, inCart: false, cartQuantity: undefined } 
          : p
      ));
      dispatch(removeItem({ id: cartItem.id }));
      return;
    }

    // decrement
    setProducts(prev => prev.map(p => 
      p.id === id && p.inCart
        ? { ...p, cartQuantity: (p.cartQuantity || 1) - 1 }
        : p
    ));
    const newQty = Math.max(1, (cartItem.quantity || 1) - 1);
    dispatch(updateItem({ id: cartItem.id, quantity: newQty }));
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
          {hasMore && (
            <div className={styles.loadMoreWrap}>
              <button className={styles.loadMoreButton} onClick={loadNextPage} disabled={isLoading}>
                {isLoading ? 'Загрузка...' : 'Загрузить ещё'}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};