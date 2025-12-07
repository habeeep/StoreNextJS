import React from 'react';
import styles from './ToggleSwitch.module.css';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
  labelPosition?: 'left' | 'right';
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  labelClassName = '',
  containerClassName = '',
  labelPosition = 'left'
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label className={`${styles.container} ${containerClassName}`}>
      {label && labelPosition === 'left' && (
        <span className={`${styles.label} ${labelClassName}`}>{label}</span>
      )}
      
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={styles.hiddenCheckbox}
      />
      
      <div className={styles.toggleTrack}>
        <div className={styles.toggleThumb} />
      </div>
      
      {label && labelPosition === 'right' && (
        <span className={`${styles.label} ${labelClassName}`}>{label}</span>
      )}
    </label>
  );
};