'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Container } from '@/components/layout/Container/Container';
import { Button } from '@/components/ui/Button/Button';
import { InputSearch } from '@/components/ui/InputSearch/InputSearch';
import { Input } from '@/components/ui/Input/Input';
import { PlusIcon } from '@/components/ui/icons/PlusIcon';
import { CategoryRow } from './components/CategoryRow/CategoryRow';
import addStyles from './components/CategoryRow/CategoryRow.module.css';
import { CategorySortHeader } from './components/CategorySortHeader/CategorySortHeader';
import { CategoryNode, CategorySortOrder } from '@/types/category';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { buildCategoryTree, searchInCategoryTree, sortCategoryTree } from '@/lib/utils/categoryUtils';
import styles from './page.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

export default function CategoriesTreePage() {
  const custom = useCustomizer();
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<CategorySortOrder>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newRootTitle, setNewRootTitle] = useState('');
  const [newChildParentId, setNewChildParentId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
    // Open inline add-row under the given parent
    setNewChildParentId(parentId);
    // ensure parent is expanded so the new row is visible
    setCategories(prev => {
      const expandParent = (nodes: CategoryNode[]): CategoryNode[] =>
        nodes.map(node => {
          if (node.id === parentId) return { ...node, isExpanded: true };
          if (node.children.length > 0) return { ...node, children: expandParent(node.children) };
          return node;
        });

      return expandParent(prev);
    });
  };

  const handleCancelAdd = () => setNewChildParentId(null);

  const handleCreateSubcategory = async (parentId: string, title: string) => {
    if (!title.trim()) return alert('Введите название категории');
    setIsCreating(true);
    try {
      await categoriesApi.createCategory({ title: title.trim(), description: 'Описание', parentId });
      setNewChildParentId(null);
      await fetchCategories();
    } catch (err) {
      console.error('Ошибка создания категории:', err);
      alert('Не удалось создать категорию');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditCategory = (category: CategoryNode) => {
    // open inline edit for this category
    setEditingCategoryId(category.id);
  };

  const handleCancelEdit = () => setEditingCategoryId(null);

  const handleUpdateCategory = async (categoryId: string, title: string, parentId: string | null) => {
    if (!title.trim()) return alert('Введите название категории');
    setIsUpdating(true);
    try {
      await categoriesApi.updateCategory(categoryId, { title: title.trim(), description: 'Описание', parentId });
      setEditingCategoryId(null);
      await fetchCategories();
    } catch (err) {
      console.error('Ошибка обновления категории:', err);
      alert('Не удалось обновить категорию');
    } finally {
      setIsUpdating(false);
    }
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
    // show inline add row at the top
    setNewRootTitle('');
    setIsAddingCategory(true);
  };

  const handleCreateRoot = async (title: string) => {
    if (!title.trim()) return alert('Введите название категории');
    setIsCreating(true);
    try {
      await categoriesApi.createCategory({ title: title.trim(), description: 'Описание', parentId: null });
      setIsAddingCategory(false);
      setNewRootTitle('');
      await fetchCategories();
    } catch (err) {
      console.error('Ошибка создания корневой категории:', err);
      alert('Не удалось создать категорию');
    } finally {
      setIsCreating(false);
    }
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
              <Button className={styles.headerButton} onClick={handleRefresh} variant="secondary">
                Обновить
              </Button>
              <Button className={styles.headerButton} onClick={handleAddRootCategory}>
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
          <div className={styles.treeContainer} style={{"--color-custom": `var(--color-${custom.theme}-200)`} as React.CSSProperties}>
            <div className={styles.columnsHeader}>
              <div className={styles.columnName}>Название категории</div>
              <div className={styles.columnActions}>Действия</div>
            </div>

            <div className={styles.categoriesList}>
              {/* Inline add row for new root category */}
              {isAddingCategory && (
                <div className={`${addStyles.row} ${addStyles.addRow}`}>
                  <div style={{ width: 0 }} />
                  <div className={addStyles.rowContent}>
                    <Input
                      showClearButton
                      onClear={() => setNewRootTitle('')}
                      className={addStyles.addInput}
                      value={newRootTitle}
                      onChange={(e) => setNewRootTitle(e.target.value)}
                      placeholder="Название категории"
                    />
                    <div className={addStyles.addActions}>
                      <Button className={addStyles.saveButton} onClick={() => handleCreateRoot(newRootTitle)} disabled={isCreating}>
                        Сохранить
                      </Button>
                      <button className={addStyles.cancelButton} onClick={() => setIsAddingCategory(false)}>
                        Отмена
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
                      newChildParentId={newChildParentId}
                      onCreateSubcategory={handleCreateSubcategory}
                      onCancelAdd={handleCancelAdd}
                      isCreating={isCreating}
                      editingCategoryId={editingCategoryId}
                      onUpdateCategory={handleUpdateCategory}
                      onCancelEdit={handleCancelEdit}
                      isUpdating={isUpdating}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}