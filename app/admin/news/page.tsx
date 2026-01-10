'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NewsItem } from '@/types/news';
import { newsApi } from '@/lib/api/newsApi';
import { AdminNewsTable } from './components/AdminNewsTable/AdminNewsTable';
import { Container } from '@/components/layout/Container/Container';
import { Button } from '@/components/ui/Button/Button';
import { PlusIcon } from '@/components/ui/icons/PlusIcon';
import styles from './page.module.css';

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    limit: 100,
    offset: 0,
  });

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await newsApi.getNews(pagination.limit, pagination.offset);
      setNews(response.currentValues);
      setPagination({
        totalCount: response.totalCount,
        limit: response.limit,
        offset: response.offset,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки новостей');
      console.error('Failed to fetch news:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Удалить новость?')) {
      try {
        setNews(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error('Failed to delete news:', err);
        alert('Ошибка при удалении новости');
      }
    }
  };

  const handleRefresh = () => {
    fetchNews();
  };

  return (
    <Container>
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Управление новостями</h1>
            {pagination.totalCount > 0 && (
              <div className={styles.count}>
                Всего новостей: {pagination.totalCount}
              </div>
            )}
          </div>
          
          <div className={styles.buttons}>
            <Button onClick={handleRefresh} variant="secondary">
              Обновить
            </Button>
            <Link href="/admin/news/create">
              <Button>
                <PlusIcon size={20} />
                Создать новость
              </Button>
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className={styles.loading}>Загрузка новостей...</div>
        )}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <Button onClick={handleRefresh} variant="secondary">
              Попробовать снова
            </Button>
          </div>
        )}

        {!isLoading && !error && (
          <AdminNewsTable 
            news={news}
            onDelete={handleDelete}
          />
        )}
      </div>
    </Container>
  );
}