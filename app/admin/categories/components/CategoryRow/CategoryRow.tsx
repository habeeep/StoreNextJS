'use client';

import { useEffect, useRef, useState } from 'react';
import { CategoryNode } from '@/types/category';
import { PlusIcon } from '@/components/ui/icons/PlusIcon';
import { EditIcon } from '@/components/ui/icons/EditIcon';
import { TrashIcon } from '@/components/ui/icons/TrashIcon';
import { ChevronDownIcon } from '@/components/ui/icons/ChevronDownIcon';
import styles from './CategoryRow.module.css';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { useCustomizer } from '@/hooks/useCustomizer';

interface CategoryRowProps {
  category: CategoryNode;
  onAddSubcategory: (parentId: string) => void;
  onEdit: (category: CategoryNode) => void;
  onDelete: (categoryId: string) => void;
  onToggleExpand: (categoryId: string) => void;
  newChildParentId?: string | null;
  onCreateSubcategory?: (parentId: string, title: string) => void;
  onCancelAdd?: () => void;
  isCreating?: boolean;
  editingCategoryId?: string | null;
  onUpdateCategory?: (categoryId: string, title: string, parentId: string | null) => void;
  onCancelEdit?: () => void;
  isUpdating?: boolean;
}

export const CategoryRow = ({
  category,
  onAddSubcategory,
  onEdit,
  onDelete,
  onToggleExpand,
  newChildParentId = null,
  onCreateSubcategory,
  onCancelAdd,
  isCreating = false,
  editingCategoryId = null,
  onUpdateCategory,
  onCancelEdit,
  isUpdating = false,
}: CategoryRowProps) => {
  const custom = useCustomizer();
  const indent = category.level * 24;
  const [newTitle, setNewTitle] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (category.id === newChildParentId) {
      setNewTitle('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    if (category.id === editingCategoryId) {
      setEditTitle(category.title || '');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [category.id, newChildParentId, editingCategoryId]);

  return (
    <>
      <div className={`${styles.row} ${category.level > 0 ? styles.rowChild : ''}`} style={{"--color-custom": `var(--color-${custom.theme}-400)`} as React.CSSProperties}>
        <div style={{ width: indent }} />
        <div className={styles.rowContent}>
          <div className={styles.name}>{category.title}</div>

          <div className={styles.actions}>
            <div className={styles.universalButtons}>
              <button
                onClick={() => onAddSubcategory(category.id)}
                className={styles.actionButton}
                style={{"--color-custom": `var(--color-${custom.theme}-800)`} as React.CSSProperties}
                title="Добавить подкатегорию"
              >
                <PlusIcon size={24} />
              </button>

              <button
                onClick={() => onEdit(category)}
                className={styles.actionButton}
                style={{"--color-custom": `var(--color-${custom.theme}-800)`} as React.CSSProperties}
                title="Редактировать"
              >
                <EditIcon size={24} />
              </button>

              <button
                onClick={() => onDelete(category.id)}
                className={styles.actionButton}
                style={{"--color-custom": `var(--color-${custom.theme}-800)`} as React.CSSProperties}
                title="Удалить"
              >
                <TrashIcon size={24} />
              </button>
            </div>

            {category.children.length > 0 ? (
              <button
                className={`${styles.expandButton} ${styles.actionButton}`}
                style={{"--color-custom": `var(--color-${custom.theme}-800)`} as React.CSSProperties}
                onClick={() => onToggleExpand(category.id)}
                aria-label={category.isExpanded ? 'Свернуть' : 'Развернуть'}
                title={category.isExpanded ? 'Свернуть' : 'Развернуть'}
              >
                <ChevronDownIcon
                  className={`${styles.chevron} ${category.isExpanded ? styles.expanded : ''}`}
                  size={24}
                />
              </button>
            ) : (
              <ChevronDownIcon
                className={`${styles.chevron} ${styles.chevronHidden}`}
                size={24}
              />
            )}
          </div>
        </div>
      </div>

      {category.id === newChildParentId && (
        <div className={`${styles.row} ${styles.addRow}`} key={`${category.id}-add`}>
          <div style={{ width: (category.level + 1) * 24 }} />
          <div className={styles.rowContent}>
            <Input
              ref={inputRef}
              showClearButton
              onClear={() => setNewTitle('')}
              className={styles.addInput}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Название подкатегории"
            />
            <div className={styles.addActions}>
              <Button className={styles.saveButton} onClick={() => onCreateSubcategory && onCreateSubcategory(category.id, newTitle)} disabled={isCreating}>
                Сохранить
              </Button>
              <button className={styles.cancelButton} onClick={() => onCancelAdd && onCancelAdd()} style={{"--color-custom": `var(--color-${custom.theme}-700)`} as React.CSSProperties}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {category.id === editingCategoryId && (
        <div className={`${styles.row} ${styles.editRow}`} key={`${category.id}-edit`}>
          <div style={{ width: indent }} />
          <div className={styles.rowContent}>
            <Input
              ref={inputRef}
              showClearButton
              onClear={() => setEditTitle('')}
              className={styles.addInput}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Название категории"
            />
            <div className={styles.addActions}>
              <Button className={styles.saveButton} onClick={() => onUpdateCategory && onUpdateCategory(category.id, editTitle, category.parentId)} disabled={isUpdating}>
                Сохранить
              </Button>
              <button className={styles.cancelButton} onClick={() => onCancelEdit && onCancelEdit()} style={{"--color-custom": `var(--color-${custom.theme}-700)`} as React.CSSProperties}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {category.isExpanded && category.children.map((child) => (
        <CategoryRow
          key={child.id}
          category={child}
          onAddSubcategory={onAddSubcategory}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleExpand={onToggleExpand}
          newChildParentId={newChildParentId}
          onCreateSubcategory={onCreateSubcategory}
          onCancelAdd={onCancelAdd}
          isCreating={isCreating}
          editingCategoryId={editingCategoryId}
          onUpdateCategory={onUpdateCategory}
          onCancelEdit={onCancelEdit}
          isUpdating={isUpdating}
        />
      ))}
    </>
  );
};