'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NewsItem } from '@/types/news';
import { EyeIcon } from '@/components/ui/icons/EyeIcon';
import { EditIcon } from '@/components/ui/icons/EditIcon';
import { TrashIcon } from '@/components/ui/icons/TrashIcon';
import styles from './NewsTableRow.module.css';
import { DotsIcon } from '@/components/ui/icons/DotsIcon';

interface NewsTableRowProps {
  news: NewsItem;
  index: number;
  onDelete: (id: string) => void;
}

export const NewsTableRow = ({ news, index, onDelete }: NewsTableRowProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <tr className={styles.row}>
      <td className={styles.td}>{index}</td>
      
      <td className={styles.td}>
            {news.title}
      </td>

      <td className={styles.td}>
            {news.text ? news.text.substring(0, 600) + '...' : 'Нет содержания'}
      </td>
      
      <td className={styles.td}>
        <div className={styles.iconCell}>
          {news.likesCount}
        </div>
      </td>
      
      <td className={styles.td}>
        <div className={styles.iconCell}>
          {news.watchCount}
        </div>
      </td>
      
      <td className={styles.td}>
        <div className={styles.iconCell}>
          {news.commentsCount}
        </div>
      </td>
      
      <td className={styles.td}>
        <div className={styles.dateCell}>
          {formatDate(news.created)}
        </div>
      </td>
      
      <td className={styles.td}>
        <div className={styles.actions}>
          <button
            className={styles.menuButton}
            onClick={toggleMenu}
            aria-label="Действия"
            type="button"
          >
            <DotsIcon size={20} />
          </button>

          {showMenu && (
            <div className={styles.menu}>
              <Link
                href={`/admin/news/${news.id}`}
                className={styles.menuItem}
                onClick={() => setShowMenu(false)}
              >
                Просмотреть
              </Link>

              <Link
                href={`/admin/news/${news.id}/edit`}
                className={styles.menuItem}
                onClick={() => setShowMenu(false)}
              >
                Редактировать
              </Link>

              <button
                className={styles.menuItem}
                onClick={() => {
                  onDelete(news.id);
                  setShowMenu(false);
                }}
                type="button"
              >
                Удалить
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};