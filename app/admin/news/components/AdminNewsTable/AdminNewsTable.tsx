'use client';

import { NewsItem } from '@/types/news';
import { NewsTableRow } from '../NewsTableRow/NewsTableRow';
import styles from './AdminNewsTable.module.css';
import { HeartIcon } from '@/components/ui/icons/HeartIcon';
import { EyeIcon } from '@/components/ui/icons/EyeIcon';
import { CommentIcon } from '@/components/ui/icons/CommentIcon';

interface AdminNewsTableProps {
  news: NewsItem[];
  onDelete: (id: string) => void;
}

export const AdminNewsTable = ({ news, onDelete }: AdminNewsTableProps) => {
  if (news.length === 0) {
    return <div className={styles.empty}>Новостей пока нет</div>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>#</th>
            <th className={styles.th}>Название</th>
            <th className={styles.th}>Описание</th>
            <th className={styles.th}>
              <span className={styles.iconColumn}><HeartIcon /></span>
            </th>
            <th className={styles.th}>
              <span className={styles.iconColumn}><EyeIcon /></span>
            </th>
            <th className={styles.th}>
              <span className={styles.iconColumn}><CommentIcon /></span>
            </th>
            <th className={styles.th}>Дата создания</th>
            <th className={styles.th}></th>
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