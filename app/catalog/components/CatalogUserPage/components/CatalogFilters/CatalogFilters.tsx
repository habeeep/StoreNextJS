 'use client';

import { useState, useMemo } from 'react';
import { CatalogFilters as FiltersType } from '@/types/catalog';
import { CategoryNode } from '@/types/category';
import { getAllChildrenIds } from '@/lib/utils/categoryUtils';
import { ChevronDownIcon } from '@/components/ui/icons/ChevronDownIcon';
import { Input } from '@/components/ui/Input/Input';
import { InputSearch } from '@/components/ui/InputSearch/InputSearch';
import { Button } from '@/components/ui/Button/Button';
import styles from './CatalogFilters.module.css';

interface BrandOption {
  value: string;
  label: string;
}

interface CatalogFiltersProps {
  filters: FiltersType;
  categories: CategoryNode[];
  // Accept either array of brand title strings (legacy admin) or option objects (value=id, label=title)
  brands: Array<BrandOption | string>;
  onFiltersChange: (filters: FiltersType) => void;
  onApplyFilters: () => void;
}

export const CatalogFilters = ({
  filters,
  categories,
  brands,
  onFiltersChange,
  onApplyFilters,
}: CatalogFiltersProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isBrandsExpanded, setIsBrandsExpanded] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');

  // normalize brands to option objects so component works with both string[] and {value,label}[]
  const brandOptions: BrandOption[] = useMemo(() => {
    return brands.map(b => typeof b === 'string' ? { value: b, label: b } : b);
  }, [brands]);

  const filteredAndSortedBrands = useMemo(() => {
    let result = [...brandOptions];

    if (brandSearch) {
      const searchLower = brandSearch.toLowerCase();
      result = result.filter(b =>
        b.label.toLowerCase().includes(searchLower)
      );
    }

    return result.sort((a, b) => {
      const aSelected = filters.selectedBrands.includes(a.value);
      const bSelected = filters.selectedBrands.includes(b.value);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return a.label.localeCompare(b.label);
    });
  }, [brands, brandSearch, filters.selectedBrands]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) newExpanded.delete(categoryId);
    else newExpanded.add(categoryId);
    setExpandedCategories(newExpanded);
  };

  const handleCategorySelect = (categoryId: string) => {
    const findNode = (nodes: CategoryNode[], id: string): CategoryNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children.length > 0) {
          const found = findNode(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const node = findNode(categories, categoryId);

    if (node && node.children.length > 0) {
      const idsToToggle = getAllChildrenIds(node);
      const allCurrentlySelected = idsToToggle.every(id => filters.selectedCategories.includes(id));

      let newSelected: string[];
      if (allCurrentlySelected) {
        newSelected = filters.selectedCategories.filter(id => !idsToToggle.includes(id));
      } else {
        newSelected = Array.from(new Set([...filters.selectedCategories, ...idsToToggle]));
      }

      onFiltersChange({ ...filters, selectedCategories: newSelected });
      return;
    }

    const newSelected = filters.selectedCategories.includes(categoryId)
      ? filters.selectedCategories.filter(id => id !== categoryId)
      : [...filters.selectedCategories, categoryId];

    onFiltersChange({ ...filters, selectedCategories: newSelected });
  };

  const handleBrandSelect = (brandValue: string) => {
    const newSelected = filters.selectedBrands.includes(brandValue)
      ? filters.selectedBrands.filter(b => b !== brandValue)
      : [...filters.selectedBrands, brandValue];

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

  const renderNode = (node: CategoryNode, level = 0) => {
    const isExpanded = expandedCategories.has(node.id);
    const isLeaf = node.children.length === 0;

    const containerClass = level === 0 ? styles.category : (level === 1 ? styles.subCategoryItem : styles.subCategoriesNested);

    if (isLeaf) {
      return (
        <div key={node.id} className={containerClass}>
          <label className={styles.checkboxItem}>
            <input
              type="checkbox"
              checked={filters.selectedCategories.includes(node.id)}
              onChange={() => handleCategorySelect(node.id)}
            />
            <span>{node.title}</span>
          </label>
        </div>
      );
    }

    return (
      <div key={node.id} className={containerClass}>
        <div
          className={styles.categoryHeader}
          onClick={() => toggleCategory(node.id)}
        >
          <span>{node.title}</span>
          <ChevronDownIcon
            className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`}
          />
        </div>

        {isExpanded && (
          <div className={styles.subCategories}>
            <label className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={filters.selectedCategories.includes(node.id)}
                onChange={() => handleCategorySelect(node.id)}
              />
              <span>Все {node.title}</span>
            </label>

            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.filters}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Категории</h3>
          <div className={styles.categories}>
            {categories.map(node => renderNode(node))}
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
                {visibleBrands.map(b => (
                  <label key={b.value} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={filters.selectedBrands.includes(b.value)}
                      onChange={() => handleBrandSelect(b.value)}
                    />
                    <span className={`
                      ${styles.brandName} 
                      ${filters.selectedBrands.includes(b.value) ? styles.selected : ''}
                    `}>
                      {b.label}
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