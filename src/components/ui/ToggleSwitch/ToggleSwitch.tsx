import React from 'react';
import styles from './ToggleSwitch.module.css';
import { useCustomizer } from '@/hooks/useCustomizer';

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
  const custom = useCustomizer();
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
      
      <div className={`${styles.toggleTrack} ${disabled ? styles.toggleTrackDisabled : ''}`} style={{"--color-custom": `var(--color-${custom.theme}-600)`,
          "--color-custom-200": `var(--color-${custom.theme}-200)`} as React.CSSProperties}>
        <div className={styles.toggleThumb} style={{"--color-custom": `var(--color-${custom.theme}-100)`} as React.CSSProperties}/>
      </div>
      
      {label && labelPosition === 'right' && (
        <span className={`${styles.label} ${labelClassName} ${disabled ? styles.labelDisabled : ''}`}>
          {label}
        </span>
      )}
    </label>
  );
};