'use client';

import { Brand } from '@/types/brand';
import { BrandTableRow } from '../BrandTableRow/BrandTableRow';
import styles from './BrandTable.module.css';

interface BrandTableProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
  onView: (brandId: string) => void;
}

export const BrandTable = ({
  brands,
  onEdit,
  onDelete,
  onView,
}: BrandTableProps) => {
  if (brands.length === 0) {
    return <div className={styles.empty}>Брендов не найдено</div>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Название</th>
            <th className={styles.th}>Страна</th>
            <th className={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <BrandTableRow
              key={brand.id}
              brand={brand}
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