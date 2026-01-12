// app/admin/brands/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container/Container';
import { Button } from '@/components/ui/Button/Button';
import { PlusIcon } from '@/components/ui/icons/PlusIcon';
import { ApiBrand, Brand } from '@/types/brand';
import { brandsApi } from '@/lib/api/brandsApi';
import { convertApiBrandsToBrands, searchBrands, sortBrands } from '@/lib/utils/brandUtils';
import { BrandTable } from './components/BrandTable/BrandTable';
import { BrandSortHeader } from './components/BrandSortHeader/BrandSortHeader';
import styles from './page.module.css';

type SortField = 'title' | 'country';
type SortOrder = 'asc' | 'desc';

export default function AdminBrandsPage() {
  const router = useRouter();
  
  // Состояния
  const [brands, setBrands] = useState<Brand[]>([]);
  const [apiBrands, setApiBrands] = useState<ApiBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Фильтры и сортировка
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  // Загрузка брендов
  const fetchBrands = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await brandsApi.getAllBrands();
      setApiBrands(data);
      const convertedBrands = convertApiBrandsToBrands(data);
      setBrands(convertedBrands);
    } catch (err) {
      console.error('Ошибка при загрузке брендов:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки брендов');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Получение уникальных стран для фильтра
  const countries = useMemo(() => {
    const countrySet = new Set<string>();
    apiBrands.forEach(brand => {
      if (brand.country) {
        countrySet.add(brand.country);
      }
    });
    return Array.from(countrySet).sort();
  }, [apiBrands]);

  // Фильтрация и сортировка
  const filteredAndSortedBrands = useMemo(() => {
    let result = [...brands];

    // Поиск по названию
    if (searchQuery) {
      result = searchBrands(result, searchQuery);
    }

    // Фильтрация по стране
    if (selectedCountry !== 'all') {
      result = result.filter(brand => brand.country === selectedCountry);
    }

    // Сортировка
    result = sortBrands(result, sortField, sortOrder);

    return result;
  }, [brands, searchQuery, selectedCountry, sortField, sortOrder]);

  // Обработчики
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleEditBrand = (brand: Brand) => {
    router.push(`/admin/brands/edit/${brand.id}`);
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (confirm('Удалить бренд?')) {
      try {
        await brandsApi.deleteBrand(brandId);
        fetchBrands(); // Обновляем список
      } catch (err) {
        console.error('Ошибка при удалении бренда:', err);
        alert('Не удалось удалить бренд');
      }
    }
  };

  const handleViewBrand = (brandId: string) => {
    // Можно перейти на детальную страницу или оставить пустым
    console.log('Просмотр бренда:', brandId);
  };

  const handleCreateBrand = () => {
    router.push('/admin/brands/create');
  };

  const handleRefresh = () => {
    fetchBrands();
  };

  const handleCountryFilterChange = (country: string) => {
    setSelectedCountry(country);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCountry('all');
    setSortField('title');
    setSortOrder('asc');
  };

  return (
    <Container>
      <div className={styles.page}>
        {/* Шапка с сортировкой и поиском */}
        <div className={styles.header}>
          <BrandSortHeader
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            onClearSearch={handleClearSearch}
          />
        </div>

        <div className={styles.content}>
          {/* Основная часть с таблицей */}
          <div className={styles.main}>
            <div className={styles.tableHeader}>
              <div className={styles.tableInfo}>
                <span className={styles.brandsCount}>
                  Брендов: {filteredAndSortedBrands.length}
                </span>
                {(searchQuery || selectedCountry !== 'all') && (
                  <button 
                    onClick={handleResetFilters}
                    className={styles.resetFiltersButton}
                  >
                    Сбросить фильтры
                  </button>
                )}
              </div>
            </div>
            
            <div className={styles.tableSection}>
              <BrandTable
                brands={filteredAndSortedBrands}
                onEdit={handleEditBrand}
                onDelete={handleDeleteBrand}
                onView={handleViewBrand}
              />
            </div>
          </div>

          {/* Сайдбар с фильтрами */}
          <aside className={styles.sidebar}>
            <div className={styles.filtersContainer}>
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>Страна</h3>
                <div className={styles.countryFilters}>
                  <button
                    className={`${styles.countryFilter} ${selectedCountry === 'all' ? styles.active : ''}`}
                    onClick={() => handleCountryFilterChange('all')}
                  >
                    Все страны
                  </button>
                  {countries.map(country => (
                    <button
                      key={country}
                      className={`${styles.countryFilter} ${selectedCountry === country ? styles.active : ''}`}
                      onClick={() => handleCountryFilterChange(country)}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={styles.sidebarActions}>
              <Button 
                onClick={handleCreateBrand}
                className={styles.createButton}
              >
                <PlusIcon size={20} />
                Создать бренд
              </Button>
              
              <Button 
                onClick={handleRefresh}
                variant="secondary"
                className={styles.refreshButton}
              >
                Обновить
              </Button>
              
              <Button 
                onClick={handleResetFilters}
                variant="secondary"
                className={styles.resetButton}
              >
                Сбросить все
              </Button>
            </div>
          </aside>
        </div>

        {/* Состояния загрузки/ошибки */}
        {isLoading && (
          <div className={styles.loading}>Загрузка брендов...</div>
        )}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <Button onClick={handleRefresh} variant="secondary">
              Попробовать снова
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}