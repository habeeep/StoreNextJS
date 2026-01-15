'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { NewsItem } from '@/types/news';
import { newsApi } from '@/lib/api/newsApi';
import { Container } from '@/components/layout/Container/Container';
import { Button } from '@/components/ui/Button/Button';
import styles from './page.module.css';
import { CommentIcon } from '@/components/ui/icons/CommentIcon';
import { EyeIcon } from '@/components/ui/icons/EyeIcon';
import { HeartIcon } from '@/components/ui/icons/HeartIcon';
import { useCustomizer } from '@/hooks/useCustomizer';

export default function NewsDetailPage() {
  const custom = useCustomizer();
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const newsId = params.id as string;

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newsData = await newsApi.getNewsById(newsId);
      setNews(newsData);
    } catch (err) {
      console.error('Ошибка при загрузке новости:', err);
      setError(err instanceof Error ? err.message : 'Не удалось загрузить новость');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [newsId]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Дата не указана';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) return <div className={styles.loading}>Загрузка новости...</div>;
  
  if (error) return (
    <Container>
      <div className={styles.error}>
        <h2>Ошибка</h2>
        <p>{error}</p>
        <Button onClick={() => router.push('/admin/news')}>
          Вернуться к списку
        </Button>
      </div>
    </Container>
  );
  
  if (!news) return (
    <Container>
      <div className={styles.notFound}>
        <h2>Новость не найдена</h2>
        <p>Новость с ID {newsId} не существует</p>
        <Button onClick={() => router.push('/admin/news')}>
          Вернуться к списку
        </Button>
      </div>
    </Container>
  );

  return (
    <Container>
      <div className={styles.page} style={{"--color-custom": `var(--color-${custom.theme}-200)`} as React.CSSProperties}>
        <div className={styles.header}>
          <Button
            className={styles.backButton}
            onClick={() => router.push('/admin/news')}
            variant='secondary'
          >
            ← Назад к списку
          </Button>
          
          <div className={styles.headerActions}>
            <Button
              onClick={() => router.push(`/admin/news/${newsId}/edit`)}
              className={styles.editButton}
            >
              Редактировать
            </Button>
          </div>
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>{news.title}</h1>
          
          <div className={styles.meta}>
            <span className={styles.date}>
              Создано: {formatDate(news.created)}
            </span>
            {news.updated && (
              <span className={styles.date}>
                Обновлено: {formatDate(news.updated)}
              </span>
            )}
          </div>
          
          <div className={styles.textContent}>
            {news.text.split('\n').map((paragraph, index) => (
              <p key={index} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* TODO: Добавить отображение изображений, когда API будет их поддерживать */}
          {/* {news.images && news.images.length > 0 && (
            <div className={styles.images}>
              {news.images.map((image, index) => (
                <img 
                  key={index} 
                  src={image} 
                  alt={`Изображение ${index + 1}`} 
                  className={styles.image}
                />
              ))}
            </div>
          )} */}
          
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statIcon}><HeartIcon /></span>
              <span className={styles.statCount}>{news.likesCount}</span>
            </div>
            
            <div className={styles.statItem}>
              <span className={styles.statIcon}><EyeIcon /></span>
              <span className={styles.statCount}>{news.watchCount}</span>
            </div>
            
            <div className={styles.statItem}>
              <span className={styles.statIcon}><CommentIcon /></span>
              <span className={styles.statCount}>{news.commentsCount}</span>
            </div>
          </div>
          
          {news.comments && news.comments.length > 0 && (
            <div className={styles.commentsSection}>
              <h3 className={styles.commentsTitle}>Комментарии ({news.comments.length})</h3>
              
              <div className={styles.commentsList}>
                {news.comments.map((comment) => (
                  <div key={comment.id} className={styles.comment}>
                    <div className={styles.commentHeader}>
                      <span className={styles.commentAuthor}>
                        {comment.userMail}
                      </span>
                      <span className={styles.commentDate}>
                        {formatDate(comment.created)}
                      </span>
                    </div>
                    
                    <div className={styles.commentText}>
                      {comment.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}