'use client';

import { Brand } from '@/types/brand';
import { BrandTableRow } from '../BrandTableRow/BrandTableRow';
import styles from './BrandTable.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

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
  const custom = useCustomizer();
  if (brands.length === 0) {
    return <div className={styles.empty}>Брендов не найдено</div>;
  }

  return (
    <div className={styles.tableWrapper} style={{"--color-custom": `var(--color-${custom.theme}-200)`} as React.CSSProperties}>
      <table className={styles.table} style={{"--color-custom": `var(--color-${custom.theme}-200)`} as React.CSSProperties}>
        <thead>
          <tr>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>Название</th>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>Страна</th>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}></th>
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