'use client';

import { useState, useEffect, useMemo } from 'react';
import { InputSearch } from '@/components/ui/InputSearch/InputSearch';
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
import { useCustomizer } from '@/hooks/useCustomizer';

type SortField = 'title' | 'country';
type SortOrder = 'asc' | 'desc';

export default function AdminBrandsPage() {
  const custom = useCustomizer();
  const router = useRouter();
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [apiBrands, setApiBrands] = useState<ApiBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

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

  const countries = useMemo(() => {
    const countrySet = new Set<string>();
    apiBrands.forEach(brand => {
      if (brand.country) {
        countrySet.add(brand.country);
      }
    });
    return Array.from(countrySet).sort();
  }, [apiBrands]);

  const [countrySearch, setCountrySearch] = useState('');
  const [isCountriesExpanded, setIsCountriesExpanded] = useState(false);
  const [tempSelectedCountries, setTempSelectedCountries] = useState<string[]>([]);
  const [appliedCountries, setAppliedCountries] = useState<string[]>([]);

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countries;
    const q = countrySearch.toLowerCase();
    return countries.filter(c => c.toLowerCase().includes(q));
  }, [countries, countrySearch]);

  const visibleCountries = useMemo(() => {
    if (isCountriesExpanded) return filteredCountries;

    const selected = tempSelectedCountries.filter(c => filteredCountries.includes(c));
    if (selected.length === 0) {
      return filteredCountries.slice(0, 5);
    }

    const others = filteredCountries.filter(c => !selected.includes(c));
    const slots = Math.max(0, 5 - selected.length);
    const fill = others.slice(0, slots);
    return [...selected, ...fill];
  }, [filteredCountries, isCountriesExpanded, tempSelectedCountries]);

  const filteredAndSortedBrands = useMemo(() => {
    let result = [...brands];

    if (searchQuery) {
      result = searchBrands(result, searchQuery);
    }

    if (appliedCountries.length > 0) {
      result = result.filter(brand => appliedCountries.includes(brand.country));
    }

    result = sortBrands(result, sortField, sortOrder);

    return result;
  }, [brands, searchQuery, appliedCountries, sortField, sortOrder]);

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
        fetchBrands();
      } catch (err) {
        console.error('Ошибка при удалении бренда:', err);
        alert('Не удалось удалить бренд');
      }
    }
  };

  const handleViewBrand = (brandId: string) => {
    console.log('Просмотр бренда:', brandId);
  };

  const handleCreateBrand = () => {
    router.push('/admin/brands/create');
  };

  const handleRefresh = () => {
    fetchBrands();
  };

  const handleTempToggleCountry = (country: string) => {
    setTempSelectedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const handleSelectAllTemp = () => {
    if (tempSelectedCountries.length === filteredCountries.length) {
      setTempSelectedCountries([]);
    } else {
      setTempSelectedCountries(filteredCountries.slice());
    }
  };

  const handleApplyCountryFilters = () => {
    setAppliedCountries(tempSelectedCountries.slice());
    setIsCountriesExpanded(false);
  };

  const handleResetCountryFilters = () => {
    setTempSelectedCountries([]);
    setAppliedCountries([]);
    setCountrySearch('');
    setIsCountriesExpanded(false);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCountry('all');
    handleResetCountryFilters();
    setSortField('title');
    setSortOrder('asc');
  };

  return (
    <Container>
      <div className={styles.page}>
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
          <div className={styles.main}>
            
            <div className={styles.tableSection}>
              <BrandTable
                brands={filteredAndSortedBrands}
                onEdit={handleEditBrand}
                onDelete={handleDeleteBrand}
                onView={handleViewBrand}
              />
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.filtersContainer}
            style={{"--color-custom": `var(--color-${custom.theme}-200)`} as React.CSSProperties}>
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}
                style={{"--color-custom": `var(--color-${custom.theme}-800)`} as React.CSSProperties}
                >Страна</h3>

                <InputSearch
                  initialValue={countrySearch}
                  onSearch={(v) => setCountrySearch(v)}
                  onClear={() => setCountrySearch('')}
                  placeholder="Поиск страны..."
                  className={styles.brandSearch}
                  style={{"--color-custom": `var(--color-${custom.theme}-100)`} as React.CSSProperties}
                />

                <div className={styles.brandsList}>
                  <div className={styles.controlsRow}>
                    <button className={styles.expandButton} onClick={handleSelectAllTemp} style={{"--color-custom": `var(--color-${custom.theme}-700)`} as React.CSSProperties}>
                      {tempSelectedCountries.length === filteredCountries.length ? 'Снять всё' : 'Выбрать все'}
                    </button>
                    {filteredCountries.length > 5 && (
                      <button
                        className={styles.expandButton}
                        onClick={() => setIsCountriesExpanded(prev => !prev)}
                        aria-label={isCountriesExpanded ? 'Свернуть список' : 'Развернуть список'}
                        style={{"--color-custom": `var(--color-${custom.theme}-700)`} as React.CSSProperties}
                      >
                        {isCountriesExpanded ? 'Свернуть' : 'Показать все'}
                      </button>
                    )}
                  </div>

                  {visibleCountries.length > 0 ? (
                    visibleCountries.map(country => (
                      <label key={country} className={styles.checkboxItem}>
                        <input
                          type="checkbox"
                          name="country"
                          checked={tempSelectedCountries.includes(country)}
                          onChange={() => handleTempToggleCountry(country)}
                        />
                        <span className={`${styles.brandName} ${tempSelectedCountries.includes(country) ? styles.selected : ''}`}
                        style={{"--color-custom": `var(--color-${custom.theme}-800)`} as React.CSSProperties}>
                          {country}
                        </span>
                      </label>
                    ))
                  ) : (
                    <div className={styles.noBrands}>Страны не найдены</div>
                  )}

                  <div className={styles.filterActions}>
                    <Button className={styles.applyButton} onClick={handleApplyCountryFilters}>
                      Применить
                    </Button>
                    <Button variant="secondary" className={styles.resetButton} onClick={handleResetCountryFilters}>
                      Сбросить
                    </Button>
                  </div>
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
            </div>
          </aside>
        </div>

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