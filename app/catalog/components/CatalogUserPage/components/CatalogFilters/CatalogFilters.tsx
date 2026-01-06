'use client';

import { useState, useMemo } from 'react';
import { Category, CatalogFilters as FiltersType } from '@/types/catalog';
import { ChevronDownIcon } from '@/components/ui/icons/ChevronDownIcon';
import { Input } from '@/components/ui/Input/Input';
import { InputSearch } from '@/components/ui/InputSearch/InputSearch';
import { Button } from '@/components/ui/Button/Button';
import styles from './CatalogFilters.module.css';

interface CatalogFiltersProps {
  filters: FiltersType;
  categories: Category[];
  brands: string[];
  onFiltersChange: (filters: FiltersType) => void;
  onApplyFilters: () => void;
}

export const CatalogFilters = ({ 
  filters, 
  categories, 
  brands,
  onFiltersChange,
  onApplyFilters 
}: CatalogFiltersProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isBrandsExpanded, setIsBrandsExpanded] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');

  const filteredAndSortedBrands = useMemo(() => {
    let result = [...brands];
    
    if (brandSearch) {
      const searchLower = brandSearch.toLowerCase();
      result = result.filter(brand => 
        brand.toLowerCase().includes(searchLower)
      );
    }
    
    return result.sort((a, b) => {
      const aSelected = filters.selectedBrands.includes(a);
      const bSelected = filters.selectedBrands.includes(b);
      
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return a.localeCompare(b);
    });
  }, [brands, brandSearch, filters.selectedBrands]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategorySelect = (categoryId: string) => {
    const newSelected = filters.selectedCategories.includes(categoryId)
      ? filters.selectedCategories.filter(id => id !== categoryId)
      : [...filters.selectedCategories, categoryId];
    
    onFiltersChange({ ...filters, selectedCategories: newSelected });
  };

  const handleBrandSelect = (brand: string) => {
    const newSelected = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter(b => b !== brand)
      : [...filters.selectedBrands, brand];
    
    onFiltersChange({ ...filters, selectedBrands: newSelected });
  };

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [field]: numValue
      }
    });
  };

  const clearPrice = (field: 'min' | 'max') => {
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [field]: 0
      }
    });
  };

  const handleBrandSearch = (value: string) => {
    setBrandSearch(value);
  };

  const clearBrandSearch = () => {
    setBrandSearch('');
  };

  const visibleBrands = isBrandsExpanded 
    ? filteredAndSortedBrands 
    : filteredAndSortedBrands.slice(0, 5);

  return (
    <div className={styles.sidebar}>
      <div className={styles.filters}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Категории</h3>
          <div className={styles.categories}>
            {categories.map(category => (
              <div key={category.id} className={styles.category}>
                <div 
                  className={styles.categoryHeader}
                  onClick={() => toggleCategory(category.id)}
                >
                  <span>{category.name}</span>
                  <ChevronDownIcon 
                    className={`${styles.chevron} ${expandedCategories.has(category.id) ? styles.expanded : ''}`}
                  />
                </div>
                
                {expandedCategories.has(category.id) && (
                  <div className={styles.subCategories}>
                    <label className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={filters.selectedCategories.includes(category.id)}
                        onChange={() => handleCategorySelect(category.id)}
                      />
                      <span>Все {category.name}</span>
                    </label>
                    
                    {category.subCategories.map(sub => (
                      <label key={sub.id} className={styles.checkboxItem}>
                        <input
                          type="checkbox"
                          checked={filters.selectedCategories.includes(sub.id)}
                          onChange={() => handleCategorySelect(sub.id)}
                        />
                        <span>{sub.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Бренды</h3>
          
          <InputSearch
            initialValue={brandSearch}
            onSearch={handleBrandSearch}
            onClear={clearBrandSearch}
            placeholder="Поиск бренда..."
            className={styles.brandSearch}
          />
          
          <div className={styles.brandsList}>
            {visibleBrands.length > 0 ? (
              <>
                {visibleBrands.map(brand => (
                  <label key={brand} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={filters.selectedBrands.includes(brand)}
                      onChange={() => handleBrandSelect(brand)}
                    />
                    <span className={`
                      ${styles.brandName} 
                      ${filters.selectedBrands.includes(brand) ? styles.selected : ''}
                    `}>
                      {brand}
                    </span>
                  </label>
                ))}
                
                {filteredAndSortedBrands.length > 5 && (
                  <button
                    className={styles.expandButton}
                    onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
                    aria-label={isBrandsExpanded ? 'Свернуть список' : 'Развернуть список'}
                  >
                    {isBrandsExpanded ? 'Свернуть' : 'Показать все'}
                    <ChevronDownIcon 
                      className={`${styles.expandChevron} ${isBrandsExpanded ? styles.expanded : ''}`}
                    />
                  </button>
                )}
              </>
            ) : (
              <div className={styles.noBrands}>Бренды не найдены</div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Цена, ₽</h3>
          <div className={styles.priceRange}>
            <Input
              type="number"
              placeholder="От _ ₽"
              value={filters.priceRange.min === 0 ? '' : filters.priceRange.min.toString()}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className={styles.priceInput}
              showClearButton={filters.priceRange.min > 0}
              onClear={() => clearPrice('min')}
              min={0}
              aria-label="Минимальная цена"
            />
            <Input
              type="number"
              placeholder="До _ ₽"
              value={filters.priceRange.max === 0 ? '' : filters.priceRange.max.toString()}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className={styles.priceInput}
              showClearButton={filters.priceRange.max > 0}
              onClear={() => clearPrice('max')}
              min={0}
              aria-label="Максимальная цена"
            />
          </div>
        </div>
      </div>
      <Button className={styles.applyButton} onClick={onApplyFilters}>
        Применить фильтры
      </Button>
    </div>
  );
};