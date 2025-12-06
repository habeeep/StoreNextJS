import { ReactNode } from 'react';
import styles from './Container.module.css';

interface ContainerProps {
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export const Container = ({ 
  children, 
  fullWidth = false, 
  className = '' 
}: ContainerProps) => {
  
  const containerClasses = [
    styles.container,
    fullWidth && styles.fullWidth,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};