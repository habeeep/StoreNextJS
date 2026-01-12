// app/news/components/NewsUserPage/NewsUserPage.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { NewsItem, NewsFilters as NewsFiltersType, SortOption } from '@/types/news';
import { newsApi } from '@/lib/api/newsApi';
import { NewsCard } from '../NewsCard/NewsCard';
import { NewsFilters } from '../NewsFilters/NewsFilters';
import { SliderSection } from '../SliderSection/SliderSection';
import styles from './NewsUserPage.module.css';

export const NewsUserPage = () => {
  const [filters, setFilters] = useState<NewsFiltersType>({
    sortBy: 'date-desc',
    showFavoritesOnly: false
  });

  const [news, setNews] = useState<NewsItem[]>([]);
  const [favorites, setFavorites] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = useAppSelector((state) => state.auth.user);
  const userEmail = currentUser?.email;

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await newsApi.getNews({ limit: 100, offset: 0 });
      setNews(response.currentValues);
    } catch (err) {
      console.error('Ошибка при загрузке новостей:', err);
      setError('Не удалось загрузить новости');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (!userEmail) {
      setFavorites([]);
      return;
    }

    setIsLoadingFavorites(true);
    try {
      const response = await newsApi.getFavourites({
        user_mail: userEmail,
        limit: 100,
        offset: 0
      });
      setFavorites(response.currentValues);
    } catch (err) {
      console.error('Ошибка при загрузке избранных:', err);
      setFavorites([]);
    } finally {
      setIsLoadingFavorites(false);
    }
  }, [userEmail]);


  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleLike = useCallback(async (id: string) => {
    if (!userEmail) {
      alert('Для лайка нужно войти в систему');
      return;
    }

    try {
      await newsApi.likeNews(id, userEmail);
      
      setNews(prev => prev.map(item => 
        item.id === id 
          ? { ...item, likesCount: item.likesCount + 1 }
          : item
      ));
      
      setFavorites(prev => prev.map(item => 
        item.id === id 
          ? { ...item, likesCount: item.likesCount + 1 }
          : item
      ));
      
    } catch (err) {
      console.error('Ошибка при лайке:', err);
      alert('Не удалось поставить лайк');
    }
  }, [userEmail]);

  const handleFavorite = useCallback(async (id: string) => {
    if (!userEmail) {
      alert('Для добавления в избранное нужно войти в систему');
      return;
    }

    try {
      const newsItem = news.find(item => item.id === id);
      const isFavorite = favorites.some(item => item.id === id);

      if (isFavorite) {
        await newsApi.removeFromFavourites(id, userEmail);
        setFavorites(prev => prev.filter(item => item.id !== id));
      } else {
        await newsApi.addToFavourites(id, userEmail);
        if (newsItem) {
          setFavorites(prev => [newsItem, ...prev]);
        }
      }
    } catch (err) {
      console.error('Ошибка при работе с избранным:', err);
      alert('Не удалось изменить избранное');
    }
  }, [userEmail, news, favorites]);

  const filteredAndSortedNews = useMemo(() => {
    let result = filters.showFavoritesOnly ? [...favorites] : [...news];

    if (filters.showFavoritesOnly && !userEmail) {
      return [];
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-desc':
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        case 'date-asc':
          return new Date(a.created).getTime() - new Date(b.created).getTime();
        case 'popularity-desc':
          return b.likesCount - a.likesCount || b.watchCount - a.watchCount;
        case 'popularity-asc':
          return a.likesCount - b.likesCount || a.watchCount - b.watchCount;
        default:
          return 0;
      }
    });

    return result;
  }, [news, favorites, filters, userEmail]);

  const getNewsWithUserData = useCallback((newsItem: NewsItem) => {
    const isLiked = false;
    const isFavorite = favorites.some(item => item.id === newsItem.id);
    
    return {
      ...newsItem,
      isLiked,
      isFavorite,
    };
  }, [favorites]);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка новостей...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.page}>
      <SliderSection />
      
      <div className={styles.content}>
        <NewsFilters
          filters={filters}
          onFiltersChange={setFilters}
          isLoggedIn={!!userEmail}
        />
        
        {filters.showFavoritesOnly && !userEmail && (
          <div className={styles.authWarning}>
            Для просмотра избранных новостей нужно войти в систему
          </div>
        )}
        
        {filters.showFavoritesOnly && isLoadingFavorites && (
          <div className={styles.loading}>Загрузка избранных...</div>
        )}
        
        <div className={styles.newsList}>
          {filteredAndSortedNews.length > 0 ? (
            filteredAndSortedNews.map((newsItem) => (
              <NewsCard
                key={newsItem.id}
                news={getNewsWithUserData(newsItem)}
                onLike={handleLike}
                onFavorite={handleFavorite}
                currentUserEmail={userEmail}
              />
            ))
          ) : (
            <div className={styles.noNews}>
              {filters.showFavoritesOnly ? 'В избранном пока ничего нет' : 'Новостей пока нет'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};