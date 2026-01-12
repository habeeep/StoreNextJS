'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Container } from '@/components/layout/Container/Container';
import { Button } from '@/components/ui/Button/Button';
import { InputSearch } from '@/components/ui/InputSearch/InputSearch';
import { PlusIcon } from '@/components/ui/icons/PlusIcon';
import { CategoryRow } from './components/CategoryRow/CategoryRow';
import { CategorySortHeader } from './components/CategorySortHeader/CategorySortHeader';
import { CategoryNode, CategorySortOrder } from '@/types/category';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { buildCategoryTree, searchInCategoryTree, sortCategoryTree } from '@/lib/utils/categoryUtils';
import styles from './page.module.css';

export default function CategoriesTreePage() {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<CategorySortOrder>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiCategories = await categoriesApi.getAllCategories();
      const categoryTree = buildCategoryTree(apiCategories);
      setCategories(categoryTree);
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки категорий');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const processedCategories = useMemo(() => {
    let result = categories;
    
    if (searchQuery.trim()) {
      result = searchInCategoryTree(categories, searchQuery);
    }
    
    if (sortOrder !== 'none') {
      result = sortCategoryTree(result, sortOrder);
    }
    
    return result;
  }, [categories, searchQuery, sortOrder]);

  const handleAddSubcategory = (parentId: string) => {
    console.log('Добавить подкатегорию для', parentId);
    setIsAddingCategory(true);
  };

  const handleEditCategory = (category: CategoryNode) => {
    console.log('Редактировать категорию', category.id);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Удалить категорию? Все подкатегории также будут удалены.')) {
      try {
        await categoriesApi.deleteCategory(categoryId);
        fetchCategories();
      } catch (err) {
        console.error('Ошибка удаления:', err);
        alert('Не удалось удалить категорию');
      }
    }
  };

  const handleToggleExpand = (categoryId: string) => {
    const toggleExpanded = (nodes: CategoryNode[]): CategoryNode[] => {
      return nodes.map((node) => {
        if (node.id === categoryId) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children.length > 0) {
          return { ...node, children: toggleExpanded(node.children) };
        }
        return node;
      });
    };

    setCategories(toggleExpanded(categories));
  };

  const handleAddRootCategory = () => {
    console.log('Добавить корневую категорию');
    setIsAddingCategory(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    fetchCategories();
  };

  return (
    <Container>
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>Дерево категорий товаров</h1>
            <div className={styles.topButtons}>
              <Button onClick={handleRefresh} variant="secondary">
                Обновить
              </Button>
              <Button onClick={handleAddRootCategory}>
                <PlusIcon size={20} />
                Добавить категорию
              </Button>
            </div>
          </div>

          <div className={styles.headerBottom}>
            <CategorySortHeader
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
            
            <InputSearch
              onSearch={handleSearch}
              placeholder="Поиск по названию категории..."
              className={styles.searchInput}
            />
          </div>
        </div>

        {isLoading && (
          <div className={styles.loading}>Загрузка категорий...</div>
        )}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <Button onClick={handleRefresh} variant="secondary">
              Попробовать снова
            </Button>
          </div>
        )}

        {!isLoading && !error && (
          <div className={styles.treeContainer}>
            <div className={styles.columnsHeader}>
              <div className={styles.columnName}>Название категории</div>
              <div className={styles.columnActions}>Действия</div>
            </div>

            <div className={styles.categoriesList}>
              {processedCategories.length === 0 ? (
                <div className={styles.emptyState}>
                  {searchQuery.trim()
                    ? 'Категории по вашему запросу не найдены'
                    : 'Категорий пока нет'}
                </div>
              ) : (
                processedCategories.map((category) => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    onAddSubcategory={handleAddSubcategory}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                    onToggleExpand={handleToggleExpand}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {isAddingCategory && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Добавление категории</h3>
              <p>Здесь будет форма для добавления категории...</p>
              <Button onClick={() => setIsAddingCategory(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}