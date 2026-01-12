// app/news/components/NewsCard/NewsCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { NewsItem } from '@/types/news';
import { NewsCommentSection } from '../NewsCommentSection/NewsCommentSection';
import styles from './NewsCard.module.css';

import { HeartIcon } from '@/components/ui/icons/HeartIcon';
import { EyeIcon } from '@/components/ui/icons/EyeIcon';
import { CommentIcon } from '@/components/ui/icons/CommentIcon';
import { StarIcon } from '@/components/ui/icons/StarIcon';

interface NewsCardProps {
  news: NewsItem & { isLiked?: boolean; isFavorite?: boolean };
  onLike: (id: string) => void;
  onFavorite: (id: string) => void;
  currentUserEmail?: string;
}

export const NewsCard = ({ 
  news, 
  onLike, 
  onFavorite,
  currentUserEmail 
}: NewsCardProps) => {
  const [showComments, setShowComments] = useState(false);
  
  const formattedDate = new Date(news.created).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleLikeClick = () => {
    if (!currentUserEmail) {
      alert('Для лайка нужно войти в систему');
      return;
    }
    onLike(news.id);
  };

  const handleFavoriteClick = () => {
    if (!currentUserEmail) {
      alert('Для добавления в избранное нужно войти в систему');
      return;
    }
    onFavorite(news.id);
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  // Используем текст новости как описание (первые 150 символов)
  const description = news.text.length > 150 
    ? news.text.substring(0, 150) + '...' 
    : news.text;
    
  // Если нет изображений, используем дефолтное
  const images = news.images && news.images.length > 0 
    ? news.images 
    : ['/images/news/hero1.png'];

  // Условные поля, если не пришли с бэкенда
  const isLiked = news.isLiked || false;
  const isFavorite = news.isFavorite || false;

  return (
    <div className={styles.newsCard}>
      <div className={styles.cardContent}>
        <div className={styles.textSection}>
          <h3 className={styles.title}>{news.title}</h3>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.rightSection}>
          {images.length > 0 && (
            <div className={styles.images}>
              {images.slice(0, 3).map((image, index) => (
                <div key={index} className={styles.imageContainer}>
                  <Image
                    src={image}
                    alt='Растение'
                    fill
                    sizes='(max-width: 490px) 100vw, 1200px'
                    priority
                    className={styles.image}
                  />
                </div>
              ))}
            </div>
          )}

          <div className={styles.stats}>
            <div className={styles.buttonsRow}>
              <button 
                className={`${styles.iconButton} ${styles.iconCounter} ${isLiked ? styles.liked : ''}`}
                onClick={handleLikeClick}
                aria-label="Лайк"
                disabled={!currentUserEmail}
              >
                <HeartIcon isFilled={isLiked}/>
                <span className={styles.count}>{news.likesCount}</span>
              </button>

              <div className={`${styles.views} ${styles.iconCounter}`}>
                <EyeIcon/>
                <span className={styles.count}>{news.watchCount}</span>
              </div>

              <button 
                className={`${styles.iconButton} ${styles.iconCounter} ${showComments ? styles.active : ''}`}
                onClick={handleCommentClick}
                aria-label="Комментарии"
              >
                <CommentIcon isFilled={showComments}/>
                <span className={styles.count}>{news.commentsCount}</span>
              </button>

              <button 
                className={`${styles.iconButton} ${isFavorite ? styles.favorited : ''}`}
                onClick={handleFavoriteClick}
                aria-label="В избранное"
                disabled={!currentUserEmail}
              >
                <StarIcon isFilled={isFavorite}/>
              </button>
            </div>

            <div className={styles.date}>{formattedDate}</div>
          </div>
        </div>
      </div>

      <div className={styles.divider}></div>
      <NewsCommentSection
        newsId={news.id}
        newsComments={news.comments}
        currentUserEmail={currentUserEmail}
        className={`${styles.commentSection} ${showComments ? styles.commentSectionShow : ''}`}
      />
    </div>
  );
};