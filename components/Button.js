import React from 'react';
import styles from './Button.module.css';
import Image from 'next/image';

export default function Button({
  children,
  icon,
  iconPosition = 'right',
  variant = 'primary',
  fullWidth = false,
  ...props
}) {
  const iconElement = icon ? (
    typeof icon === 'string' ? (
      <Image src={icon} alt="icon" width={24} height={24} className={styles.icon} />
    ) : (
      <span className={styles.icon}>{icon}</span>
    )
  ) : null;

  return (
    <button
      className={[
        styles.button,
        styles[variant],
        fullWidth ? styles.fullWidth : '',
      ].join(' ')}
      {...props}
    >
      {icon && iconPosition === 'left' && iconElement}
      <span className={styles.text}>{children}</span>
      {icon && iconPosition === 'right' && iconElement}
    </button>
  );
} 