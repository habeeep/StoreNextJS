'use client';

import { useState } from 'react';
import { ApiComment } from '@/types/news';
import { newsApi } from '@/lib/api/newsApi';
import { CommentCard } from '../CommentCard/CommentCard';
import styles from './NewsCommentSection.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

interface NewsCommentSectionProps {
  newsId: string;
  newsComments: ApiComment[] | null;
  currentUserEmail?: string;
  className?: string;
}

export const NewsCommentSection = ({ 
  newsId, 
  newsComments, 
  currentUserEmail,
  className = '' 
}: NewsCommentSectionProps) => {
  const custom = useCustomizer();
  const [comments, setComments] = useState<ApiComment[]>(newsComments || []);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    if (!currentUserEmail) {
      alert('Для отправки комментария нужно войти в систему');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await newsApi.createComment({
        text: newComment,
        userMail: currentUserEmail,
        feedId: newsId
      });

      setComments([response, ...comments]);
      setNewComment('');
      
    } catch (err) {
      console.error('Ошибка при отправке комментария:', err);
      setError(err instanceof Error ? err.message : 'Не удалось отправить комментарий');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.commentSection} ${className}`} style={{"--color-custom": `var(--color-${custom.theme}-400)`} as React.CSSProperties}>
      <div className={styles.commentContent}>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
        <div className={styles.commentsList}>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          ) : (
            <p className={styles.noComments}>Комментариев пока нет</p>
          )}
        </div>
        
        <form onSubmit={handleSubmitComment} className={styles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={currentUserEmail ? "Оставьте комментарий..." : "Для комментария нужно войти в систему"}
            className={styles.textarea}
            required
            disabled={!currentUserEmail || isLoading}
            style={{"--color-custom": `var(--color-${custom.theme}-100)`} as React.CSSProperties}
          />
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading || !newComment.trim() || !currentUserEmail}
            style={{"--color-custom": `var(--color-${custom.theme}-600)`,
          "--color-custom-100": `var(--color-${custom.theme}-100)`} as React.CSSProperties}
          >
            {isLoading ? '...' : '+'}
          </button>
        </form>
        
        {!currentUserEmail && (
          <p className={styles.authHint}>
            Войдите в систему, чтобы оставлять комментарии
          </p>
        )}
      </div>
    </div>
  );
};