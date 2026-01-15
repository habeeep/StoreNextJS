'use client';

import { Product } from '@/types/catalog';
import { Brand } from '@/types/brand';
import { CategoryNode } from '@/types/category';
import { ProductTableRow } from '../ProductTableRow/ProductTableRow';
import styles from './ProductTable.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

interface ProductTableProps {
  products: Product[];
  brands: Brand[];
  categories: CategoryNode[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onView: (productId: string) => void;
}

export const ProductTable = ({
  products,
  brands,
  categories,
  onEdit,
  onDelete,
  onView,
}: ProductTableProps) => {
  const custom = useCustomizer();
  if (products.length === 0) {
    return <div className={styles.empty}>Товаров не найдено</div>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table} style={{"--color-custom": `var(--color-${custom.theme}-200)`} as React.CSSProperties}>
        <thead>
          <tr>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>Название</th>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>Бренд</th>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>Категория</th>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>Цена и наличие</th>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductTableRow
              key={product.id}
              product={product}
              brands={brands}
              categories={categories}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};