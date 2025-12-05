import { ReactNode } from 'react';
import styles from './Container.module.css';

interface ContainerProps {
  children: ReactNode;
  fullWidth?: boolean;
}

export const Container = ({ children, fullWidth = false }: ContainerProps) => {
  return (
    <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}>
      {children}
    </div>
  );
};