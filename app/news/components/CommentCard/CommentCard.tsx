'use client';

import { ApiComment } from '@/types/news';
import { UserIcon } from '@/components/ui/icons/UserIcon';
import styles from './CommentCard.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

interface CommentCardProps {
  comment: ApiComment;
}

export const CommentCard = ({ comment }: CommentCardProps) => {
  const custom = useCustomizer();
  const formattedDate = new Date(comment.created).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const userName = comment.userMail.split('@')[0];

  return (
    <div className={styles.commentCard}>
      <div className={styles.commentWrapper}>
        <div className={styles.leftDivider}>
          <UserIcon size={14} className={styles.userIcon} style={{"--color-custom": `var(--color-${custom.theme}-400)`,
          "--color-custom-bg": `var(--color-${custom.theme}-900)`} as React.CSSProperties}/>
          <div className={styles.line} style={{"--color-custom": `var(--color-${custom.theme}-900)`} as React.CSSProperties}></div>
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
      <div className={styles.divider} style={{"--color-custom": `var(--color-${custom.theme}-800)`} as React.CSSProperties}></div>
    </div>
  );
};