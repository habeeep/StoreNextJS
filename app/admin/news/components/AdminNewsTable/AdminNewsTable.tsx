'use client';

import { NewsItem } from '@/types/news';
import { NewsTableRow } from '../NewsTableRow/NewsTableRow';
import styles from './AdminNewsTable.module.css';
import { HeartIcon } from '@/components/ui/icons/HeartIcon';
import { EyeIcon } from '@/components/ui/icons/EyeIcon';
import { CommentIcon } from '@/components/ui/icons/CommentIcon';
import { useCustomizer } from '@/hooks/useCustomizer';

interface AdminNewsTableProps {
  news: NewsItem[];
  onDelete: (id: string) => void;
}

export const AdminNewsTable = ({ news, onDelete }: AdminNewsTableProps) => {
  const custom = useCustomizer();
  if (news.length === 0) {
    return <div className={styles.empty}>Новостей пока нет</div>;
  }

  return (
    <div className={styles.tableWrapper} style={{"--color-custom": `var(--color-${custom.theme}-200)`} as React.CSSProperties}>
      <table className={styles.table} style={{"--color-custom": `var(--color-${custom.theme}-200)`} as React.CSSProperties}>
        <thead>
          <tr>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>#</th>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>Название</th>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>Описание</th>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>
              <span className={styles.iconColumn}><HeartIcon /></span>
            </th>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>
              <span className={styles.iconColumn}><EyeIcon /></span>
            </th>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>
              <span className={styles.iconColumn}><CommentIcon /></span>
            </th>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}>Дата создания</th>
            <th className={styles.th} style={{"--color-custom": `var(--color-${custom.theme}-300)`} as React.CSSProperties}></th>
          </tr>
        </thead>
        <tbody>
          {news.map((item, index) => (
            <NewsTableRow
              key={item.id}
              news={item}
              index={index + 1}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};