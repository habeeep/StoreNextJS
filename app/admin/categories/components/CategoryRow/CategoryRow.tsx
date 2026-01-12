// app/admin/categories/components/CategoryRow/CategoryRow.tsx
'use client';

import { CategoryNode } from '@/types/category';
import { PlusIcon } from '@/components/ui/icons/PlusIcon';
import { EditIcon } from '@/components/ui/icons/EditIcon';
import { TrashIcon } from '@/components/ui/icons/TrashIcon';
import { ChevronDownIcon } from '@/components/ui/icons/ChevronDownIcon';
import styles from './CategoryRow.module.css';

interface CategoryRowProps {
  category: CategoryNode;
  onAddSubcategory: (parentId: string) => void;
  onEdit: (category: CategoryNode) => void;
  onDelete: (categoryId: string) => void;
  onToggleExpand: (categoryId: string) => void;
}

export const CategoryRow = ({
  category,
  onAddSubcategory,
  onEdit,
  onDelete,
  onToggleExpand,
}: CategoryRowProps) => {
  const indent = category.level * 24;

  return (
    <>
      <div className={`${styles.row} ${category.level > 0 ? styles.rowChild : ''}`}>
        <div style={{ width: indent }} />
        <div className={styles.rowContent}>
          <div className={styles.name}>
            {category.title} {/* Изменил с category.name на category.title */}
          </div>
          
          <div className={styles.actions}>
            <div className={styles.universalButtons}>
              <button
                onClick={() => onAddSubcategory(category.id)}
                className={styles.actionButton}
                title="Добавить подкатегорию"
              >
                <PlusIcon size={24} />
              </button>
              
              <button
                onClick={() => onEdit(category)}
                className={styles.actionButton}
                title="Редактировать"
              >
                <EditIcon size={24} />
              </button>
              
              <button
                onClick={() => onDelete(category.id)}
                className={styles.actionButton}
                title="Удалить"
              >
                <TrashIcon size={24} />
              </button>
            </div>
            
            {category.children.length > 0 ? (
              <button
                className={`${styles.expandButton} ${styles.actionButton}`}
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
      
      {category.isExpanded && category.children.map((child) => (
        <CategoryRow
          key={child.id}
          category={child}
          onAddSubcategory={onAddSubcategory}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleExpand={onToggleExpand}
        />
      ))}
    </>
  );
};