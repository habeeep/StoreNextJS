'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { News } from '@/types/news';
import { Container } from '@/components/layout/Container/Container';
import { Button } from '@/components/ui/Button/Button';
// import { EditIcon } from '@/components/ui/icons/EditIcon';
// import { ArrowLeftIcon } from '@/components/ui/icons/ArrowLeftIcon';
import styles from './page.module.css';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const newsId = params.id as string;

  useEffect(() => {
    // TODO: Запрос к API
    // Моковые данные
    const mockNews: News = {
      id: newsId,
      title: 'Новое поступление тропических растений',
      description: 'В нашем магазине появились редкие виды растений из тропических лесов',
      content: 'Полный текст новости...',
      images: ['/images/news/hero1.png', '/images/news/hero2.png'],
      createdAt: '2025-01-20T10:00:00Z',
      updatedAt: '2025-01-20T10:00:00Z',
      likesCount: 42,
      viewsCount: 156,
      commentsCount: 7,
      isLiked: false,
      isFavorite: false,
      author: { id: '1', name: 'Анна', surname: 'Цветкова' }
    };
    
    setNews(mockNews);
    setIsLoading(false);
  }, [newsId]);

  if (isLoading) return <div>Загрузка...</div>;
  if (!news) return <div>Новость не найдена</div>;

  return (
    <Container>
      <div className={styles.page}>
        {/* Заголовок и кнопки */}
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={() => router.push('/admin/news')}
          >
            {/* <ArrowLeftIcon size={20} /> */}
            Назад к списку
          </button>
          
          <Button
            onClick={() => router.push(`/admin/news/${newsId}/edit`)}
          >
            {/* <EditIcon size={20} /> */}
            Редактировать
          </Button>
        </div>

        {/* Контент новости (можно переиспользовать NewsCard или сделать упрощенную версию) */}
        <div className={styles.content}>
          <h1 className={styles.title}>{news.title}</h1>
          <p className={styles.description}>{news.description}</p>
          
          {news.images.length > 0 && (
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
          )}
          
          <div className={styles.stats}>
            <span>❤️ {news.likesCount}</span>
            <span>👁️ {news.viewsCount}</span>
            <span>💬 {news.commentsCount}</span>
          </div>
        </div>
      </div>
    </Container>
  );
}