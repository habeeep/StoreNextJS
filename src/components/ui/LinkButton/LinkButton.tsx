import { ButtonHTMLAttributes } from 'react';
import styles from './LinkButton.module.css';

interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const LinkButton = ({
  children,
  className,
  ...props
}: LinkButtonProps) => {
  
  const buttonClasses = [
    styles.linkButton,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      {...props}
      className={buttonClasses}
    >
      {children}
    </button>
  );
};