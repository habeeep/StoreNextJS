import { ButtonHTMLAttributes } from 'react';
import styles from './LinkButton.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const LinkButton = ({
  children,
  className,
  ...props
}: LinkButtonProps) => {
  const custom = useCustomizer();
  
  const buttonClasses = [
    styles.linkButton,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      {...props}
      className={buttonClasses}
      style={{"--color-custom": `var(--color-${custom.theme}-500)`} as React.CSSProperties}
    >
      {children}
    </button>
  );
};