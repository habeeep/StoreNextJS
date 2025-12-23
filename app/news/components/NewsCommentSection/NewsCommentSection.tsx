'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/types/news';
import { CommentCard } from '../CommentCard/CommentCard';
import styles from './NewsCommentSection.module.css';

interface NewsCommentSectionProps {
  newsId: string;
  className?: string;
}

export const NewsCommentSection = ({ newsId, className = '' }: NewsCommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mockComments: Comment[] = [
    {
      id: '1',
      text: 'Отличная новость! Ждем еще такие статьи.',
      createdAt: '2024-01-15T10:30:00Z',
      author: { id: '1', name: 'Иван', surname: 'Петров' }
    },
    {
      id: '2',
      text: 'Интересный материал, спасибо!',
      createdAt: '2024-01-14T15:45:00Z',
      author: { id: '2', name: 'Мария', surname: 'Сидорова' }
    }
  ];

  useEffect(() => {
    setComments(mockComments);
  }, [newsId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const mockNewComment: Comment = {
        id: Date.now().toString(),
        text: newComment,
        createdAt: new Date().toISOString(),
        author: { id: 'current-user', name: 'Вы', surname: '' }
      };

      setComments([mockNewComment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.commentSection} ${className}`}>
      <div className={styles.commentContent}>
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
            placeholder="Комментарий"
            className={styles.textarea}
            required
          />
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading || !newComment.trim()}
          >
            +
          </button>
        </form>
      </div>
    </div>
  );
};