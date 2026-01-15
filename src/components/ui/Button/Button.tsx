import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const Button = ({
  variant = 'primary',
  isLoading = false,
  className,
  children,
  ...props
}: ButtonProps) => {
  const custom = useCustomizer();
  const buttonClasses = [
    styles.button,
    styles[variant],
    isLoading && styles.loading,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...props}
      className={buttonClasses}
      disabled={props.disabled || isLoading}
      style={{"--color-custom": `var(--color-${custom.theme}-600)`} as React.CSSProperties}
    >
      {children}
    </button>
  );
};