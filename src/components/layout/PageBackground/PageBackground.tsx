'use client';

import { CSSProperties } from 'react';
import styles from './PageBackground.module.css';

interface PageBackgroundProps {
  imageUrl: string;
  topOffset?: string;
  className?: string;
}

export const PageBackground = ({
  imageUrl,
  topOffset = '0px',
  className = '',
}: PageBackgroundProps) => {
  
  const inlineStyles: CSSProperties = {
    '--bg-image-url': `url(${imageUrl})`,
    '--top-offset': topOffset,
  } as CSSProperties;

  return (
    <div 
      className={`${styles.pageBackground} ${className}`}
      style={inlineStyles}
      aria-hidden="true"
    />
  );
};