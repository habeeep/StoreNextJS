// app/admin/catalog/components/ProductTable/ProductTable.tsx
'use client';

import { Product } from '@/types/catalog';
import { Brand } from '@/types/brand';
import { CategoryNode } from '@/types/category';
import { ProductTableRow } from '../ProductTableRow/ProductTableRow';
import styles from './ProductTable.module.css';

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
  if (products.length === 0) {
    return <div className={styles.empty}>Товаров не найдено</div>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Название</th>
            <th className={styles.th}>Бренд</th>
            <th className={styles.th}>Категория</th>
            <th className={styles.th}>Цена и наличие</th>
            <th className={styles.th}></th>
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