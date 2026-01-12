// components/ui/ToggleSwitch/ToggleSwitch.tsx
import React from 'react';
import styles from './ToggleSwitch.module.css';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
  labelPosition?: 'left' | 'right';
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  labelClassName = '',
  containerClassName = '',
  labelPosition = 'left',
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  const containerClasses = [
    styles.container,
    containerClassName,
    disabled ? styles.disabled : ''
  ].filter(Boolean).join(' ');

  return (
    <label className={containerClasses}>
      {label && labelPosition === 'left' && (
        <span className={`${styles.label} ${labelClassName} ${disabled ? styles.labelDisabled : ''}`}>
          {label}
        </span>
      )}
      
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={styles.hiddenCheckbox}
        disabled={disabled}
      />
      
      <div className={`${styles.toggleTrack} ${disabled ? styles.toggleTrackDisabled : ''}`}>
        <div className={styles.toggleThumb} />
      </div>
      
      {label && labelPosition === 'right' && (
        <span className={`${styles.label} ${labelClassName} ${disabled ? styles.labelDisabled : ''}`}>
          {label}
        </span>
      )}
    </label>
  );
};