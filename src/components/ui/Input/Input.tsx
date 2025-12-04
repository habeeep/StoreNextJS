import { InputHTMLAttributes, forwardRef } from 'react';
import { CrossIcon } from '../icons/CrossIcon';
import styles from './Input.module.css';

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
        />
        
        {showClearButton && props.value && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Очистить поле"
          >
            <CrossIcon size={24} />
          </button>
        )}
      </div>
      
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
});