import { ReactNode } from 'react';
import styles from './ImageContainer.module.css';

interface ImageContainerProps {
  children: ReactNode;
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'custom';
  ratio?: number;
  className?: string;
}

export const ImageContainer = ({
  children,
  aspectRatio = 'landscape',
  ratio,
  className = '',
}: ImageContainerProps) => {
  
  const getAspectRatio = () => {
    if (ratio) return ratio;
    switch (aspectRatio) {
      case 'square': return 1;
      case 'portrait': return 9/16;
      case 'landscape': return 16/9;
      default: return 16/9;
    }
  };

  return (
    <div 
      className={`${styles.container} ${className}`}
      style={{ aspectRatio: getAspectRatio() }}
    >
      {children}
    </div>
  );
};