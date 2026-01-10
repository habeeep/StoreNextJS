'use client';

import { useState, useMemo, useCallback } from 'react';
import { Container } from '@/components/layout/Container/Container';
import { Button } from '@/components/ui/Button/Button';
import { InputSearch } from '@/components/ui/InputSearch/InputSearch';
import { PlusIcon } from '@/components/ui/icons/PlusIcon';
import { CategoryRow } from './components/CategoryRow/CategoryRow';
import { CategorySortHeader } from './components/CategorySortHeader/CategorySortHeader';
import { CategoryNode, CategorySortOrder } from '@/types/catalog';
import { mockCategories } from '@/lib/mocks/categories';
import styles from './page.module.css';

export default function CategoriesTreePage() {
  const [categories, setCategories] = useState<CategoryNode[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<CategorySortOrder>('none');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const searchInTree = useCallback((nodes: CategoryNode[], query: string): CategoryNode[] => {
    if (!query.trim()) return nodes;

    const filtered: CategoryNode[] = [];
    
    nodes.forEach((node) => {
      const matches = node.name.toLowerCase().includes(query.toLowerCase());
      
      const filteredChildren = searchInTree(node.children, query);
      
      if (matches || filteredChildren.length > 0) {
        filtered.push({
          ...node,
          children: filteredChildren,
          isExpanded: filteredChildren.length > 0 ? true : node.isExpanded,
        });
      }
    });
    
    return filtered;
  }, []);

  const sortTree = useCallback((nodes: CategoryNode[], order: CategorySortOrder): CategoryNode[] => {
    if (order === 'none') return nodes;

    return [...nodes].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return order === 'asc' ? comparison : -comparison;
    }).map((node) => ({
      ...node,
      children: sortTree(node.children, order),
    }));
  }, []);

  const processedCategories = useMemo(() => {
    let result = categories;
    
    if (searchQuery.trim()) {
      result = searchInTree(categories, searchQuery);
    }
    
    if (sortOrder !== 'none') {
      result = sortTree(result, sortOrder);
    }
    
    return result;
  }, [categories, searchQuery, sortOrder, searchInTree, sortTree]);

  const handleAddSubcategory = (parentId: string) => {
    // TODO: Реализовать модальное окно добавления
    console.log('Добавить подкатегорию для', parentId);
    setIsAddingCategory(true);
  };

  const handleEditCategory = (category: CategoryNode) => {
    // TODO: Реализовать модальное окно редактирования
    console.log('Редактировать категорию', category.id);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Удалить категорию? Все подкатегории также будут удалены.')) {
      // TODO: Реализовать удаление
      console.log('Удалить категорию', categoryId);
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
    // TODO: Реализовать добавление корневой категории
    console.log('Добавить корневую категорию');
    setIsAddingCategory(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Container>
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>Дерево категорий товаров</h1>
            <Button onClick={handleAddRootCategory}>
              Добавить категорию
            </Button>
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

        {/* TODO: Модальное окно для добавления/редактирования категории */}
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