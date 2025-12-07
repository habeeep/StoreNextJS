'use client';

import { useState, useEffect } from 'react';
import { News, NewsFilters as FiltersType, SortOption } from '@/types/news';
import { SliderSection } from "../SliderSection/SliderSection";
import { NewsFilters } from '../NewsFilters/NewsFilters';
import { NewsCard } from '../NewsCard/NewsCard';
import styles from './NewsUserPage.module.css';

export const NewsUserPage = () => {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FiltersType>({
    sortBy: 'date-desc',
    showFavoritesOnly: false
  });

  // Моковые данные новостей
  const mockNews: News[] = [
    {
      id: '1',
      title: 'Новое поступление тропических растений',
      description: 'В нашем магазине появились редкие виды растений из тропических лесов',
      content: 'Полный текст новости...',
      images: ['/images/news/1-1.jpg', '/images/news/1-2.jpg'],
      createdAt: '2025-01-20T10:00:00Z',
      updatedAt: '2025-01-20T10:00:00Z',
      likesCount: 2,
      viewsCount: 156,
      commentsCount: 7,
      isLiked: false,
      isFavorite: true,
      author: { id: '1', name: 'Анна', surname: 'Цветкова' }
    },
    {
      id: '2',
      title: 'Новое поступление тропических растений',
      description: 'В нашем магазине появились редкие виды растений из тропических лесов',
      content: 'Полный текст новости...',
      images: ['/images/news/1-1.jpg', '/images/news/1-2.jpg'],
      createdAt: '2023-01-20T10:00:00Z',
      updatedAt: '2023-01-20T10:00:00Z',
      likesCount: 52,
      viewsCount: 156,
      commentsCount: 7,
      isLiked: false,
      isFavorite: true,
      author: { id: '1', name: 'Анна', surname: 'Цветкова' }
    },
    {
      id: '3',
      title: 'Новое поступление тропических растений',
      description: 'В нашем магазине появились редкие виды растений из тропических лесов',
      content: 'Полный текст новости...',
      images: ['/images/news/1-1.jpg', '/images/news/1-2.jpg'],
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z',
      likesCount: 42,
      viewsCount: 156,
      commentsCount: 7,
      isLiked: false,
      isFavorite: true,
      author: { id: '1', name: 'Анна', surname: 'Цветкова' }
    },
    {
      id: '4',
      title: 'Новое поступление тропических растений',
      description: 'В нашем магазине появились редкие виды растений из тропических лесов',
      content: 'Полный текст новости...',
      images: ['/images/news/1-1.jpg', '/images/news/1-2.jpg'],
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z',
      likesCount: 42,
      viewsCount: 156,
      commentsCount: 7,
      isLiked: false,
      isFavorite: true,
      author: { id: '1', name: 'Анна', surname: 'Цветкова' }
    },
    {
      id: '5',
      title: 'Новое поступление тропических растений',
      description: 'В нашем магазине появились редкие виды растений из тропических лесов',
      content: 'Полный текст новости...',
      images: ['/images/news/1-1.jpg', '/images/news/1-2.jpg'],
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z',
      likesCount: 42,
      viewsCount: 156,
      commentsCount: 7,
      isLiked: false,
      isFavorite: true,
      author: { id: '1', name: 'Анна', surname: 'Цветкова' }
    },
    // Добавь еще новостей...
  ];

  useEffect(() => {
    fetchNews();
  }, [filters]);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      // TODO: API запрос с фильтрами
      // Пока используем моки
      await new Promise(resolve => setTimeout(resolve, 500)); // Имитация загрузки
      
      // Применяем фильтры к моковым данным
      let filteredNews = [...mockNews];
      
      if (filters.showFavoritesOnly) {
        filteredNews = filteredNews.filter(item => item.isFavorite);
      }
      
      // Применяем сортировку
      filteredNews.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date-desc':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'date-asc':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'popularity-desc':
            return b.likesCount - a.likesCount;
          case 'popularity-asc':
            return a.likesCount - b.likesCount;
          default:
            return 0;
        }
      });
      
      setNews(filteredNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = (id: string) => {
    setNews(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            isLiked: !item.isLiked,
            likesCount: item.isLiked ? item.likesCount - 1 : item.likesCount + 1
          }
        : item
    ));
  };

  const handleFavorite = (id: string) => {
    setNews(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isFavorite: !item.isFavorite }
        : item
    ));
  };

  return (
    <>
        <SliderSection/>
        <div className={styles.newsUserPage}>
            <NewsFilters filters={filters} onFiltersChange={setFilters}/>
            { isLoading ? (
            <div className={styles.loading}>Загрузка новостей...</div>
            ) : (
            <div className={styles.newsList}>
                {news.length > 0 ? (
                news.map((item) => (
                    <NewsCard
                    key={item.id}
                    news={item}
                    onLike={handleLike}
                    onFavorite={handleFavorite}
                    />
                ))
                ) : (
                <div className={styles.noNews}>
                    {filters.showFavoritesOnly 
                    ? 'В избранном пока нет новостей' 
                    : 'Новостей пока нет'
                    }
                </div>
                )}
            </div>
            )}
        </div>
    </> 
  );
};