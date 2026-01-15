import { InputHTMLAttributes, forwardRef } from 'react';
import { CrossIcon } from '../icons/CrossIcon';
import styles from './Input.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  showClearButton?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  error,
  showClearButton = false,
  onClear,
  className,
  ...props
}, ref) => {
  const custom = useCustomizer();
  
  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <input
          ref={ref}
          {...props}
          className={`${styles.input} ${className || ''}`}
          style={{"--color-custom": `var(--color-${custom.theme}-100)`,
          "--color-custom-bor": `var(--color-${custom.theme}-500)`} as React.CSSProperties}
        />
        
        {showClearButton && props.value && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Очистить поле"
            style={{"--color-custom": `var(--color-${custom.theme}-500)`} as React.CSSProperties}
          >
            <CrossIcon size={24} strokeWidth={7}/>
          </button>
        )}
      </div>
      
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
});
