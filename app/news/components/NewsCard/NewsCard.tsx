'use client';

import { useState } from 'react';
import { News } from '@/types/news';
import { NewsCommentSection } from '../NewsCommentSection/NewsCommentSection';
import styles from './NewsCard.module.css';

import { HeartIcon } from '@/components/ui/icons/HeartIcon';
import { EyeIcon } from '@/components/ui/icons/EyeIcon';
import { CommentIcon } from '@/components/ui/icons/CommentIcon';
import { StarIcon } from '@/components/ui/icons/StarIcon';

interface NewsCardProps {
  news: News;
  onLike: (id: string) => void;
  onFavorite: (id: string) => void;
}

export const NewsCard = ({ news, onLike, onFavorite }: NewsCardProps) => {
  const [showComments, setShowComments] = useState(false);
  
  const formattedDate = new Date(news.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleLikeClick = () => {
    onLike(news.id);
  };

  const handleFavoriteClick = () => {
    onFavorite(news.id);
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  return (
    <div className={styles.newsCard}>
      <div className={styles.cardContent}>
        <div className={styles.textSection}>
          <h3 className={styles.title}>{news.title}</h3>
          <p className={styles.description}>{news.description}</p>
        </div>

        <div className={styles.rightSection}>
          {news.images.length > 0 && (
            <div className={styles.images}>
              {news.images.slice(0, 3).map((image, index) => (
                <div key={index} className={styles.imageContainer}>
                  <div className={styles.imagePlaceholder}>
                    <span>IMG {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.stats}>
            <div className={styles.buttonsRow}>
              <button 
                className={`${styles.iconButton} ${styles.iconCounter} ${news.isLiked ? styles.liked : ''}`}
                onClick={handleLikeClick}
                aria-label="Лайк"
              >
                <HeartIcon isFilled={news.isLiked}/>
                <span className={styles.count}>{news.likesCount}</span>
              </button>

              <div className={`${styles.views} ${styles.iconCounter}`}>
                <EyeIcon/>
                <span className={styles.count}>{news.viewsCount}</span>
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
                className={`${styles.iconButton} ${news.isFavorite ? styles.favorited : ''}`}
                onClick={handleFavoriteClick}
                aria-label="В избранное"
              >
                <StarIcon isFilled={news.isFavorite}/>
              </button>
            </div>

            <div className={styles.date}>{formattedDate}</div>
          </div>
        </div>
      </div>

      <div className={styles.divider}></div>
      <NewsCommentSection
        newsId={news.id}
        className={`${styles.commentSection} ${showComments ? styles.commentSectionShow : ''}`}
      />
    </div>
  );
};