import React from 'react';
import styles from './OnboardingButton.module.css';

export default function OnboardingButton({
  children,
  variant = 'primary',
  ...props
}) {
  return (
    <button
      className={[
        styles.button,
        styles[variant],
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
} 