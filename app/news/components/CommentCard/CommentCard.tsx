// app/news/components/CommentCard/CommentCard.tsx
'use client';

import { ApiComment } from '@/types/news';
import { UserIcon } from '@/components/ui/icons/UserIcon';
import styles from './CommentCard.module.css';

interface CommentCardProps {
  comment: ApiComment;
}

export const CommentCard = ({ comment }: CommentCardProps) => {
  const formattedDate = new Date(comment.created).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Извлекаем имя из email (все до @)
  const userName = comment.userMail.split('@')[0];

  return (
    <div className={styles.commentCard}>
      <div className={styles.commentWrapper}>
        <div className={styles.leftDivider}>
          <UserIcon size={14} className={styles.userIcon}/>
          <div className={styles.line}></div>
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.author}>
              <span className={styles.name}>
                {userName}
              </span>
              <span className={styles.date}>{formattedDate}</span>
            </div>
          </div>
          <div className={styles.text}>{comment.text}</div>
        </div>
      </div>
      <div className={styles.divider}></div>
    </div>
  );
};